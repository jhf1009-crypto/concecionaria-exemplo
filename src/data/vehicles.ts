import type { Vehicle } from "@/types/vehicle";
type Base = Pick<
  Vehicle,
  | "brand"
  | "model"
  | "version"
  | "year"
  | "price"
  | "body"
  | "image"
  | "fuel"
  | "color"
  | "transmission"
>;
const bases: Base[] = [
  {
    brand: "Jeep",
    model: "Compass",
    version: "Limited 2.0",
    year: 2021,
    price: 139900,
    body: "SUV",
    image: "jeep",
    fuel: "Flex",
    color: "Prata",
    transmission: "Automático",
  },
  {
    brand: "Hyundai",
    model: "Creta",
    version: "Platinum 1.0 Turbo",
    year: 2025,
    price: 159900,
    body: "SUV",
    image: "creta",
    fuel: "Flex",
    color: "Bege",
    transmission: "Automático",
  },
  {
    brand: "Volkswagen",
    model: "Polo",
    version: "Comfortline 1.0 TSI",
    year: 2019,
    price: 72900,
    body: "Hatch",
    image: "polo",
    fuel: "Flex",
    color: "Prata",
    transmission: "Automático",
  },
  {
    brand: "Chevrolet",
    model: "Cruze",
    version: "LT 1.8",
    year: 2014,
    price: 65900,
    body: "Sedã",
    image: "cruze",
    fuel: "Flex",
    color: "Azul",
    transmission: "Automático",
  },
  {
    brand: "Peugeot",
    model: "208",
    version: "Allure 1.5",
    year: 2017,
    price: 55900,
    body: "Hatch",
    image: "peugeot208",
    fuel: "Flex",
    color: "Branco",
    transmission: "Manual",
  },
  {
    brand: "Volkswagen",
    model: "Golf",
    version: "GTI 2.0 TSI",
    year: 2015,
    price: 139900,
    body: "Hatch",
    image: "golf",
    fuel: "Gasolina",
    color: "Cinza",
    transmission: "Automático",
  },
  {
    brand: "Honda",
    model: "Civic",
    version: "EXS 1.8",
    year: 2009,
    price: 54900,
    body: "Sedã",
    image: "civic",
    fuel: "Flex",
    color: "Preto",
    transmission: "Automático",
  },
  {
    brand: "Fiat",
    model: "500",
    version: "Cult 1.4",
    year: 2015,
    price: 59900,
    body: "Hatch",
    image: "hatch",
    fuel: "Flex",
    color: "Azul",
    transmission: "Automático",
  },
  {
    brand: "Toyota",
    model: "Corolla",
    version: "XEi 1.8",
    year: 1999,
    price: 24900,
    body: "Sedã",
    image: "corolla",
    fuel: "Gasolina",
    color: "Prata",
    transmission: "Manual",
  },
  {
    brand: "Renault",
    model: "Clio",
    version: "RS 2.0 16V",
    year: 2011,
    price: 49900,
    body: "Hatch",
    image: "clio",
    fuel: "Gasolina",
    color: "Preto",
    transmission: "Manual",
  },
  {
    brand: "Ford",
    model: "F-150",
    version: "Lariat 5.0 V8",
    year: 2023,
    price: 419900,
    body: "Picape",
    image: "ford",
    fuel: "Gasolina",
    color: "Preto",
    transmission: "Automático",
  },
  {
    brand: "BMW",
    model: "M2",
    version: "3.0 Coupé DCT",
    year: 2018,
    price: 329900,
    body: "Esportivo",
    image: "bmw",
    fuel: "Gasolina",
    color: "Branco",
    transmission: "Automático",
  },
  {
    brand: "Audi",
    model: "RS6 Avant",
    version: "4.0 TFSI Quattro",
    year: 2016,
    price: 399900,
    body: "Perua",
    image: "audi",
    fuel: "Gasolina",
    color: "Preto",
    transmission: "Automático",
  },
  {
    brand: "Land Rover",
    model: "Range Rover Sport",
    version: "HSE 3.0 TDV6",
    year: 2012,
    price: 169900,
    body: "SUV",
    image: "showroom",
    fuel: "Diesel",
    color: "Preto",
    transmission: "Automático",
  },
  {
    brand: "Porsche",
    model: "Panamera",
    version: "4 E-Hybrid 2.9",
    year: 2019,
    price: 549900,
    body: "Sedã",
    image: "porsche",
    fuel: "Híbrido",
    color: "Preto",
    transmission: "Automático",
  },
  {
    brand: "Mercedes-Benz",
    model: "AMG GT",
    version: "4.0 V8 Biturbo",
    year: 2018,
    price: 699900,
    body: "Esportivo",
    image: "mercedes",
    fuel: "Gasolina",
    color: "Prata",
    transmission: "Automático",
  },
];

// Três unidades demonstrativas por modelo. As fotos são referências do modelo, não das unidades.
export const vehicles: Vehicle[] = Array.from({ length: 48 }, (_, i) => {
  const base = bases[i % bases.length];
  const batch = Math.floor(i / bases.length);
  const id = `NV-${String(120 + i).padStart(4, "0")}`;
  const year = base.year;
  return {
    ...base,
    id,
    year,
    slug: `${base.brand}-${base.model}-${year}-${id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    km:
      base.year < 2005
        ? 145000 + batch * 13000
        : base.year >= 2025
          ? 8000 + batch * 6000
          : 24000 + ((i * 3700) % 65000),
    price: base.price - batch * (base.price > 200000 ? 8000 : 2000),
    image: `/images/${base.image}.webp`,
    gallery: [
      {
        src: `/images/${base.image}.webp`,
        alt: `${base.brand} ${base.model} — fotografia ilustrativa do modelo`,
      },
      {
        src: "/images/cabin.webp",
        alt: "Interior de referência: fotografia genérica, não representa esta unidade",
      },
      {
        src: "/images/detail.webp",
        alt: "Detalhe mecânico de referência: fotografia genérica, não representa esta unidade",
      },
    ],
    features: [
      "Ar-condicionado",
      "Direção assistida",
      "Vidros elétricos",
      "Freios ABS",
      "Airbags",
      ...(year >= 2014 ? ["Central multimídia"] : []),
    ],
    featured: i < 4,
    tag:
      i === 0
        ? "Seleção Ninho"
        : i === 1
          ? "Para a família"
          : i === 2
            ? "Para o dia a dia"
            : base.price < 60000
              ? "Até R$ 60 mil"
              : "Seminovo",
    status: "available",
  };
});
