import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import {
  Check,
  ShieldCheck,
  CalendarDays,
  Gauge,
  Settings2,
  Fuel,
  ArrowUpRight,
} from "lucide-react";
import { getVehicles, getVehicle, money, number } from "@/lib/vehicles";
import { Gallery } from "@/components/gallery";
import { VehicleCard } from "@/components/vehicle-card";
import { WhatsApp, JsonLd } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { FinanceSimulator } from "@/components/finance";
import { site } from "@/config/site";
export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ slug: v.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicle(slug);
  return v
    ? {
        title: `${v.brand} ${v.model} ${v.year}`,
        description: `${v.brand} ${v.model} ${v.version}, ${number(v.km)} km, ${money(v.price)}. Veículo fictício de demonstração. Converse com a Ninho Veículos.`,
        alternates: { canonical: `/estoque/${slug}` },
        openGraph: {
          title: `${v.brand} ${v.model} ${v.year} | Ninho`,
          images: [v.image],
        },
      }
    : {};
}
export default async function Vehicle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) notFound();
  const related = (await getVehicles())
    .filter((x) => x.id !== v.id && x.brand !== v.brand)
    .slice(0, 3);
  return (
    <>
      <section className="container vehicle-page">
        <nav className="breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/estoque">Estoque</Link>
          <span>/</span>
          <span>{v.model}</span>
        </nav>
        <div className="vehicle-detail-layout">
          <Gallery vehicle={v} />
          <div className="vehicle-summary">
            <span className="eyebrow">
              {v.tag} · {v.id}
            </span>
            <p className="card-brand">{v.brand}</p>
            <h1>{v.model}</h1>
            <p className="vehicle-version">{v.version}</p>
            <div className="detail-specs">
              {[
                [CalendarDays, String(v.year)],
                [Gauge, `${number(v.km)} km`],
                [Settings2, v.transmission],
                [Fuel, v.fuel],
              ].map(([Icon, text]) => {
                const I = Icon as typeof Gauge;
                return (
                  <span key={text as string}>
                    <I size={20} />
                    {text as string}
                  </span>
                );
              })}
            </div>
            <span className="small">Valor demonstrativo à vista</span>
            <strong className="detail-price">{money(v.price)}</strong>
            <p className="small">
              Consulte condições. Não constitui oferta comercial.
            </p>
            <WhatsApp
              message={`Olá! Tenho interesse no ${v.brand} ${v.model} ${v.year} (código ${v.id}) que vi no site da Ninho Veículos.`}
            >
              Quero conhecer este carro
            </WhatsApp>
            <Link href="#test-drive" className="button button-outline">
              <CalendarDays size={18} />
              Agendar um test-drive
              <ArrowUpRight size={17} />
            </Link>
            <Link href="#simulacao" className="text-link">
              Simular financiamento
              <ArrowUpRight size={17} />
            </Link>
            <div className="summary-trust">
              <ShieldCheck size={22} />
              <p>
                Uma escolha merece clareza.
                <br />
                <small>
                  Converse sobre histórico, vistoria e documentação.
                </small>
              </p>
            </div>
          </div>
        </div>
        <div className="vehicle-info">
          <div>
            <span className="eyebrow">Conheça os detalhes</span>
            <h2>Mais do que uma boa primeira impressão.</h2>
            <p>
              O {v.brand} {v.model} combina presença, conforto e uma proposta
              que faz sentido para quem procura{" "}
              {v.body === "SUV"
                ? "espaço e versatilidade"
                : v.body === "Hatch"
                  ? "praticidade na cidade"
                  : "uma experiência especial ao volante"}
              . Venha conhecer o modelo, sentir a posição de dirigir e conferir
              cada detalhe com calma.
            </p>
            <p className="fine-print">
              Descrição, quilometragem, opcionais e histórico são fictícios. As
              fotos de interior e mecânica são referências genéricas. Solicite
              imagens e laudo da unidade real antes de qualquer negociação.
            </p>
            <h3>Equipamentos de exemplo</h3>
            <ul className="features-list">
              {v.features.map((f) => (
                <li key={f}>
                  <Check size={17} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <aside className="technical">
            <h2>Ficha técnica</h2>
            <dl>
              {[
                ["Marca", v.brand],
                ["Modelo", v.model],
                ["Ano do modelo", v.year],
                ["Cor", v.color],
                ["Carroceria", v.body],
                ["Combustível", v.fuel],
                ["Transmissão", v.transmission],
                ["Quilometragem", `${number(v.km)} km`],
                ["Código", v.id],
              ].map(([key, val]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
      <section className="section container" id="simulacao">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Dentro dos seus planos</span>
            <h2>Experimente as possibilidades.</h2>
          </div>
        </div>
        <FinanceSimulator initialPrice={v.price} />
      </section>
      <section className="section container test-drive" id="test-drive">
        <div>
          <span className="eyebrow">O próximo passo é sentir</span>
          <h2>
            Algumas escolhas
            <br />
            pedem um test-drive.
          </h2>
          <p>
            Solicite um horário para conhecer o {v.brand} {v.model}. A equipe
            confirmará a disponibilidade antes da visita.
          </p>
        </div>
        <LeadForm
          kind="test-drive"
          vehicle={`${v.brand} ${v.model} ${v.year} (${v.id})`}
        />
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Outros caminhos</span>
            <h2>Vale conhecer também.</h2>
          </div>
          <Link href="/estoque" className="text-link">
            Voltar ao estoque
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="vehicle-grid">
          {related.map((x) => (
            <VehicleCard key={x.id} vehicle={x} />
          ))}
        </div>
      </section>
      <div className="mobile-vehicle-cta">
        <strong>{money(v.price)}</strong>
        <WhatsApp
          message={`Olá! Quero conhecer o ${v.brand} ${v.model} (${v.id}).`}
        >
          Tenho interesse
        </WhatsApp>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Car",
          name: `${v.brand} ${v.model}`,
          brand: { "@type": "Brand", name: v.brand },
          model: v.model,
          vehicleModelDate: String(v.year),
          vehicleTransmission: v.transmission,
          fuelType: v.fuel,
          color: v.color,
          mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: v.km,
            unitCode: "KMT",
          },
          image: `${site.url}${v.image}`,
          description: `Veículo fictício de demonstração. ${v.version}.`,
          sku: v.id,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { name: "Início", item: site.url },
            { name: "Estoque", item: `${site.url}/estoque` },
            {
              name: `${v.brand} ${v.model}`,
              item: `${site.url}/estoque/${v.slug}`,
            },
          ].map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            ...item,
          })),
        }}
      />
    </>
  );
}
