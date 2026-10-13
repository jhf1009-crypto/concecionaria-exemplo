import type { Metadata } from "next";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { whatsapp } from "@/config/site";
export const metadata: Metadata = {
  title: "Venda ou troque seu carro",
  description:
    "Solicite uma avaliação do seu carro na Ninho Veículos. Informe os detalhes, selecione fotos e comece uma conversa sem compromisso.",
  alternates: { canonical: "/venda-seu-carro" },
};
export default function Sell() {
  return (
    <>
      <PageIntro
        label="Venda seu carro"
        title="Toda história merece um bom próximo capítulo."
        description="Seu carro fez parte de muitos caminhos. Vamos ajudar você a encontrar o próximo, com uma avaliação atenta e uma conversa transparente."
      />
      <section className="container sell-page two-column">
        <div>
          <div className="sell-page-photo">
            <Image
              src="/images/bmw.webp"
              fill
              sizes="(max-width: 800px) 100vw, 45vw"
              alt="BMW branco em uma avenida, fotografia ilustrativa"
            />
          </div>
          <h2>Vender. Trocar. Seguir em frente.</h2>
          <p>
            Você escolhe o caminho. A gente começa ouvindo o que você precisa e
            conhecendo melhor o seu carro.
          </p>
          <ul className="check-list">
            {[
              "Avaliação inicial sem compromisso",
              "Possibilidade de usar seu carro na troca",
              "Valores e condições apresentados antes da decisão",
            ].map((t) => (
              <li key={t}>
                <Check size={18} />
                {t}
              </li>
            ))}
          </ul>
          <a
            href={whatsapp(
              "Olá! Quero vender ou trocar meu carro e gostaria de conversar sobre uma avaliação.",
            )}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Prefiro conversar pelo WhatsApp
            <ArrowUpRight size={18} />
          </a>
        </div>
        <LeadForm kind="avaliacao" />
      </section>
    </>
  );
}
