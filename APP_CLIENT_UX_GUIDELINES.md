# APP CLIENT UX GUIDELINES – DELIVERY CONNECT (MOBILE ONLY)

## 1. Visão Geral

O App Web Cliente Delivery Connect é o canal principal para o consumidor final:

- Fazer pedidos de lanches, bebidas, combos, etc.
- Acompanhar seus pedidos.
- Avaliar atendimento, entrega e qualidade dos lanches.

Ele deve ser:

- **Bonito** (atraente, moderno, com imagens/vídeo de lanches).
- **Extremamente simples de usar** (poucos cliques até finalizar pedido).
- **Focado em conversão** (cliente clicou → pediu → ficou satisfeito).
- Integra-se ao backend e regras de negócio já usadas pelo painel admin (mesmo Supabase + Edge Functions).
- **Este app é exclusivo para uso em celular (mobile only).**

## 2. Mobile Only – Princípios de Layout

App desenhado para smartphones, não como site desktop tradicional.

- **Viewport alvo**: largura em torno de 360–430px.
- **Base de navegação**:
  - Bottom Navigation fixa com 3–5 abas principais, por exemplo:
    - 🏠 Início
    - 🍔 Cardápio
    - 📦 Meus Pedidos
    - ⭐ Avaliações

O layout pode ser exibido em desktop apenas como:
- Versão mobile centralizada, OU
- Tela simples informativa com QR Code: “Este app foi pensado para uso no celular. Aponte a câmera para o QR Code.”

**Diretrizes específicas de mobile:**
- Tamanho mínimo de toques (~40–48px de altura) para uso confortável com o polegar.
- Nada de hover: todas as interações são clique/toque.
- Formular os fluxos pensando em uso com uma mão.
- Sempre priorizar legibilidade sobre “encheção visual”.

## 3. Arquitetura de Navegação (Cliente)

Fluxo principal:
1. Início (Home)
2. Cardápio (categorias + produtos)
3. Carrinho
4. Checkout
5. Acompanhamento de Pedido

Outros pontos de acesso:
- “Meus Pedidos” (histórico filtrado pelo cliente).
- “Avaliar Pedido” (avaliar pedidos entregues).
- “Falar com a loja” (WhatsApp).

## 4. Layout da Home

A Home é a “vitrine” do app cliente. Inspiração visual: urubici.com.br, porém 100% mobile.

### 4.1. Hero (Topo)
- **Fundo**: vídeo de fundo (leve) ou imagem hero com lanches.
- **Overlay com**:
  - Logo do estabelecimento.
  - Headline forte (ex.: “Seu lanche artesanal, do jeito certo”).
  - Subheadline curta (ex.: “Entrega rápida em Urubici – peça online agora”).
  - CTA principal grande: Ver Cardápio.
  - CTA secundário: Meus Pedidos.

### 4.2. Grid de Atalhos (Acesso Rápido)
Logo abaixo do hero, um grid 2xN com botões grandes, cada um com ícone + texto:
- 🍔 Lanches
- 🌭 Cachorros-quentes
- 🥤 Bebidas
- ⭐ Combos & Promoções
- 📦 Meus Pedidos
- 💬 Avaliar meu último pedido
- 💬 Falar com a loja (WhatsApp)

Botões clicáveis, com área de toque generosa.

### 4.3. Destaques
Seções abaixo dos atalhos:
- Mais pedidos (best sellers).
- Sugestões pra você (baseado em histórico, no futuro).
- Novidades do cardápio (novos itens).

### 4.4. Prova Social (Avaliações)
Uma seção com:
- Nota média geral (estrelas).
- 2–4 depoimentos curtos de clientes.
- Link: Ver todas as avaliações.

## 5. Cardápio & Detalhe do Produto

### 5.1. Cardápio
- Lista de categorias:
  - Lanches, Cachorros-quentes, Bebidas, Sobremesas, Combos etc.
- Ao entrar em uma categoria:
  - Lista de produtos com:
    - Foto,
    - Nome,
    - Descrição curta,
    - Preço.

