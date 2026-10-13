import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { leadSchema } from "@/lib/lead-schema";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 7 * 1024 * 1024)
    return NextResponse.json(
      { message: "Envio muito grande. Use até 3 fotos de 2 MB." },
      { status: 413 },
    );
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { message: "Origem não autorizada." },
      { status: 403 },
    );
  const ip = createHash("sha256")
    .update(
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local",
    )
    .digest("hex");
  const now = Date.now();
  for (const [key, entry] of attempts)
    if (entry.reset < now) attempts.delete(key);
  const attempt = attempts.get(ip) || { count: 0, reset: now + 600000 };
  attempt.count++;
  attempts.set(ip, attempt);
  if (attempt.count > 8)
    return NextResponse.json(
      {
        message:
          "Muitas tentativas. Aguarde alguns minutos ou fale pelo WhatsApp.",
      },
      { status: 429 },
    );
  try {
    const form = await request.formData();
    const parsed = leadSchema.safeParse(
      JSON.parse(String(form.get("lead") || "{}")),
    );
    if (!parsed.success)
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Confira os campos." },
        { status: 400 },
      );
    if (parsed.data.website)
      return NextResponse.json(
        { message: "Não foi possível processar este envio." },
        { status: 400 },
      );
    const photos = form
      .getAll("photos")
      .filter((p): p is File => p instanceof File);
    if (
      photos.length > 3 ||
      photos.some(
        (f) =>
          f.size > 2 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(f.type),
      )
    )
      return NextResponse.json(
        {
          message:
            "Fotos inválidas. Use até 3 arquivos JPG, PNG ou WebP, de até 2 MB cada.",
        },
        { status: 400 },
      );
    for (const photo of photos) {
      const bytes = Buffer.from(await photo.arrayBuffer());
      const valid =
        photo.type === "image/jpeg"
          ? bytes[0] === 255 && bytes[1] === 216
          : photo.type === "image/png"
            ? bytes
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : bytes.toString("ascii", 0, 4) === "RIFF" &&
              bytes.toString("ascii", 8, 12) === "WEBP";
      if (!valid)
        return NextResponse.json(
          { message: "Uma fotografia tem formato inválido." },
          { status: 400 },
        );
    }
    const endpoint = process.env.LEADS_WEBHOOK_URL;
    if (!endpoint)
      return NextResponse.json({
        delivered: false,
        message:
          "Esta demonstração não está conectada a um CRM. Seus dados não foram armazenados. Toque abaixo para enviar sua mensagem pelo WhatsApp.",
      });
    if (new URL(endpoint).protocol !== "https:")
      throw new Error("Webhook requires HTTPS");
    const forward = new FormData();
    const { website, ...lead } = parsed.data;
    void website;
    forward.set(
      "lead",
      JSON.stringify({
        ...lead,
        source: "ninho-site",
        createdAt: new Date().toISOString(),
      }),
    );
    photos.forEach((f, i) =>
      forward.append(
        "photos",
        f,
        `veiculo-${i + 1}.${f.type === "image/jpeg" ? "jpg" : f.type === "image/png" ? "png" : "webp"}`,
      ),
    );
    const response = await fetch(endpoint, {
      method: "POST",
      body: forward,
      headers: process.env.LEADS_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.LEADS_WEBHOOK_TOKEN}` }
        : {},
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Webhook failure");
    return NextResponse.json({
      delivered: true,
      message:
        "Seu contato foi encaminhado para atendimento. Nossa equipe confirmará os próximos passos pelo telefone informado.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Não foi possível encaminhar agora. Tente novamente ou fale pelo WhatsApp.",
      },
      { status: 502 },
    );
  }
}
