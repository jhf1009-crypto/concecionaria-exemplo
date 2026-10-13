import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getVehicles } from "@/lib/vehicles";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    "",
    "/estoque",
    "/financiamento",
    "/venda-seu-carro",
    "/sobre",
    "/contato",
    "/politica-de-privacidade",
    "/termos",
    ...(await getVehicles()).map((v) => `/estoque/${v.slug}`),
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/estoque" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/estoque") ? 0.8 : 0.5,
  }));
}
