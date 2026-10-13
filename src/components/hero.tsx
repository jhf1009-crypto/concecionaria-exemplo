"use client";

import Image from "next/image";
import Link from "@/components/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { WhatsApp } from "./ui";
import { site } from "@/config/site";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current || !media.current) return;
      const rect = section.current.getBoundingClientRect();
      if (preference.matches) {
        media.current.style.transform = "none";
        return;
      }
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const distance = Math.min(100, Math.max(-40, -rect.top * 0.18));
      media.current.style.transform = `translate3d(0, ${distance}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    preference.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      preference.removeEventListener("change", onScroll);
    };
  }, []);
  return (
    <section className="hero" ref={section}>
      <div className="hero-parallax" ref={media}>
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet="/images/jeep-mobile.webp"
          />
          <Image
            className="hero-photo"
            src={site.images.hero}
            alt="Jeep Compass prata em uma floresta, fotografia ilustrativa"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
        </picture>
      </div>
      <div className="hero-shade" />
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span />
            BEM-VINDO À NINHO VEÍCULOS
          </span>
          <h1>
            <span>Seu próximo</span>
            <span>caminho</span>
            <span>começa aqui.</span>
          </h1>
          <p>
            Mais do que um carro, uma boa escolha.
            <br />
            Encontre o seu próximo seminovo com a
            <br className="desktop-break" /> tranquilidade de se sentir em casa.
          </p>
          <div className="hero-actions">
            <Link href="/estoque" className="button button-cream">
              Explore nosso estoque
              <ArrowUpRight size={19} />
            </Link>
            <WhatsApp
              className="button-ghost"
              message="Olá! Visitei o site da Ninho Veículos e quero ajuda para escolher meu próximo carro."
            >
              Vamos conversar
            </WhatsApp>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={17} />
            <span>Cuidado em cada detalhe. Do começo ao próximo caminho.</span>
          </div>
        </div>
        <div className="hero-caption">
          <span>FEITO PARA NOVAS HISTÓRIAS</span>
          <ArrowUpRight size={29} />
        </div>
      </div>
    </section>
  );
}
