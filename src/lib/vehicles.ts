import { vehicles } from "@/data/vehicles";
// Contrato único: substitua estas funções por consultas ao CMS sem alterar as páginas.
export async function getVehicles() {
  return vehicles.filter((v) => v.status === "available");
}
export async function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}
export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
export const number = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);
