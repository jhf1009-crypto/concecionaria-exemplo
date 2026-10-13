import type { Metadata } from "next";
import Image from "next/image";
import {
  ShieldCheck,
  Heart,
  MessagesSquare,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react";
import Link from "@/components/link";
import { PageIntro, WhatsApp } from "@/components/ui";
import { Journey } from "@/components/journey";
export const metadata: Metadata = {
  title: "Conheça o jeito Ninho",
  description:
    "Na Ninho Veículos, a ideia é simples: ouvir primeiro, explicar os detalhes e respeitar o seu tempo. Conheça a proposta desta demonstração.",
  alternates: { canonical: "/sobre" },
};
export default function About() {
  return (
    <>
      <PageIntro
        label="A Ninho"
        title="Um lugar seguro para começar novos caminhos."
        description="Um ninho é abrigo. É onde a gente se sente à vontade para decidir o próximo voo. É esse cuidado que inspira o nosso jeito de pensar a compra de um carro."
      />
      <section className="container about-editorial">
        <div className="about-wide-photo">
          <Image
            src="/images/road.webp"
            fill
            priority
            sizes="100vw"
            alt="Paisagem real de montanhas e floresta, inspiração para novas histórias"
          />
          <span>O CAMINHO IMPORTA TANTO QUANTO A CHEGADA.</span>
        </div>
        <div className="about-story">
          <span className="eyebrow">De pessoas para pessoas</span>
          <div>
            <h2>
              Seu carro muda.
              <br />O cuidado continua.
            </h2>
            <p>
              Às vezes, a família cresce. A rotina muda. Uma viagem vira plano.
              Ou chega a hora de realizar uma vontade antiga. Por trás de cada
              busca por um carro, existe uma história.
            </p>
            <p>
              A proposta da Ninho é abrir espaço para essa história. Com uma
              conversa próxima, informações claras e tempo para olhar cada
              detalhe. Sem atalhos na confiança e sem pressa na sua decisão.
            </p>
            <p className="fine-print">
              Narrativa institucional criada para esta demonstração. História,
              equipe, endereço e processos devem ser confirmados pela empresa
              antes da publicação comercial.
            </p>
            <Link href="/estoque" className="text-link">
              Encontre seu próximo caminho
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="values-grid">
          {[
            [
              Heart,
              "Ouvir antes de oferecer",
              "Entender a sua rotina é o começo de uma recomendação que faz sentido.",
            ],
            [
              MessagesSquare,
              "Explicar, sem complicar",
              "Preço, documentação e condições merecem uma conversa clara.",
            ],
            [
              ShieldCheck,
              "Cuidar da sua escolha",
              "Tempo para conferir, perguntar e decidir com tranquilidade.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Heart;
            return (
              <article key={title as string}>
                <I size={30} />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </article>
            );
          })}
        </div>
      </section>
      <Journey />
      <section className="section container two-column">
        <div>
          <span className="eyebrow">O cuidado está nos detalhes</span>
          <h2>
            Boas perguntas.
            <br />
            Escolhas mais seguras.
          </h2>
          <p>
            Uma avaliação responsável olha além da pintura. Conheça os pontos
            que devem entrar na conversa antes de comprar um seminovo.
          </p>
          <WhatsApp message="Olá! Quero saber mais sobre a Ninho e sobre o processo de avaliação dos veículos.">
            Conhecer melhor a Ninho
          </WhatsApp>
        </div>
        <div className="inspection-list">
          {[
            [
              "Documentação",
              "Situação cadastral, restrições e informações de propriedade.",
            ],
            [
              "Histórico",
              "Manutenções, uso e registros disponíveis sobre o veículo.",
            ],
            [
              "Inspeção",
              "Itens mecânicos, estrutura, carroceria e sistemas de segurança.",
            ],
            [
              "Transparência",
              "O que foi verificado, o que precisa de cuidado e o que consta na proposta.",
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <ClipboardCheck size={24} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <p className="fine-print">
            Etapas ilustrativas. Solicite o laudo e as condições da unidade
            real.
          </p>
        </div>
      </section>
    </>
  );
}
