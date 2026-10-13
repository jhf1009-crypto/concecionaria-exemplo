# Ninho Veículos — demonstração

Construir uma experiência para escolher um seminovo e iniciar uma conversa pelo WhatsApp, com calma, clareza e fotos reais. Execução direta autorizada pelo briefing, sem rodada de aprovação visual.

Referências: Porsche (hero fotográfico amplo, hierarquia forte), Volvo (fichas claras, navegação objetiva); guias Refero de tipografia, motion e craft. Pesquisa MCP tentada, indisponível por assinatura. Preservar fotografia protagonista, composição assimétrica, títulos sans grandes e sem palavras decorativas. Amarelo para ações e blocos de destaque, grafite para tipografia e painéis. Direção atualizada por solicitação do usuário. Fundo branco quente, bordas finas, raio 12px nos cards e botões de 6px. Evitar sombras excessivas, urgência falsa e números de clientes inventados.

Mapa: Home → Estoque → Veículo; Financiamento; Venda seu carro; Sobre; Contato; Privacidade; Termos; favoritos/comparação. Blog e admin ficam fora nesta entrega rápida.

Componentes: header inteligente, menu móvel, busca, card, filtros URL, favoritos/comparador, galeria com dialog, simulador, formulário validado, FAQ, consentimento, rodapé, WhatsApp. Dados em configuração e repositório tipado substituível.

Motion: entrada de hero, revelação por scroll, progresso da jornada, hover de imagens e feedback; CSS + requestAnimationFrame + Lenis, com redução de movimento. Motion/GSAP dispensados após medição: efeitos nativos e Lenis diferido reduzem JavaScript; hero com parallax, entrada em linhas e versão estática para movimento reduzido.

QA: build/lint/TypeScript; navegador em 1440 e 390px; fluxos principais, filtros, favoritos, comparação, formulários, axe e uma coleta Lighthouse desktop/mobile. Corrigir problemas encontrados em uma rodada. Métricas locais não representam CWV de campo.
