import { Hero } from "@/components/hero";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  ClipboardCheck,
  Handshake,
  CarFront,
  Check,
  Quote,
  Clock,
  MapPin,
} from "lucide-react";
import { Eyebrow, WhatsApp, JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { QuickSearch } from "@/components/search";
import { HomeSelection } from "@/components/home-selection";
import { Journey } from "@/components/journey";
import { FinanceSimulator } from "@/components/finance";
import { FAQ } from "@/components/faq";
import { MapCard } from "@/components/map";
import { getVehicles } from "@/lib/vehicles";
import { site } from "@/config/site";
export default async function Home() {
  const vehicles = await getVehicles();
  return (
    <>
      <Hero />
      <div className="container search-container">
        <QuickSearch />
      </div>
      <div className="container trust-strip">
        {[
          [
            ShieldCheck,
            "Procedência em primeiro lugar",
            "Histórico e documentação em pauta",
          ],
          [
            ClipboardCheck,
            "Olhar atento aos detalhes",
            "Conheça o carro antes de decidir",
          ],
          [
            Handshake,
            "Uma conversa transparente",
            "Condições claras, sem pressão",
          ],
          [
            CarFront,
            "Seu carro na negociação",
            "Vamos conversar sobre a troca",
          ],
        ].map(([Icon, title, desc]) => {
          const I = Icon as typeof ShieldCheck;
          return (
            <div key={title as string}>
              <I size={25} strokeWidth={1.5} />
              <div>
                <strong>{title as string}</strong>
                <span>{desc as string}</span>
              </div>
            </div>
          );
        })}
      </div>
      <section className="section container stock-section">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>Escolhidos com cuidado</Eyebrow>
              <h2>
                Um novo carro.
                <br />
                Muitas possibilidades.
              </h2>
            </div>
            <p>
              Para a rotina, para a família, para ir além.
              <br />
              Descubra o que espera por você na Ninho.
            </p>
          </div>
          <HomeSelection vehicles={vehicles} />
          <p className="fine-print">
            Uma seleção demonstrativa. Fotografias reais e ilustrativas;
            veículos e preços fictícios.
          </p>
        </Reveal>
      </section>
      <section className="categories-section section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>Seu estilo. Seu caminho.</Eyebrow>
              <h2>
                O carro certo para
                <br />o seu momento.
              </h2>
            </div>
            <p>
              Cada fase pede um jeito de ir.
              <br />
              Qual é o seu?
            </p>
          </div>
          <div className="category-grid">
            {[
              ["SUV", "Espaço para a vida acontecer.", "SUV", "creta"],
              ["Hatch", "Leveza para o dia a dia.", "Hatch", "hatch"],
              ["Sedã", "Conforto que vai mais longe.", "Sedã", "porsche"],
              ["Picape", "Pronta para ir além.", "Picape", "ford"],
            ].map(([label, desc, query, img]) => (
              <Link
                href={`/estoque?categoria=${encodeURIComponent(query)}`}
                className="category-card"
                key={label}
              >
                <Image
                  src={`/images/${img}.webp`}
                  alt={`${label}, fotografia ilustrativa`}
                  fill
                  sizes="(max-width: 600px) 85vw, (max-width: 1000px) 45vw, 25vw"
                />
                <div>
                  <span>{desc}</span>
                  <h3>
                    {label}
                    <ArrowUpRight size={25} />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="budget-links">
            <span>Ou encontre pela sua faixa de preço</span>
            <Link href="/estoque?preco=100000">
              Até R$ 100 mil
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/estoque?preco=150000">
              Até R$ 150 mil
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/estoque?combustivel=H%C3%ADbrido">
              Híbridos
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <Journey />
      <section className="section container home-finance">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>Planeje o próximo passo</Eyebrow>
              <h2>
                Seu novo carro.
                <br />
                Dentro dos seus planos.
              </h2>
            </div>
            <div>
              <p>
                Experimente valores, entradas e prazos.
                <br />
                Depois, a gente conversa sobre as possibilidades.
              </p>
              <Link className="text-link" href="/financiamento">
                Tudo sobre financiamento
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <FinanceSimulator compact />
        </Reveal>
      </section>
      <section className="sell-banner container">
        <div className="sell-copy">
          <Eyebrow>Uma nova história para o seu carro</Eyebrow>
          <h2>
            A próxima mudança
            <br />
            pode começar
            <br />
            na sua garagem.
          </h2>
          <p>
            Quer vender ou trocar? Conte um pouco sobre seu carro. Vamos olhar
            para ele com o cuidado que você espera.
          </p>
          <ul>
            {[
              "Avaliação sem compromisso",
              "Conversa direta, do início ao fim",
              "Seu usado como parte da negociação",
            ].map((t) => (
              <li key={t}>
                <Check size={17} />
                {t}
              </li>
            ))}
          </ul>
          <Link href="/venda-seu-carro" className="button">
            Quero avaliar meu carro
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="sell-photo">
          <Image
            src="/images/bmw.webp"
            alt="BMW branco em uma avenida, imagem ilustrativa de um novo caminho"
            fill
            sizes="(max-width: 750px) 100vw, 50vw"
          />
          <span>CADA CARRO CARREGA UMA HISTÓRIA.</span>
        </div>
      </section>
      <section className="section container testimonials">
        <div className="section-heading">
          <div>
            <Eyebrow>O cuidado faz a diferença</Eyebrow>
            <h2>
              Gente. Histórias.
              <br />
              Novos caminhos.
            </h2>
          </div>
          <p>
            Relatos ilustrativos para você conhecer
            <br />a experiência que queremos construir.
            <br />
            <small>Depoimentos fictícios, apresentados como exemplo.</small>
          </p>
        </div>
        <div className="testimonial-grid">
          {site.testimonials.map((t) => (
            <Reveal className="testimonial" key={t.name}>
              <Quote size={28} />
              <blockquote>{t.text}</blockquote>
              <div className="testimonial-person">
                <span>{t.initials}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.car} · Exemplo fictício</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="about-home">
        <div className="about-home-photo">
          <Image
            src={site.images.road}
            alt="Estrada e paisagem montanhosa, inspiração para novas viagens"
            fill
            sizes="(max-width: 750px) 100vw, 50vw"
          />
        </div>
        <div className="about-home-copy">
          <Eyebrow>É bom se sentir em casa</Eyebrow>
          <h2>
            Antes de vender carros,
            <br />a gente quer
            <br />
            construir confiança.
          </h2>
          <p>
            A Ninho nasce de uma ideia simples: cuidar da sua escolha como
            cuidaríamos da nossa. Ouvir primeiro. Explicar cada detalhe.
            Respeitar o seu tempo.
          </p>
          <Link href="/sobre" className="text-link">
            Conheça a Ninho
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <FAQ short />
      <section className="section container location-section">
        <div>
          <Eyebrow>Vamos nos conhecer de perto?</Eyebrow>
          <h2>
            Tem sempre uma
            <br />
            boa conversa
            <br />
            esperando por você.
          </h2>
          <p>
            <MapPin size={19} />
            {site.address}
            <br />
            {site.city} · {site.state}
          </p>
          <p className="small">{site.addressNote}</p>
          <p>
            <Clock size={19} />
            {site.hours[0]}
            <br />
            {site.hours[1]} · horários ilustrativos
          </p>
          <WhatsApp message="Olá! Quero conhecer a Ninho Veículos. Podemos combinar uma visita?">
            Combinar uma visita
          </WhatsApp>
        </div>
        <MapCard />
      </section>
      <section className="final-cta">
        <div className="container">
          <span className="eyebrow">O PRÓXIMO CAMINHO É SEU</span>
          <h2>
            A gente ajuda
            <br />a dar a partida.
          </h2>
          <WhatsApp className="button-cream">
            Vamos encontrar seu próximo carro
          </WhatsApp>
        </div>
        <span className="cta-wordmark" aria-hidden="true">
          ninho
        </span>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          telephone: site.tel,
          description: site.disclaimer,
          logo: `${site.url}/logo-dark.svg`,
        }}
      />
    </>
  );
}