Exibir skeletons enquanto carrega os produtos.

### 5.2. Detalhe do Produto
Mostrar:
- Imagem em destaque.
- Nome e descrição.
- Preço.

Seção “Personalize seu lanche”:
- “Chips rápidos” (botões de toque único), como:
  - “Sem cebola”
  - “Sem tomate”
  - “Caprichar no molho”
  - “Pão bem tostado”
  - “Carne bem passada”
- Campo de texto opcional para observações livres:
  - Placeholder: “Algum cuidado especial? Ex.: sem maionese, molho à parte…”

Botões:
- Seleção rápida de quantidade (+ / -).
- Botão grande: Adicionar ao carrinho.

### 5.3. Observações no fluxo
No carrinho, exibir observações do item em texto menor:
- Obs: sem cebola, caprichar no molho.

Essas observações devem aparecer também:
- Na criação do pedido.
- No painel da cozinha (KDS).

## 6. Carrinho e Checkout

### 6.1. Carrinho
Lista de itens:
- Nome, quantidade, preço unitário, subtotal, observações.

Ações:
- Ajustar quantidade.
- Remover item.

Mostrar:
- Subtotal dos itens.
- Taxa de entrega (vinda do backend/regra da org).
- Total geral.

Opções:
- Continuar adicionando (volta ao cardápio).
- Ir para Checkout (botão destacado).

### 6.2. Checkout
Campos mínimos (como regra base):
- Nome do cliente.
- WhatsApp (fundamental para contato).
- Endereço (se entrega for por bairro/rua).
- Observações gerais do pedido (opcional).

Se o app usar cupons:
- Campo Cupom de Desconto:
  - Botão Aplicar.
  - Feedback claro:
    - Cupom válido (mostrar valor / percentual).
    - Cupom inválido/expirado (mensagem clara).

Botão grande: Finalizar Pedido.

### 6.3. Feedback de Erro/Sucesso
Após tentativa de fechar pedido:

Se sucesso:
- Mostrar tela de confirmação com:
  - Número/identificador do pedido.
  - Estimativa de tempo.
  - Botão para Acompanhar Pedido.

Se erro:
- Mensagem clara:
  - “Não foi possível criar seu pedido. Tente novamente ou fale com a loja pelo WhatsApp.”

## 7. Acompanhamento de Pedido

Tela simples exibindo o status do pedido:
- Exemplo de etapas:
  - Recebido → Em preparo → Saiu para entrega → Entregue.
- Visual:
  - Timeline ou passos com ícones.
  - Atualizar estado a partir de dados do backend (não inventar no front).

Botões:
- Ver detalhes do pedido.
- Avaliar pedido (quando estiver como “Entregue”).

## 8. Avaliações (Rating)

### 8.1. Momento de Pedir Avaliação
Quando um pedido passar para “Entregue”:
- Na próxima vez que o cliente abrir app ou Meus Pedidos, mostrar:
  - Card chamativo: “Como foi sua experiência com o último pedido?”
  - Botão: Avaliar este pedido.

- Na Home:
  - Botão específico: 💬 Avaliar meu último pedido.

### 8.2. Estrutura da Avaliação
- Nota geral (1 a 5 estrelas).
- Notas opcionais:
  - Atendimento.
  - Entrega.
  - Lanche.
- Campo de comentário opcional:
  - “Quer contar algo pra gente?”

### 8.3. Uso das Avaliações
- Salvar em tabela `order_ratings` (ou similar).
- Mostrar:
  - Média global e alguns depoimentos na Home.
  - Expor dados mais detalhados no painel admin (não no cliente).

## 9. Dicas de Lanches & “Você Sabia?”

Na Home:
- Carrossel ou lista de cards curtos:
  - “Você sabia?” / “Dicas do Chef”

Objetivos:
- Entreter o cliente.
- Aumentar conversão em combos/margens melhores.

Exemplos:
- “Você sabia? X% dos clientes pedem bacon extra no Hot Dog da Casa.”
- “Dica: o Combo da Casa é o pedido mais escolhido pelas famílias.”

Deve estar sempre ligado a produtos reais do cardápio.

