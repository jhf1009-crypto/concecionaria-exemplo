"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Heart,
  Menu,
  MessageCircle,
  X,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { site, whatsapp } from "@/config/site";
import { track } from "@/lib/analytics";
const links = [
  ["Estoque", "/estoque"],
  ["Financiamento", "/financiamento"],
  ["Venda seu carro", "/venda-seu-carro"],
  ["A Ninho", "/sobre"],
  ["Contato", "/contato"],
];
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Ninho Veículos — início"
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <svg
        width="46"
        height="43"
        viewBox="0 0 46 43"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 21 23 6l18 15M8 27c9 10 21 10 30 0M13 23c6 7 14 7 20 0"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        ninho<span>VEÍCULOS</span>
      </span>
    </Link>
  );
}
export function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    let last = window.scrollY;
    const listener = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last + 3);
      last = y;
    };
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className={`header ${hidden && !open ? "header-hidden" : ""}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Menu principal">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button"
            href="/estoque?favoritos=1"
            aria-label="Ver favoritos"
          >
            <Heart size={21} />
          </Link>
          <a
            className="button header-whatsapp"
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={17} />
            Fale com a Ninho
            <ArrowUpRight size={16} />
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="icon-button mobile-menu"
              aria-label="Abrir menu"
            >
              <Menu />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-drawer">
                <Dialog.Title className="sr-only">Menu principal</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navegue pelas páginas da Ninho Veículos.
                </Dialog.Description>
                <div className="flex-between">
                  <Brand />
                  <Dialog.Close
                    className="icon-button"
                    aria-label="Fechar menu"
                  >
                    <X />
                  </Dialog.Close>
                </div>
                <nav aria-label="Menu móvel">
                  {links.map(([label, href], i) => (
                    <Link key={href} href={href} onClick={() => setOpen(false)}>
                      <small>0{i + 1}</small>
                      {label}
                      <ArrowUpRight />
                    </Link>
                  ))}
                </nav>
                <a className="button" href={whatsapp()}>
                  <MessageCircle size={20} />
                  Conversar pelo WhatsApp
                </a>
                <p>
                  {site.phone} · {site.city}, {site.state}
                </p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand light />
            <p>
              Seu próximo caminho
              <br />
              começa com uma boa escolha.
            </p>
            <a href={whatsapp()} className="footer-phone">
              {site.phone}
              <ArrowUpRight size={19} />
            </a>
          </div>
          <div>
            <h2>Encontre seu caminho</h2>
            {links.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Venha conversar</h2>
            <p>
              <MapPin size={17} />
              {site.address}
              <br />
              {site.city} · {site.state}
            </p>
            <p className="small">{site.addressNote}</p>
            <p>
              <Clock size={17} />
              {site.hours[0]}
              <br />
              {site.hours[1]}
            </p>
            <a href={`tel:${site.tel}`}>
              <Phone size={16} />
              {site.phone}
            </a>
          </div>
          <div className="footer-note">
            <ShieldCheck size={31} />
            <h2>Confiança em cada detalhe.</h2>
            <p>
              Uma experiência de compra que respeita o seu tempo e a sua
              história.
            </p>
            <span>{site.cnpj}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Ninho Veículos.</p>
          <div>
            <Link href="/politica-de-privacidade">Privacidade</Link>
            <Link href="/termos">Termos de uso</Link>
            <button
              onClick={() =>
                window.dispatchEvent(new Event("ninho-cookie-settings"))
              }
            >
              Preferências de cookies
            </button>
          </div>
        </div>
        <p className="demo-disclaimer">{site.disclaimer}</p>
      </div>
    </footer>
  );
}
export function FloatingWhatsApp() {
  const path = usePathname();
  return (
    <a
      className="floating-wa"
      aria-label="Conversar com a Ninho pelo WhatsApp"
      href={whatsapp(
        `Olá! Estou na página ${path} do site da Ninho Veículos e gostaria de ajuda.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { page: path })}
    >
      <MessageCircle size={27} />
    </a>
  );
}
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ninho-consent");
      setVisible(!saved);
      if (saved) {
        const v = JSON.parse(saved);
        setAllowed(!!v.analytics);
        setAnalytics(!!v.analytics);
      }
    } catch {
      setVisible(true);
    }
    const open = () => {
      setVisible(true);
      setPreferences(true);
    };
    window.addEventListener("ninho-cookie-settings", open);
    return () => window.removeEventListener("ninho-cookie-settings", open);
  }, []);
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!allowed || !id || !/^G-[A-Z0-9]+$/.test(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    document.head.append(script);
    return () => {
      script.remove();
      window.gtag = undefined;
    };
  }, [allowed]);
  function save(value: boolean) {
    try {
      localStorage.setItem(
        "ninho-consent",
        JSON.stringify({ necessary: true, analytics: value, version: 1 }),
      );
    } catch {}
    const revoking = allowed && !value;
    setAllowed(value);
    setAnalytics(value);
    setVisible(false);
    if (!value) {
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; Max-Age=0; path=/`;
          document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
        }
      });
    }
    if (revoking) location.reload();
  }
  if (!visible) return null;
  return (
    <aside className="cookies" aria-label="Preferências de privacidade">
      <div>
        <strong>Seu caminho. Suas escolhas.</strong>
        <p>
          Usamos armazenamento essencial para favoritos. Cookies de análise são
          opcionais. <Link href="/politica-de-privacidade">Saiba mais</Link>.
        </p>
        {preferences && (
          <label className="check">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            Permitir análise de navegação
          </label>
        )}
      </div>
      <div className="cookie-actions">
        <button
          className="text-button"
          onClick={() => setPreferences(!preferences)}
        >
          Preferências
        </button>
        <button className="button button-outline" onClick={() => save(false)}>
          Só essenciais
        </button>
        <button
          className="button"
          onClick={() => save(preferences ? analytics : true)}
        >
          {preferences ? "Salvar escolhas" : "Aceitar cookies"}
        </button>
      </div>
    </aside>
  );
}
