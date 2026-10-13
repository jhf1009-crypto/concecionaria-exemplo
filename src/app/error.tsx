"use client";
import Link from "@/components/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container error-page">
      <span className="eyebrow">Uma pausa no caminho</span>
      <h1>
        Vamos tentar
        <br />
        dar a partida de novo?
      </h1>
      <p>Não foi possível carregar esta página agora.</p>
      <button className="button" onClick={reset}>
        Tentar novamente
      </button>
      <Link className="text-link" href="/contato">
        Falar com a Ninho
      </Link>
    </section>
  );
}
