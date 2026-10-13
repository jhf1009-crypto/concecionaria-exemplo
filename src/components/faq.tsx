import { Plus } from "lucide-react";
import { faqs } from "@/data/faq";
import { Eyebrow, JsonLd } from "./ui";
export function FAQ({ short = false }: { short?: boolean }) {
  const items = short ? faqs.slice(0, 5) : faqs;
  return (
    <section className="section container faq-section">
      <div>
        <Eyebrow>Sem dúvidas pelo caminho</Eyebrow>
        <h2>
          Uma boa escolha
          <br />
          começa com clareza.
        </h2>
        <p>O que você precisa saber antes de dar o próximo passo.</p>
      </div>
      <div className="faq-list">
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={19} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text },
          })),
        }}
      />
    </section>
  );
}
