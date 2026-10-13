import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui";
import { Inventory } from "@/components/inventory";
import { getVehicles } from "@/lib/vehicles";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Estoque de seminovos em Goiânia",
  description:
    "Explore o estoque demonstrativo da Ninho Veículos. Filtre por marca, modelo, preço e carroceria, salve favoritos e compare até três veículos.",
  alternates: { canonical: "/estoque" },
};
export default async function Stock() {
  return (
    <>
      <PageIntro
        label="Estoque"
        title="Seu próximo carro está por aqui."
        description="Escolha com calma, compare os detalhes e encontre o carro que combina com o seu momento."
      />
      <Suspense
        fallback={
          <div
            className="container skeleton-grid"
            aria-label="Carregando estoque"
          >
            {[1, 2, 3].map((i) => (
              <div className="skeleton" key={i} />
            ))}
          </div>
        }
      >
        <Inventory vehicles={await getVehicles()} />
      </Suspense>
    </>
  );
}