## 10. Integração com WhatsApp

Muitas pessoas preferem pedir pelo WhatsApp.
O app não deve lutar contra isso, e sim integrar.

### 10.1. Botão Flutuante
Botão flutuante “💬 Falar com a loja” em todas (ou quase todas) telas.

Comportamento:
- **Sem carrinho montado**:
  - Abre WhatsApp com mensagem padrão:
    - “Olá, quero fazer um pedido. Meu nome é ______.”
- **Com carrinho montado**:
  - Opção “Pedir pelo WhatsApp” no resumo do carrinho:
    - App prepara mensagem com:
      - Itens, quantidades, observações, total aproximado.
    - Abre WhatsApp com essa mensagem pronta.

### 10.2. Meus Pedidos + WhatsApp
Na tela de Meus Pedidos:
- Ação “Repetir no WhatsApp”:
  - Monta mensagem com base em um pedido antigo.

## 11. IA no App Cliente (Fases Futuras)

### 11.1. Busca Inteligente
Campo de busca:
- Usuário digita frases como:
  - “sem carne”
  - “quero algo picante”
  - “lanche leve”
- IA interpreta:
  - ingredientes,
  - preferências do cliente (histórico),
  - tags de produtos.
- Resultado: lista de lanches ordenados por afinidade.

### 11.2. Recomendações Personalizadas
Se o cliente estiver identificado/logado:
- Seção “Recomendado pra você” baseada em:
  - Histórico de pedidos.
  - Itens bem avaliados por esse cliente.
  - Itens similares aos pedidos recentes.

### 11.3. Assistente de Pedido (Futuro)
Pequeno fluxo conversacional:
- “Quero um lanche sem carne e sem maionese.”
- IA sugere 1–3 opções do cardápio.
- Cada sugestão com botão Adicionar ao carrinho.

## 12. Carrinho Abandonado

### 12.1. Identificação
No início do checkout, coletar:
- Nome,
- WhatsApp (essencial).

### 12.2. Definição de Abandono
- Carrinho com itens + checkout iniciado,
- mas sem pedido criado dentro de X minutos (ex.: 15–30 min).

### 12.3. Ações
- Na próxima visita do mesmo cliente:
  - Banner: “Você deixou um pedido pela metade. Quer continuar de onde parou?”
- No painel admin:
  - Possibilidade futura de:
    - Ver relatórios de carrinhos abandonados.
    - Criar campanhas específicas (manuais ou automatizadas).

## 13. Performance & Mídia

- **Vídeo de fundo**:
  - Tamanho otimizado.
  - Formato adequado (mp4/webm) com compressão.
  - Fallback (imagem estática) para conexões lentas.
- **Imagens de produtos**:
  - Otimizadas para mobile.
  - Usar CDN quando possível.
  - Evitar scripts pesados desnecessários.

## 14. Acessibilidade & Microcopy

- Texto curto, direto e amigável.
- Labels claros em botões, ex.:
  - Ver Cardápio
  - Adicionar ao carrinho
  - Finalizar Pedido
  - Avaliar Pedido
- Sempre indicar claramente o que aconteceu:
  - “Pedido criado com sucesso.”
  - “Cupom inválido ou expirado.”
  - “Loja fechada no momento. Veja o horário de funcionamento.”

## 15. Integração com QUALITY_GUIDELINES.md

Todas as telas, fluxos e decisões de UX descritos aqui devem respeitar:
- Padrões de código, arquitetura e segurança definidos em `QUALITY_GUIDELINES.md`.
- Regras de negócio já implementadas no backend/painel admin (Strict Mode, cupons, orgs, etc.).
- Multi-tenant (org atual) em todas as operações.

## 16. Evolução deste documento

Este guia é vivo.
Sempre que um novo padrão de UX ou feature (IA, WhatsApp, fidelidade, etc.) for consolidado, atualizar este arquivo com:
- Nova seção, ou
- Ajuste de seções existentes.

Commits relacionados:
- docs: update APP_CLIENT_UX_GUIDELINES for Delivery Connect
