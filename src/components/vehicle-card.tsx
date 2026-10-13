"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  GitCompareArrows,
  CalendarDays,
  Gauge,
  Settings2,
  MessageCircle,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { money, number } from "@/lib/vehicles";
import { whatsapp } from "@/config/site";
export function readSaved(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
export function VehicleCard({
  vehicle: v,
  compare,
  onCompare,
}: {
  vehicle: Vehicle;
  compare?: string[];
  onCompare?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const sync = () => setLiked(readSaved("ninho-favorites").includes(v.id));
    sync();
    window.addEventListener("ninho-favorites", sync);
    return () => window.removeEventListener("ninho-favorites", sync);
  }, [v.id]);
  function favorite() {
    const saved = readSaved("ninho-favorites");
    const next = saved.includes(v.id)
      ? saved.filter((id) => id !== v.id)
      : [...saved, v.id];
    try {
      localStorage.setItem("ninho-favorites", JSON.stringify(next));
    } catch {}
    setLiked(next.includes(v.id));
    window.dispatchEvent(new Event("ninho-favorites"));
  }
  return (
    <article className="vehicle-card">
      <div className="card-image">
        <Link href={`/estoque/${v.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={v.image}
            alt={`${v.brand} ${v.model} ${v.color.toLowerCase()}, fotografia ilustrativa`}
            fill
            sizes="(max-width: 620px) 90vw, (max-width: 1000px) 45vw, 30vw"
          />
        </Link>
        <span className="vehicle-tag">{v.tag}</span>
        <button
          className={`favorite ${liked ? "is-liked" : ""}`}
          aria-label={`${liked ? "Remover" : "Adicionar"} ${v.model} ${v.id} ${liked ? "dos" : "aos"} favoritos`}
          aria-pressed={liked}
          onClick={favorite}
        >
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
        </button>
        <span className="photo-label">Foto ilustrativa</span>
      </div>
      <div className="card-content">
        <span className="card-brand">{v.brand}</span>
        <Link href={`/estoque/${v.slug}`}>
          <h3>
            {v.model}
            <ArrowUpRight size={22} />
          </h3>
        </Link>
        <p>{v.version}</p>
        <div className="card-specs">
          <span>
            <CalendarDays size={14} />
            {v.year}
          </span>
          <span>
            <Gauge size={14} />
            {number(v.km)} km
          </span>
          <span>
            <Settings2 size={14} />
            {v.transmission}
          </span>
        </div>
        <div className="card-price">
          <strong>{money(v.price)}</strong>
          <Link
            href={`/estoque/${v.slug}`}
            className="card-arrow"
            aria-label={`Ver detalhes do ${v.model} ${v.id}`}
          >
            <ArrowUpRight size={21} />
          </Link>
        </div>
        <div className="card-bottom">
          <a
            href={whatsapp(
              `Olá! Tenho interesse no ${v.brand} ${v.model} ${v.year} (código ${v.id}) que vi no site da Ninho Veículos.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={14} />
            Tenho interesse
          </a>
          {onCompare && (
            <button
              className={compare?.includes(v.id) ? "selected" : ""}
              aria-pressed={compare?.includes(v.id)}
              onClick={() => onCompare(v.id)}
            >
              <GitCompareArrows size={14} />
              Comparar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
