"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "./ui";
import Link from "next/link";
export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (!ref.current || !progress.current) return;
      const rect = ref.current.getBoundingClientRect();
      const value = Math.min(
        1,
        Math.max(
          0,
          (innerHeight - rect.top) / (rect.height + innerHeight * 0.5),
        ),
      );
      progress.current.style.transform = `scaleY(${value})`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <section ref={ref} className="journey section">
      <div className="container journey-layout">
        <div>
          <Eyebrow>Do primeiro olhar à nova história</Eyebrow>
          <h2>
            Um caminho simples.
            <br />
            No seu ritmo.
          </h2>
          <p>
            Comprar um carro pode ser uma boa experiência. A gente cuida dos
            detalhes para você aproveitar a escolha.
          </p>
          <Link href="/sobre" className="text-link">
            Conheça o jeito Ninho
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="journey-steps">
          <div className="journey-progress">
            <div ref={progress} style={{ transformOrigin: "top" }} />
          </div>
          {[
            [
              "Escolha com calma",
              "Explore os modelos e encontre aquele que faz sentido para sua vida.",
            ],
            [
              "Sinta ao volante",
              "Agende uma visita, tire suas dúvidas e conheça o carro de perto.",
            ],
            [
              "Entenda cada detalhe",
              "Converse sobre a troca, o pagamento e as condições antes de decidir.",
            ],
            [
              "Comece uma nova história",
              "Documentação conferida, chaves na mão e um novo caminho pela frente.",
            ],
          ].map(([title, text], i) => (
            <div className="journey-step" key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
