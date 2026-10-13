import type { Metadata } from "next";
import { FileText, Handshake, CheckCircle2, ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { FinanceSimulator } from "@/components/finance";
import { LeadForm } from "@/components/lead-form";
import { FAQ } from "@/components/faq";
export const metadata: Metadata = {
  title: "Simule seu financiamento",
  description:
    "Planeje a compra do seu próximo carro. Simule entrada, prazo e taxa e converse sobre financiamento de veículos com a Ninho.",
  alternates: { canonical: "/financiamento" },
};
export default function Financing() {
  return (
    <>
      <PageIntro
        label="Financiamento"
        title="Um novo carro. Um plano que faz sentido."
        description="Antes de decidir, entenda as possibilidades. Experimente a simulação e converse com a gente, sem compromisso."
      />
      <section className="container finance-page">
        <FinanceSimulator />
        <div className="process-grid">
          {[
            [
              FileText,
              "01",
              "Comece pelos seus planos",
              "Defina uma entrada confortável e um prazo que faça sentido para o seu orçamento.",
            ],
            [
              Handshake,
              "02",
              "Converse sobre as condições",
              "Confira taxas, custos, seguros e o CET na proposta da instituição financeira.",
            ],
            [
              CheckCircle2,
              "03",
              "Decida com tudo às claras",
              "A contratação só acontece depois da análise de crédito e da sua concordância.",
            ],
          ].map(([Icon, n, title, text]) => {
            const I = Icon as typeof FileText;
            return (
              <article key={n as string}>
                <I size={28} />
                <span>{n as string}</span>
                <h2>{title as string}</h2>
                <p>{text as string}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section container two-column">
        <div>
          <span className="eyebrow">Vamos planejar juntos</span>
          <h2>
            Uma boa conversa
            <br />
            antes de qualquer
            <br />
            compromisso.
          </h2>
          <p>
            Conte como podemos ajudar. Para começar, precisamos apenas do seu
            contato. Documentos pessoais e comprovantes devem ser enviados
            somente por um canal confirmado pela equipe.
          </p>
          <div className="info-box">
            <FileText size={25} />
            <h3>O que pode ser necessário depois?</h3>
            <p>
              Documento de identificação, comprovantes de renda e endereço. A
              instituição financeira informa a lista aplicável ao seu perfil.
            </p>
            <p className="fine-print">
              Não envie CPF, documentos ou informações bancárias pelo formulário
              desta demonstração.
            </p>
          </div>
          <p className="text-link">
            Condições transparentes em cada etapa
            <ArrowRight size={18} />
          </p>
        </div>
        <LeadForm kind="financiamento" />
      </section>
      <FAQ />
    </>
  );
}
