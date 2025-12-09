# MONETIZATION GUIDELINES – ECOSSISTEMA CONNECT / DELIVERY CONNECT

## 1. Objetivo

Definir como os produtos do ecossistema Connect (especialmente o Delivery Connect) geram receita de forma:

- Sustentável,
- Transparente para o cliente (estabelecimento),
- Não invasiva para o usuário final (consumidor),
- Alinhada à UX e às regras de negócio já definidas.

Monetização = combinação de:

1. **Planos B2B (mensalidade / recorrência)**  
2. **Mídia & Patrocínios (inventário de anúncios em telas-chave)**  
3. **Funcionalidades premium (IA, automações, relatórios avançados)**

---

## 2. Planos para Estabelecimentos (B2B)

Os planos são pensados para equilibrar:

- O que o estabelecimento recebe de valor,
- O quanto ele paga,
- O espaço de mídia que cede à Connect.

### 2.1. Exemplo de Estrutura de Planos

> Os nomes/valores podem mudar, mas o conceito permanece.

- **Free**
  - Acesso limitado:
    - Sem módulo de Operação avançado.
    - Sem KDS (cozinha).
    - Limite de produtos / pedidos.
  - Exibe publicidade:
    - Banners de patrocinadores na Home do App Cliente.
    - Marca “Powered by Delivery Connect” em destaque.
  - Objetivo:
    - Facilitar entrada de novos estabelecimentos.
    - Gerar inventário de mídia para Connect.

- **Essential**
  - Inclui:
    - Módulo de Operação (painel admin).
    - KDS básico.
    - Cupons, Kanban, KPIs básicos.
  - Publicidade:
    - Reduzida ou apenas para promo da própria casa.
  - Objetivo:
    - Modelo principal para pequenos e médios estabelecimentos.

- **Premium**
  - Inclui:
    - Todo o Essential.
    - KDS avançado.
    - KPIs completos.
    - IA no app cliente (busca inteligente, recomendações).
    - Automação de carrinho abandonado.
    - Relatórios avançados.
  - Publicidade:
    - Sem anúncios de terceiros.
    - Foco total na marca do estabelecimento (“quase white-label”).
  - Objetivo:
    - Estabelecimentos que querem performance máxima e experiência premium.

---

## 3. Mídia & Patrocínios

A Connect pode gerar receita adicional através de:

- Banners e carrosséis em:
  - Tela de login (painel admin).
  - Home do app cliente.
- Conteúdo patrocinado em:
  - Seções “Você Sabia?” / “Dicas do Chef”.
- Cross-selling dentro do ecossistema:
  - Ex: promover turismo/hospedagem em apps de entrega, e vice-versa.

### 3.1. Inventário de Mídia

Exemplos de espaços definíveis:

- Admin:
  - Tela de login: carrossel de patrocinadores.
  - Rodapé do dashboard: “Parceiros Connect”.
- App Cliente:
  - Carrossel na Home com:
    - Promo do estabelecimento.
    - 1–2 slots de patrocinadores (somente em planos que permitem).
  - Seção de dicas com selinho “Patrocinado por ...”.

### 3.2. Regras de UX para anúncios

- Anúncios **nunca** devem:
  - Bloquear o fluxo de pedido.
  - Interromper o checkout com pop-ups.
  - Prejudicar visibilidade do botão de finalizar pedido.

- Anúncios devem ser sempre:
  - Relevantes (alinhados ao contexto: comida, bebidas, turismo local).
  - Visivelmente identificados como patrocinados, se necessário.

---

## 4. Funcionalidades Premium

Alguns recursos são considerados **“monetizáveis”** extra:

- IA no app cliente:
  - Busca inteligente por preferências.
  - Recomendações personalizadas.
  - Assistente de pedido conversacional.

- Automação:
  - Carrinho abandonado:
    - Retargeting interno (banners, lembretes).
    - Automação de mensagens (sempre respeitando LGPD).
  - Lembretes de pedidos recorrentes.

- Relatórios e dashboards avançados:
  - Análise de ticket médio por período.
  - Performance de cupons.
  - Comparação entre produtos.
  - Insights baseados em dados (top horários, combos mais rentáveis, etc.).

Esses recursos são priorizados para planos **Essential/Premium**.

---

## 5. Estratégia de Equilíbrio (Preço x Publicidade)

O modelo de equilíbrio é:

- Estabelecimento **paga menos** (ou zero) →  
  Cede espaço de mídia para Connect e parceiros.

- Estabelecimento **paga mais (Premium)** →  
  Recebe:
  - menos ou nenhuma mídia de terceiros,
  - recursos avançados,
  - foco total na sua marca.

Diretriz:

> Sempre deixar isso claro nos materiais de venda e, se possível, dentro do próprio painel (tela de Planos).

---

## 6. Integração no Produto (Admin + App Cliente)

### 6.1. Admin (Painel)

- Tela de Planos:
  - Explicar quais espaços de mídia são usados em cada plano.
- Módulo de Patrocinadores:
  - Cadastrar patrocinadores, definir peso/frequência, segmentar por org ou global.
- Relatórios:
  - (Futuro) Relatórios de impressões/clicks de banners, para patrocínios.

### 6.2. App Cliente

- Respeitar sempre:
  - Plano atual do estabelecimento.
  - Flags de configuração (ex.: `allow_connect_ads`, `allow_third_party_ads`).
- Áreas de conteúdo (Home, dicas, etc.) devem prever:
  - Blocos de promo da casa,
  - Blocos de patrocinadores, quando habilitado.

---

## 7. Uso de IA e Monetização

- Sempre que IA for incluir recomendações, upsell ou alguma lógica que impacte conversão:
  - Pensar também no papel disso no modelo de negócios:
    - Essa feature é baseline?  
    - Ou entra como diferencial do plano Premium?

Regras:

- Não apresentar “isso é premium” de forma agressiva para o cliente final.
- A diferenciação de plano deve ocorrer no contexto do **proprietário**, no painel admin, não poluindo a UX do consumidor.

---

## 8. Evolução

Este documento deve ser revisado sempre que:

- Um novo formato de plano for criado.
- Novas fontes de receita (ex.: marketplace, delivery multi-estabelecimento) forem adicionadas.
- Estrutura de patrocínios/mídia for expandida.

Commits relacionados:
- `docs: update MONETIZATION_GUIDELINES for Delivery Connect`
