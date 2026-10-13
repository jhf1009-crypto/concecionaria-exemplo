# Ninho Veículos

Demonstração em Next.js 16 (App Router), React, TypeScript estrito, Tailwind + CSS próprio, animações nativas, Lenis, React Hook Form, Zod e Radix Dialog. Fotografias reais locais em WebP, fonte DM Sans local e WhatsApp único **(62) 99985-8449**.

## Rodar e publicar

Node 20.9+ e pnpm: `pnpm install` → `pnpm dev`. Produção: `pnpm build` e `pnpm start`. Validações: `pnpm lint`, `pnpm typecheck`, `pnpm qa` (produção já em execução). Com npm: `npm install` e os mesmos scripts com `npm run`.

Na Vercel, importe o repositório, selecione Next.js e configure `NEXT_PUBLIC_SITE_URL` com o domínio definitivo. Veja `.env.example`. Não há credenciais no código.

## Editar

- Negócio, endereço, horários, telefone, imagens e depoimentos: `src/config/site.ts`.
- Estoque tipado (48 unidades fictícias / 16 modelos / 15 marcas): `src/data/vehicles.ts`. `src/lib/vehicles.ts` é o contrato: troque as duas funções por consultas de CMS/banco preservando `Vehicle`.
- Fotografias: `public/images`, origens em `CREDITOS.md`. Interior e mecânica são referências genéricas identificadas; substitua por fotos da unidade real antes de vender.
- Tokens/responsividade: `src/app/globals.css`. Plano e referências: `docs/PLANO.md`.

Home, estoque com filtros URL/paginação, detalhe, financiamento, avaliação em etapas, contato, sobre, privacidade, termos, 404/erro; favoritos e comparação até 3 carros no navegador. Blog e `/admin` omitidos pelo modo rápido. GSAP dispensado: Animação nativa acompanha a jornada sem pin complexo.

## Formulários e privacidade

`POST /api/leads` valida no servidor, honeypot e limite de 8 solicitações/10 min por hash de IP. **Sem CRM, não armazena nem finge enviar:** prepara a mensagem para o usuário concluir pelo WhatsApp. Fotos opcionais: 3 arquivos JPEG/PNG/WebP de 2 MB cada, com assinatura validada. Sem integração, devem ser anexadas na conversa.

Configure `LEADS_WEBHOOK_URL` HTTPS e, opcionalmente, `LEADS_WEBHOOK_TOKEN`. O servidor encaminha multipart com `lead` (JSON), `photos` (arquivos), autenticação Bearer e espera 2xx. Para produção: armazenamento privado, retenção definida, limite distribuído e revisão de privacidade. Não há pré-aprovação de crédito, pagamento ou reserva automática.

GA4 opcional (`NEXT_PUBLIC_GA_ID`) só inicia após consentimento. Preferências revogáveis no rodapé; mapa externo carrega após interação. Simulador de parcelas fixas sem IOF/tarifas/seguros/CET, sem valor contratual. Nenhum pixel publicitário configurado.

**Fictício:** estoque, preços, km, equipamentos, histórico, depoimentos, narrativa, endereço e horários. Telefone fornecido pelo usuário. E-mail `.example` e CNPJ pendentes. Uso comercial depende de dados reais, fotos por unidade, responsável, domínio, revisão jurídica, CRM e condições financeiras confirmadas. JSON-LD não apresenta endereço fictício nem oferta comercial como reais.

## Skills e validação

Inventário global conferido. Aplicadas: **Refero Design** (guias de tipografia/motion/craft; MCP indisponível por assinatura), **Computer Use**, **Skill Creator** e skill local `skills/ninho-qa/SKILL.md` (Playwright, axe, Lighthouse, SEO, imagens e copy pt-BR). Referências públicas Porsche/Volvo; licenças Unsplash/Pexels conferidas. Sem imagens geradas por IA.

QA e Lighthouse: resultados em `qa/` (ignorado no Git); medições serão registradas após validação. LCP/CLS locais não são CWV de campo; INP requer uso real.
