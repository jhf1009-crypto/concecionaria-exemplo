import Link from "@/components/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsapp } from "@/config/site";
export function WhatsApp({
  message,
  children = "Vamos conversar",
  className = "",
}: {
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsapp(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`button ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </span>
  );
}
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
      </nav>
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
