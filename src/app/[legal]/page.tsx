import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { site, whatsapp } from "@/config/site";
const pages = {
  "politica-de-privacidade": {
    title: "Política de Privacidade",
    intro: "Transparência também faz parte do caminho.",
    sections: [
      [
        "Esta é uma demonstração",
        "Este texto é um ponto de partida e precisa de revisão jurídica e identificação do responsável pelo tratamento antes do uso comercial. O canal de atendimento disponível é o WhatsApp indicado no site.",
      ],
      [
        "Dados do atendimento",
        "Os formulários solicitam nome, telefone, e-mail opcional, mensagem e, na avaliação, dados e fotos opcionais do veículo. Não pedimos CPF, documentos bancários ou comprovantes financeiros. O formulário exige autorização para o atendimento solicitado.",
      ],
      [
        "Para onde os dados vão",
        "Sem webhook configurado, o site valida a solicitação e prepara uma mensagem que você escolhe enviar pelo WhatsApp; os dados não são salvos em banco. Havendo integração, os dados e fotos são encaminhados ao CRM configurado por conexão HTTPS. A empresa deverá informar o operador, prazo de retenção e regras de acesso antes de ativar esse canal.",
      ],
      [
        "Favoritos e cookies",
        "Favoritos, comparação e sua escolha de privacidade ficam no armazenamento do seu navegador. Esses recursos são essenciais às funções que você solicita. Análise de navegação com Google Analytics somente é carregada após consentimento opcional, quando uma chave estiver configurada. Você pode mudar suas escolhas no rodapé. A revogação interrompe futuras coletas; não remove dados já recebidos por operadores.",
      ],
      [
        "Serviços externos",
        "O mapa do Google só carrega depois de interação e mostra uma região ilustrativa. Ao abrir o WhatsApp, você passa a usar um serviço externo sujeito às suas próprias condições. Esses serviços podem tratar dados de navegação, conexão e mensagens.",
      ],
      [
        "Segurança e registros",
        "O servidor valida campos e arquivos e usa um limite temporário de tentativas, baseado no hash do endereço de conexão. O limite é mantido em memória por dez minutos e não substitui uma solução distribuída para produção. A hospedagem pode registrar metadados técnicos conforme sua própria política.",
      ],
      [
        "Suas escolhas",
        "Você pode solicitar informações sobre o tratamento, acesso, correção ou exclusão de dados pelo WhatsApp. O responsável deverá validar a solicitação e informar o procedimento aplicável, observadas as obrigações de conservação pertinentes.",
      ],
    ],
  },
  termos: {
    title: "Termos de uso",
    intro: "Informações claras para uma navegação tranquila.",
    sections: [
      [
        "Finalidade demonstrativa",
        "Este site apresenta um conceito de experiência digital para a Ninho Veículos. Veículos, preços, quilometragem, depoimentos, endereço, equipe, horários e demais informações institucionais são fictícios. Fotografias reais são usadas como ilustração e não documentam unidades disponíveis.",
      ],
      [
        "Estoque e valores",
        "Os itens do estoque não constituem uma oferta comercial. Não é possível reservar, comprar ou efetuar pagamento por esta demonstração. Qualquer negociação depende de confirmação independente da disponibilidade e das condições do veículo real.",
      ],
      [
        "Simulação de financiamento",
        "O simulador calcula parcelas fixas com a taxa escolhida. Não inclui IOF, seguros, tarifas e outros componentes do Custo Efetivo Total. O resultado é uma estimativa sem valor contratual e não representa aprovação de crédito.",
      ],
      [
        "Solicitações e visitas",
        "Formulários e mensagens iniciam uma conversa. Solicitações de avaliação ou test-drive dependem de confirmação da equipe; não geram reserva, compromisso de compra ou garantia de preço.",
      ],
      [
        "Fotografias e marcas",
        "As imagens são fotografias de bancos livres, com fontes registradas no projeto. Marcas e modelos são usados para identificar exemplos; não indicam representação, afiliação ou endosso de fabricantes. Fotos genéricas de interior e mecânica estão identificadas na galeria.",
      ],
      [
        "Uso responsável",
        "Não envie documentos pessoais, informações financeiras, conteúdo ilícito ou fotos de terceiros sem autorização. A disponibilidade de serviços externos depende de seus respectivos operadores.",
      ],
      [
        "Publicação comercial",
        "A empresa deve substituir dados fictícios, verificar direitos aplicáveis, revisar textos e definir responsáveis e integrações antes de transformar esta demonstração em um site comercial.",
      ],
    ],
  },
};
export async function generateStaticParams() {
  return Object.keys(pages).map((legal) => ({ legal }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>;
}): Promise<Metadata> {
  const { legal } = await params;
  const p = pages[legal as keyof typeof pages];
  return p
    ? {
        title: p.title,
        description: p.intro,
        alternates: { canonical: `/${legal}` },
      }
    : {};
}
export default async function Legal({
  params,
}: {
  params: Promise<{ legal: string }>;
}) {
  const { legal } = await params;
  const page = pages[legal as keyof typeof pages];
  if (!page) notFound();
  return (
    <>
      <PageIntro
        label={page.title}
        title={page.title}
        description={page.intro}
      />
      <article className="container legal-copy">
        <p className="legal-alert">
          Texto de demonstração. Revisão jurídica e dados do responsável
          pendentes.
        </p>
        {page.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <h2>Fale com a gente</h2>
        <p>
          Canal de atendimento:{" "}
          <a
            href={whatsapp(
              `Olá! Gostaria de falar sobre ${page.title.toLowerCase()} e meus dados no site da Ninho Veículos.`,
            )}
          >
            {site.phone}
          </a>
          .
        </p>
        <Link className="text-link" href="/">
          Voltar ao início
        </Link>
      </article>
    </>
  );
}
