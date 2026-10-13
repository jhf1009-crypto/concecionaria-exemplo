import type { Metadata } from "next";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { PageIntro, WhatsApp } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { MapCard } from "@/components/map";
import { site } from "@/config/site";
export const metadata: Metadata = {
  title: "Contato e visita",
  description:
    "Converse com a Ninho Veículos pelo WhatsApp (62) 99985-8449. Tire dúvidas sobre seminovos, financiamento, troca ou agende uma visita.",
  alternates: { canonical: "/contato" },
};
export default function Contact() {
  return (
    <>
      <PageIntro
        label="Contato"
        title="Uma boa conversa já é um começo."
        description="Uma dúvida, um carro em mente ou vontade de conhecer a Ninho? A gente está por aqui para ouvir você."
      />
      <section className="container contact-page two-column">
        <div>
          <WhatsApp message="Olá! Gostaria de falar com a equipe da Ninho Veículos.">
            Conversar pelo WhatsApp
          </WhatsApp>
          <div className="contact-details">
            <div>
              <Phone />
              <div>
                <h2>Prefere ligar?</h2>
                <a href={`tel:${site.tel}`}>{site.phone}</a>
              </div>
            </div>
            <div>
              <MapPin />
              <div>
                <h2>Venha nos conhecer</h2>
                <p>
                  {site.address}
                  <br />
                  {site.city} · {site.state}
                </p>
                <small>{site.addressNote}</small>
              </div>
            </div>
            <div>
              <Clock />
              <div>
                <h2>Horários de exemplo</h2>
                <p>
                  {site.hours.map((t) => (
                    <span className="block" key={t}>
                      {t}
                    </span>
                  ))}
                </p>
                <small>Confirme antes da visita.</small>
              </div>
            </div>
            <div>
              <Mail />
              <div>
                <h2>Canal digital</h2>
                <p>{site.email}</p>
                <small>
                  E-mail ilustrativo. Use o WhatsApp para atendimento.
                </small>
              </div>
            </div>
          </div>
          <MapCard />
        </div>
        <LeadForm />
      </section>
    </>
  );
}
