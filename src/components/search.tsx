"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";
export function QuickSearch() {
  const [brand, setBrand] = useState("");
  const router = useRouter();
  return (
    <form
      className="quick-search"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(
          new FormData(e.currentTarget) as unknown as Record<string, string>,
        );
        for (const [k, v] of [...params]) if (!v) params.delete(k);
        router.push(`/estoque?${params}`);
      }}
    >
      <div className="search-caption">
        <Search size={16} />
        <strong>Qual é o seu próximo carro?</strong>
        <span>Encontre um que combine com você.</span>
      </div>
      <div className="search-fields">
        <label>
          Marca
          <select
            name="marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">Todas as marcas</option>
            {[...new Set(vehicles.map((v) => v.brand))].sort().map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Modelo
          <select name="modelo" key={brand}>
            <option value="">Todos os modelos</option>
            {[
              ...new Set(
                vehicles
                  .filter((v) => !brand || v.brand === brand)
                  .map((v) => v.model),
              ),
            ].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Faixa de preço
          <select name="preco">
            <option value="">Qualquer valor</option>
            <option value="50000">Até R$ 50 mil</option>
            <option value="100000">Até R$ 100 mil</option>
            <option value="150000">Até R$ 150 mil</option>
            <option value="300000">Até R$ 300 mil</option>
          </select>
        </label>
        <button className="button" type="submit">
          Encontrar meu carro
          <ArrowRight size={19} />
        </button>
      </div>
    </form>
  );
}
