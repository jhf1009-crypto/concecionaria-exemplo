"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VehicleCard } from "./vehicle-card";
import type { Vehicle } from "@/types/vehicle";
export function HomeSelection({ vehicles }: { vehicles: Vehicle[] }) {
  const [category, setCategory] = useState("Todos");
  const selection = vehicles
    .filter((v) => category === "Todos" || v.body === category)
    .slice(0, 3);
  return (
    <>
      <div className="selection-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Categorias de destaque"
        >
          {["Todos", "SUV", "Hatch", "Sedã", "Esportivo"].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "Todos"
                ? "Todos os estilos"
                : c === "SUV"
                  ? "SUVs"
                  : c === "Sedã"
                    ? "Sedãs"
                    : c === "Esportivo"
                      ? "Esportivos"
                      : "Hatches"}
            </button>
          ))}
        </div>
        <Link className="text-link" href="/estoque">
          Ver estoque completo
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="vehicle-grid">
        {selection.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </>
  );
}
