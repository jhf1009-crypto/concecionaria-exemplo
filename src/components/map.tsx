"use client";
import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { site, whatsapp } from "@/config/site";
export function MapCard() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map-card">
      {loaded ? (
        <iframe
          title={`Mapa ilustrativo de ${site.city}; endereço da loja ainda não confirmado`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(`${site.city} ${site.state}`)}&z=12&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <button className="map-preview" onClick={() => setLoaded(true)}>
          <MapPin size={35} />
          <strong>Estamos em {site.city}.</strong>
          <span>Toque para carregar o mapa da região</span>
          <small>Mapa externo do Google · localização ilustrativa</small>
        </button>
      )}
      <a
        href={whatsapp(
          "Olá! Gostaria de confirmar o endereço da Ninho Veículos e receber as orientações de como chegar.",
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        Confirmar endereço e como chegar
        <ArrowUpRight size={17} />
      </a>
    </div>
  );
}
