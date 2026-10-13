import fs from "node:fs/promises";
import sharp from "sharp";
const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;
const pexels = (id, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
const photos = {
  "jeep-hero": [pexels(1687147, 2200), "https://www.pexels.com/photo/1687147/"],
  bmw: [
    unsplash("1555215695-3004980ad54e"),
    "https://images.unsplash.com/photo-1555215695-3004980ad54e",
  ],
  mercedes: [
    unsplash("1618843479313-40f8afb4b4d8"),
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
  ],
  audi: [
    unsplash("1606664515524-ed2f786a0bd6"),
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
  ],
  hatch: [
    unsplash("1549317661-bd32c8ce0db2"),
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
  ],
  porsche: [
    unsplash("1503376780353-7e6692767b70"),
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  ],
  detail: [
    unsplash("1486262715619-67b85e0b08d3"),
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3",
  ],
  road: [
    unsplash("1464822759023-fed622ff2c3b"),
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  ],
  showroom: [
    unsplash("1563720223185-11003d516935"),
    "https://images.unsplash.com/photo-1563720223185-11003d516935",
  ],
  cabin: [
    pexels(11845080),
    "https://www.pexels.com/photo/11845080/ — Mike Bird",
  ],
  ford: [pexels(33336584), "https://www.pexels.com/photo/33336584/"],
  golf: [
    pexels(18038946),
    "https://www.pexels.com/photo/18038946/ — FBO Media",
  ],
  polo: [
    pexels(16625624),
    "https://www.pexels.com/photo/16625624/ — Josh Withers",
  ],
  civic: [
    pexels(6143989),
    "https://www.pexels.com/photo/6143989/ — Jean Carlo Salas",
  ],
  corolla: [
    pexels(17075678),
    "https://www.pexels.com/photo/17075678/ — Victor Miyata",
  ],
  clio: [
    pexels(16634648),
    "https://www.pexels.com/photo/16634648/ — Mike Bird",
  ],
  peugeot208: [
    pexels(23156446),
    "https://www.pexels.com/photo/23156446/ — Gezer Amorim",
  ],
  cruze: [
    pexels(20270367),
    "https://www.pexels.com/photo/20270367/ — İsmat İsmayilzada",
  ],
};
await fs.mkdir("public/images", { recursive: true });
await Promise.all(
  Object.entries(photos).map(async ([name, [url]]) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${name}: ${r.status}`);
    await sharp(Buffer.from(await r.arrayBuffer()))
      .webp({ quality: name === "jeep-hero" ? 83 : 80 })
      .toFile(`public/images/${name}.webp`);
  }),
);
for (const [name, width] of [
  ["jeep", 1000],
  ["jeep-mobile", 800],
])
  await sharp("public/images/jeep-hero.webp")
    .resize({ width })
    .webp({ quality: 80 })
    .toFile(`public/images/${name}.webp`);
if (process.argv[2])
  await sharp(process.argv[2])
    .webp({ quality: 90 })
    .toFile("public/images/creta.webp");
const font = await fetch(
  "https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2",
);
await fs.mkdir("public/fonts", { recursive: true });
await fs.writeFile(
  "public/fonts/dm-sans.woff2",
  Buffer.from(await font.arrayBuffer()),
);
await fs.writeFile(
  "public/images/CREDITOS.md",
  `# Fotografias reais\n\nLicenças: https://unsplash.com/license e https://www.pexels.com/license/ — uso comercial permitido sem atribuição obrigatória. Fotografias ilustrativas, sem vínculo com fabricantes; interior e mecânica não representam cada unidade.\n\n${Object.entries(
    photos,
  )
    .map(([name, [, credit]]) => `- ${name}.webp — ${credit}`)
    .join(
      "\n",
    )}\n- jeep.webp e jeep-mobile.webp — variantes locais de jeep-hero.webp.\n- creta.webp — fotografia fornecida pelo usuário em 13/10/2026; origem/licença não informadas. Confirmar direitos antes do uso comercial.\n`,
);
console.log("Fotografias e fonte locais atualizadas.");
