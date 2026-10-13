"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "@/components/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  UploadCloud,
  X,
} from "lucide-react";
import { leadSchema, type Lead } from "@/lib/lead-schema";
import { attribution, track } from "@/lib/analytics";
import { whatsapp } from "@/config/site";
type Kind = Lead["kind"];
export function LeadForm({
  kind = "contato",
  vehicle,
}: {
  kind?: Kind;
  vehicle?: string;
}) {
  const [step, setStep] = useState(1),
    [files, setFiles] = useState<File[]>([]),
    [photoError, setPhotoError] = useState(""),
    [result, setResult] = useState<{
      delivered: boolean;
      message: string;
    } | null>(null),
    [failure, setFailure] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sell = kind === "avaliacao";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: { kind, consent: false, website: "", message: "" },
  });
  const [car, setCar] = useState({ brand: "", model: "", year: "", km: "" });
  const [schedule, setSchedule] = useState({ date: "", time: "09:00" });
  const [prepared, setPrepared] = useState("");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bahia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  async function submit(data: Lead) {
    setFailure("");
    const message = [
      data.message,
      vehicle && `Veículo: ${vehicle}`,
      sell && `Avaliação: ${car.brand} ${car.model}, ${car.year}, ${car.km} km`,
      kind === "test-drive" &&
        `Preferência de test-drive: ${schedule.date} às ${schedule.time} (sujeito a confirmação)`,
    ]
      .filter(Boolean)
      .join("\n");
    const payload = { ...data, message, utm: attribution() };
    const form = new FormData();
    form.set("lead", JSON.stringify(payload));
    files.forEach((f) => form.append("photos", f));
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        body: form,
      });
      const json = (await response.json()) as {
        delivered: boolean;
        message: string;
      };
      if (!response.ok)
        throw new Error(
          json.message || "Não foi possível enviar. Tente novamente.",
        );
      setPrepared(
        `Olá! Meu nome é ${data.name}. Vim pelo site da Ninho Veículos.\n${message || "Gostaria de conversar com a equipe."}\nMeu telefone: ${data.phone}.${files.length ? " Tenho fotos do veículo para anexar nesta conversa." : ""}`,
      );
      setResult(json);
      track("generate_lead", {
        kind,
        delivery: json.delivered ? "webhook" : "whatsapp_pending",
      });
    } catch (e) {
      setFailure(
        e instanceof Error ? e.message : "Falha de conexão. Tente novamente.",
      );
    }
  }
  function next() {
    if (step === 1 && detailsRef.current) {
      const inputs =
        detailsRef.current.querySelectorAll<HTMLInputElement>("input");
      for (const input of inputs) {
        if (!input.reportValidity()) return;
      }
    }
    setStep(step + 1);
  }
  if (result)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={45} />
        <h2>
          {result.delivered
            ? "Recebemos seu contato."
            : "Sua mensagem está pronta."}
        </h2>
        <p>{result.message}</p>
        {!result.delivered && (
          <a
            className="button"
            href={whatsapp(prepared)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enviar pelo WhatsApp
            <ArrowUpRight size={18} />
          </a>
        )}
        {files.length > 0 && (
          <p className="small">
            {result.delivered
              ? "As fotos foram encaminhadas ao canal configurado."
              : "Anexe as fotos diretamente na conversa do WhatsApp; elas não foram armazenadas nesta demonstração."}
          </p>
        )}
        {kind === "test-drive" && (
          <p className="small">
            A data e o horário são uma solicitação. Aguarde a confirmação da
            equipe.
          </p>
        )}
        <button
          className="text-button"
          onClick={() => {
            setResult(null);
            setStep(1);
          }}
        >
          Voltar ao formulário
        </button>
      </div>
    );
  return (
    <form
      className="lead-form"
      onSubmit={handleSubmit(submit)}
      noValidate={sell && step < 3}
    >
      {sell && (
        <>
          <ol className="stepper" aria-label="Etapas da avaliação">
            {["Seu carro", "Fotografias", "Seu contato"].map((s, i) => (
              <li
                key={s}
                className={step >= i + 1 ? "active" : ""}
                aria-current={step === i + 1 ? "step" : undefined}
              >
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="progress-track">
            <span style={{ transform: `scaleX(${step / 3})` }} />
          </div>
        </>
      )}
      {sell && step === 1 && (
        <div ref={detailsRef}>
          <h2>Conte um pouco sobre ele.</h2>
          <p>Os detalhes ajudam a começar uma avaliação justa.</p>
          <div className="form-grid">
            <label>
              Marca
              <input
                value={car.brand}
                required
                minLength={2}
                maxLength={50}
                onChange={(e) => setCar({ ...car, brand: e.target.value })}
                placeholder="Ex.: Hyundai"
              />
            </label>
            <label>
              Modelo e versão
              <input
                value={car.model}
                required
                minLength={2}
                maxLength={100}
                onChange={(e) => setCar({ ...car, model: e.target.value })}
                placeholder="Ex.: Creta Platinum"
              />
            </label>
            <label>
              Ano do modelo
              <input
                type="number"
                required
                min="1980"
                max="2027"
                value={car.year}
                onChange={(e) => setCar({ ...car, year: e.target.value })}
                placeholder="Ex.: 2022"
              />
            </label>
            <label>
              Quilometragem
              <input
                type="number"
                required
                min="0"
                max="2000000"
                value={car.km}
                onChange={(e) => setCar({ ...car, km: e.target.value })}
                placeholder="Ex.: 45000"
              />
            </label>
          </div>
        </div>
      )}
      {sell && step === 2 && (
        <div>
          <h2>Uma boa primeira impressão.</h2>
          <p>
            Selecione até 3 fotos: frente, lateral e interior. JPG, PNG ou WebP,
            até 2 MB por foto.
          </p>
          <div className="upload">
            <UploadCloud size={32} />
            <label>
              Escolher fotografias
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  if (
                    selected.length > 3 ||
                    selected.some(
                      (f) =>
                        f.size > 2 * 1024 * 1024 ||
                        !["image/jpeg", "image/png", "image/webp"].includes(
                          f.type,
                        ),
                    )
                  ) {
                    setPhotoError(
                      "Escolha até 3 fotos JPG, PNG ou WebP de no máximo 2 MB cada.",
                    );
                    if (fileRef.current) fileRef.current.value = "";
                    return;
                  }
                  setFiles(selected);
                  setPhotoError("");
                }}
              />
            </label>
            <span>
              Fotos opcionais. Você também pode enviá-las na conversa.
            </span>
          </div>
          {photoError && (
            <p className="error" role="alert">
              {photoError}
            </p>
          )}
          <ul className="file-list">
            {files.map((f, i) => (
              <li key={`${f.name}${i}`}>
                {f.name}
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Remover ${f.name}`}
                  onClick={() => setFiles(files.filter((_, n) => n !== i))}
                >
                  <X size={17} />
                </button>
              </li>
            ))}
          </ul>
          <p className="fine-print">
            Evite fotos de documentos, placas ou pessoas. As fotos só serão
            enviadas se houver integração de atendimento configurada.
          </p>
        </div>
      )}
      {(!sell || step === 3) && (
        <>
          <h2>
            {kind === "test-drive"
              ? "Vamos marcar um encontro?"
              : kind === "financiamento"
                ? "Converse sobre suas possibilidades."
                : sell
                  ? "Como podemos falar com você?"
                  : "A conversa começa aqui."}
          </h2>
          <p>
            {kind === "financiamento"
              ? "Neste primeiro contato, não pedimos CPF nem documentos."
              : "Deixe seus dados e conte como podemos ajudar."}
          </p>
          <div className="form-grid">
            <label>
              Seu nome
              <input
                {...register("name")}
                autoComplete="name"
                placeholder="Nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="error" role="alert">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label>
              Telefone com DDD
              <input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="(62) 99999-9999"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="error" role="alert">
                  {errors.phone.message}
                </span>
              )}
            </label>
            <label className="span-2">
              E-mail (opcional)
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="error" role="alert">
                  {errors.email.message}
                </span>
              )}
            </label>
            {kind === "test-drive" && (
              <>
                <label>
                  Data de preferência
                  <input
                    type="date"
                    required
                    min={today}
                    value={schedule.date}
                    onChange={(e) =>
                      setSchedule({ ...schedule, date: e.target.value })
                    }
                  />
                </label>
                <label>
                  Horário de preferência
                  <select
                    value={schedule.time}
                    onChange={(e) =>
                      setSchedule({ ...schedule, time: e.target.value })
                    }
                  >
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <label className="span-2">
              Sua mensagem (opcional)
              <textarea
                {...register("message")}
                rows={3}
                maxLength={1500}
                placeholder="Conte o que você está procurando…"
              />
            </label>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Não preencha este campo
              <input
                {...register("website")}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" {...register("consent")} />{" "}
            <span>
              Autorizo o uso dos meus dados para este atendimento, conforme a{" "}
              <Link href="/politica-de-privacidade">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <p className="error" role="alert">
              {errors.consent.message}
            </p>
          )}
          <p className="fine-print">
            Demonstração: sem CRM configurado, você concluirá o contato pelo
            WhatsApp. Nenhuma aprovação ou reserva é automática.
          </p>
        </>
      )}
      {failure && (
        <p className="error" role="alert">
          {failure}
        </p>
      )}
      <div className="form-actions">
        {sell && step > 1 && (
          <button
            type="button"
            className="button button-outline"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={17} />
            Voltar
          </button>
        )}
        {sell && step < 3 ? (
          <button type="button" className="button" onClick={next}>
            Continuar
            <ArrowRight size={18} />
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting
              ? "Preparando…"
              : kind === "test-drive"
                ? "Solicitar test-drive"
                : sell
                  ? "Solicitar avaliação"
                  : "Iniciar atendimento"}
            <ArrowUpRight size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
