# PWA Fix Checklist

## O que foi corrigido
1. **Manifest Inválido**: O arquivo `public/manifest.webmanifest` estava ausente ou corrompido (retornando HTML/404), causando "Syntax Error". Foi recriado com JSON válido e ícones corretos.
2. **Meta Tag Depreciada**: Adicionada a tag `<meta name="mobile-web-app-capable" content="yes">` no `index.html` para silenciar o warning do Chrome.

## Como Validar

1. **Recarregar a página com Cache Limpo**
   - Tecla `Ctrl + Shift + R` (ou limpar cache no DevTools).

2. **Verificar Console (F12)**
   - O erro `Manifest: Line: 1, column: 1, Syntax error` deve sumir.
   - O warning sobre `apple-mobile-web-app-capable` deve sumir (ou diminuir a severidade, já que a nova tag está presente).

3. **Verificar Aba "Application" no DevTools**
   - Vá em F12 -> Application -> Manifest.
   - Verifique se ele carrega as informações:
     - Name: "FoodTruck HotDog"
     - Start URL: "/"
     - Icons: Mostra os ícones (192 e 512).
   - "Installability": Deve mostrar status ok (ou avisos menores, mas sem erro crítico de parse).

4. **Teste Visual**
   - O app deve continuar carregando normalmente.
