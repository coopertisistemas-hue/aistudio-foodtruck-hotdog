<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18lklFxgLuU2_gX_tp-Qc5KX-kFq3RRgY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## White-Label Configuration

This project supports multiple brands. To configure the active brand, set the `VITE_BRAND_ID` environment variable in `.env` or `.env.local`.

Configuration files are located in `src/config/brands/`. You can add new brands by creating a new config file and exporting it in `src/config/brands/index.ts`.

Available brands:
- `foodtruck` (Default) - FoodTruck HotDog
- `docesdaserra` - Doces da Serra

Example `.env.local`:
```
VITE_BRAND_ID=docesdaserra
```

## Estrutura do Projeto (Refatorado)

O projeto agora segue uma estrutura organizada em `/src`:

- `src/App.tsx`: Componente principal e orquestração de rotas.
- `src/components/`: Componentes de UI reutilizáveis.
- `src/context/`: Gerenciamento de estado (ex: CartContext).
- `src/data/`: Dados mockados.
- `src/screens/`: Telas da aplicação.
- `src/types.ts`: Definições de tipos.
- `src/index.tsx`: Ponto de entrada.
