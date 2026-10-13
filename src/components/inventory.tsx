"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  X,
  ArrowRight,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { VehicleCard, readSaved } from "./vehicle-card";
import { money, number } from "@/lib/vehicles";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "@/components/link";
export function Inventory({ vehicles }: { vehicles: Vehicle[] }) {
  const query = useSearchParams(),
    router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [list, setList] = useState(false);
  const [filters, setFilters] = useState(false);
  const [error, setError] = useState("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  useEffect(() => {
    const sync = () => setFavorites(readSaved("ninho-favorites"));
    sync();
    setCompare(readSaved("ninho-compare").slice(0, 3));
    window.addEventListener("ninho-favorites", sync);
    return () => window.removeEventListener("ninho-favorites", sync);
  }, []);
  const value = (key: string) => query.get(key) || "";
  const results = useMemo(() => {
    const filtered = vehicles.filter(
      (v) =>
        (!query.get("q") ||
          `${v.brand} ${v.model} ${v.version} ${v.id}`
            .toLowerCase()
            .includes(query.get("q")!.toLowerCase())) &&
        (!query.get("marca") || v.brand === query.get("marca")) &&
        (!query.get("modelo") || v.model === query.get("modelo")) &&
        (!query.get("categoria") || v.body === query.get("categoria")) &&
        (!query.get("preco") || v.price <= Number(query.get("preco"))) &&
        (!query.get("min") || v.price >= Number(query.get("min"))) &&
        (!query.get("ano") || v.year >= Number(query.get("ano"))) &&
        (!query.get("km") || v.km <= Number(query.get("km"))) &&
        (!query.get("combustivel") || v.fuel === query.get("combustivel")) &&
        (!query.get("cambio") || v.transmission === query.get("cambio")) &&
        (!query.get("cor") || v.color === query.get("cor")) &&
        (!query.get("opcional") ||
          v.features.includes(query.get("opcional")!)) &&
        (!query.get("favoritos") || favorites.includes(v.id)),
    );
    return filtered.sort((a, b) =>
      query.get("ordem") === "menor"
        ? a.price - b.price
        : query.get("ordem") === "maior"
          ? b.price - a.price
          : query.get("ordem") === "ano"
            ? b.year - a.year
            : query.get("ordem") === "km"
              ? a.km - b.km
              : Number(b.featured) - Number(a.featured),
    );
  }, [query, vehicles, favorites]);
  function update(key: string, val: string) {
    const next = new URLSearchParams(query.toString());
    if (val) next.set(key, val);
    else next.delete(key);
    next.delete("pagina");
    if (key === "marca") next.delete("modelo");
    router.replace(`/estoque?${next}`, { scroll: false });
  }
  function toggle(id: string) {
    const next = compare.includes(id)
      ? compare.filter((x) => x !== id)
      : [...compare, id];
    if (next.length > 3) {
      setError(
        "Você pode comparar até 3 veículos. Remova um para adicionar outro.",
      );
      return;
    }
    setError("");
    setCompare(next);
    try {
      localStorage.setItem("ninho-compare", JSON.stringify(next));
    } catch {}
  }
  const page = Math.max(1, Number(value("pagina")) || 1);
  const pageCount = Math.max(1, Math.ceil(results.length / 9));
  const safePage = Math.min(page, pageCount);
  const shown = results.slice((safePage - 1) * 9, safePage * 9);
  const selected = vehicles.filter((v) => compare.includes(v.id));
  return (
    <section className="container inventory">
      <div className="inventory-toolbar">
        <div className="inventory-search">
          <Search size={19} />
          <input
            aria-label="Buscar marca, modelo ou código"
            placeholder="Qual carro você procura?"
            defaultValue={value("q")}
            key={value("q")}
            onKeyDown={(e) => {
              if (e.key === "Enter") update("q", e.currentTarget.value);
            }}
            onBlur={(e) => {
              if (e.currentTarget.value !== value("q"))
                update("q", e.currentTarget.value);
            }}
          />
        </div>
        <button
          className={`button button-outline ${value("favoritos") ? "active" : ""}`}
          onClick={() => update("favoritos", value("favoritos") ? "" : "1")}
          aria-pressed={!!value("favoritos")}
        >
          <Heart size={17} />
          Favoritos
        </button>
        <button
          className="button button-outline filter-toggle"
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          <SlidersHorizontal size={18} />
          Filtros
        </button>
      </div>
      <div className="inventory-layout">
        <aside
          className={`filters ${filters ? "filters-open" : ""}`}
          aria-label="Filtrar veículos"
        >
          <div className="flex-between">
            <h2>
              <SlidersHorizontal size={18} />
              Encontre o seu
            </h2>
            <button
              className="text-button"
              onClick={() => router.replace("/estoque", { scroll: false })}
            >
              Limpar
            </button>
          </div>
          {[
            [
              "marca",
              "Marca",
              [...new Set(vehicles.map((v) => v.brand))].sort(),
            ],
            [
              "modelo",
              "Modelo",
              [
                ...new Set(
                  vehicles
                    .filter(
                      (v) => !value("marca") || v.brand === value("marca"),
                    )
                    .map((v) => v.model),
                ),
              ],
            ],
            [
              "categoria",
              "Carroceria",
              ["SUV", "Sedã", "Hatch", "Picape", "Esportivo", "Perua"],
            ],
            [
              "combustivel",
              "Combustível",
              ["Flex", "Gasolina", "Diesel", "Híbrido"],
            ],
            ["cambio", "Câmbio", ["Automático", "Manual"]],
            ["cor", "Cor", [...new Set(vehicles.map((v) => v.color))]],
            [
              "opcional",
              "Opcionais",
              [
                "Ar-condicionado",
                "Central multimídia",
                "Airbags",
                "Freios ABS",
              ],
            ],
          ].map(([key, label, options]) => (
            <label key={key as string}>
              {label as string}
              <select
                value={value(key as string)}
                onChange={(e) => update(key as string, e.target.value)}
              >
                <option value="">Todas as opções</option>
                {(options as string[]).map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          ))}
          <div className="filter-pair">
            <label>
              Preço mínimo
              <input
                type="number"
                min="0"
                aria-label="Preço mínimo"
                defaultValue={value("min")}
                key={`min${value("min")}`}
                placeholder="R$ 0"
                onBlur={(e) => update("min", e.target.value)}
              />
            </label>
            <label>
              Preço máximo
              <input
                type="number"
                min="0"
                aria-label="Preço máximo"
                defaultValue={value("preco")}
                key={`max${value("preco")}`}
                placeholder="Sem limite"
                onBlur={(e) => update("preco", e.target.value)}
              />
            </label>
          </div>
          <label>
            Ano a partir de
            <select
              value={value("ano")}
              onChange={(e) => update("ano", e.target.value)}
            >
              <option value="">Qualquer ano</option>
              {Array.from({ length: 14 }, (_, i) => 2026 - i).map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Quilometragem máxima
            <select
              value={value("km")}
              onChange={(e) => update("km", e.target.value)}
            >
              <option value="">Sem limite</option>
              {[30000, 50000, 80000, 100000].map((k) => (
                <option value={k} key={k}>
                  {number(k)} km
                </option>
              ))}
            </select>
          </label>
          <div className="filter-help">
            <strong>Precisa de uma mão?</strong>
            <p>A gente ajuda a encontrar o carro que faz sentido para você.</p>
            <Link href="/contato">
              Fale com a Ninho
              <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
        <div>
          <div className="results-toolbar">
            <p role="status">
              <strong>{results.length}</strong> veículos encontrados
            </p>
            <div>
              <select
                aria-label="Ordenar veículos"
                value={value("ordem")}
                onChange={(e) => update("ordem", e.target.value)}
              >
                <option value="">Seleção Ninho</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="ano">Mais novos</option>
                <option value="km">Menor quilometragem</option>
              </select>
              <button
                className="icon-button view-toggle"
                aria-label="Visualização em grade"
                aria-pressed={!list}
                onClick={() => setList(false)}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className="icon-button view-toggle"
                aria-label="Visualização em lista"
                aria-pressed={list}
                onClick={() => setList(true)}
              >
                <List size={19} />
              </button>
            </div>
          </div>
          {results.length ? (
            <>
              <div
                className={`vehicle-grid inventory-grid ${list ? "list-view" : ""}`}
              >
                {shown.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    compare={compare}
                    onCompare={toggle}
                  />
                ))}
              </div>
              <nav className="pagination" aria-label="Páginas do estoque">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    className={safePage === i + 1 ? "active" : ""}
                    aria-current={safePage === i + 1 ? "page" : undefined}
                    onClick={() => {
                      const next = new URLSearchParams(query.toString());
                      next.set("pagina", String(i + 1));
                      router.replace(`/estoque?${next}`);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </>
          ) : (
            <div className="empty-state">
              <Search size={38} />
              <h2>Seu próximo carro ainda pode estar por aqui.</h2>
              <p>
                Experimente ajustar os filtros ou conte para a gente o que você
                procura.
              </p>
              <button
                className="button"
                onClick={() => router.replace("/estoque")}
              >
                Ver todos os veículos
                <ArrowRight size={18} />
              </button>
            </div>
          )}
          <p className="fine-print">
            Estoque demonstrativo. Todas as fotos são ilustrativas. Valores e
            condições não constituem oferta comercial.
          </p>
        </div>
      </div>
      {error && (
        <p role="alert" className="compare-error">
          {error}
          <button
            className="icon-button"
            aria-label="Fechar aviso"
            onClick={() => setError("")}
          >
            <X size={18} />
          </button>
        </p>
      )}
      {compare.length > 0 && (
        <div className="compare-bar">
          <span>
            <strong>{compare.length}/3</strong> veículos para comparar
          </span>
          <button
            className="text-button"
            onClick={() => {
              setCompare([]);
              try {
                localStorage.removeItem("ninho-compare");
              } catch {}
            }}
          >
            Limpar
          </button>
          <button className="button" onClick={() => setComparisonOpen(true)}>
            Comparar agora
            <ArrowRight size={17} />
          </button>
        </div>
      )}
      <Dialog.Root open={comparisonOpen} onOpenChange={setComparisonOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog comparison">
            <Dialog.Close
              className="dialog-close icon-button"
              aria-label="Fechar comparação"
            >
              <X />
            </Dialog.Close>
            <Dialog.Title>Uma escolha, lado a lado.</Dialog.Title>
            <Dialog.Description>
              Compare os principais detalhes dos veículos selecionados.
            </Dialog.Description>
            <div className="comparison-scroll">
              <table>
                <caption className="sr-only">Comparação de veículos</caption>
                <thead>
                  <tr>
                    <th>Detalhe</th>
                    {selected.map((v) => (
                      <th key={v.id}>
                        <Link href={`/estoque/${v.slug}`}>
                          {v.brand} {v.model}
                        </Link>
                        <small>{v.id}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Preço",
                    "Ano",
                    "Quilometragem",
                    "Combustível",
                    "Câmbio",
                  ].map((label, i) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {selected.map((v) => (
                        <td key={v.id}>
                          {
                            [
                              money(v.price),
                              v.year,
                              `${number(v.km)} km`,
                              v.fuel,
                              v.transmission,
                            ][i]
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
