export const site = {
  name: "Ninho Veículos",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://concecionaria-exemplo.vercel.app",
  whatsapp: "5562999858449",
  phone: "(62) 99985-8449",
  tel: "+5562999858449",
  email: "contato@ninhoveiculos.example",
  city: "Goiânia",
  state: "GO",
  address: "Av. Exemplo, 1200 · Setor Bueno",
  addressNote: "Endereço ilustrativo. Confirme a localização pelo WhatsApp.",
  cnpj: "CNPJ: a informar",
  hours: ["Segunda a sexta · 8h às 18h", "Sábado · 8h às 13h"],
  demo: true,
  disclaimer: "Site de demonstração. Veículos, preços e informações fictícios.",
  images: {
    hero: "/images/jeep-hero.webp",
    about: "/images/showroom.webp",
    road: "/images/road.webp",
  },
  testimonials: [
    {
      name: "Mariana R.",
      text: "Pude olhar cada detalhe e tirar minhas dúvidas com calma. Foi assim que encontrei o carro para a minha família.",
      car: "Compra de SUV",
      initials: "MR",
    },
    {
      name: "Rafael M.",
      text: "Gostei de entender os custos antes de decidir. Uma conversa direta, do primeiro contato até a entrega.",
      car: "Troca de veículo",
      initials: "RM",
    },
    {
      name: "Camila S.",
      text: "Mais do que escolher um carro, eu queria fazer uma escolha segura. O cuidado fez a diferença.",
      car: "Primeiro seminovo",
      initials: "CS",
    },
  ],
};
export function whatsapp(
  message = "Olá! Vim pelo site da Ninho Veículos e gostaria de conversar.",
) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
