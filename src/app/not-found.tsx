import Link from "@/components/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <section className="container error-page">
      <span className="eyebrow">404 · Um pequeno desvio</span>
      <h1>
        Este caminho
        <br />
        ainda não existe.
      </h1>
      <p>Mas o seu próximo carro pode estar logo ali.</p>
      <Link href="/estoque" className="button">
        Encontrar meu próximo carro
        <ArrowRight size={18} />
      </Link>
      <Link href="/" className="text-link">
        Voltar ao início
      </Link>
    </section>
  );
}
