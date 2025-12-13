# Readdy Home Data (Mode: Production)

## Objetivo
## Objetivo
A Edge Function `readdy-home-data` é o agregador oficial da Home. Ela busca dados de branding, categorias, destaques e status da loja em uma única chamada otimizada.

6. Status Atual
O arquivo `supabase/functions/readdy-home-data/index.ts` agora contém a lógica de produção:
- Lê o body do request.
- Busca `orgs` (com validação completa de campos).
- Busca `monetization_slots` para Hero.
- Busca `categories` e `products` (promos).
- Retorna JSON estruturado.
```json
{
  "ok": true,
  "mode": "production",
  "org_id": "...",
  "org": { ... }
}
```

## Como Testar (Manual)

### 1. Deploy da Função (Versão Produção)
Execute no terminal:
```bash
supabase functions deploy readdy-home-data --no-verify-jwt
```

### 2. Iniciar App Cliente
```bash
npm run dev
```

### 3. Verificar
1. Abra `http://localhost:3000/#/foodtruck-hotdog/home` (ou `/foodtruck/home`).
2. Abra o Console (F12).
3. **Esperado:**
   - Chamada `POST readdy-home-data` deve retornar **200 OK**.
   - O erro "FunctionsHttpError" deve sumir.
   - O console deve mostrar logs do `homeApi.ts` recebendo dados do stub.
4. **Logs da Função:**
   - Verifique no Dashboard do Supabase (Section Edge Functions -> Logs) se aparecem:
     - `STUB readdy-home-data request body: ...`
     - `STUB receiving org_id: ...`

## Próximos Passos (Parte 2)
Após confirmar que o Stub funciona (eliminando o erro 500 de infraestrutura/deploy/body), iremos restaurar a lógica real conectando ao banco com a chave correta.
