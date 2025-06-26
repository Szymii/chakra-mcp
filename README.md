# Chakra UI MCP Server

Model Context Protocol server dla dokumentacji Chakra UI.

## Instalacja

```bash
pnpm install
```

## Budowanie

```bash
pnpm run build
```

## Aktualizacja dokumentacji

```bash
pnpm run update
```

## Uruchomienie servera

### Opcja 1: Zbudowany server (produkcja)

#### Krok 1: Zbuduj projekt

```bash
pnpm run build
```

#### Krok 2: Uruchom MCP Inspector

W pierwszym terminalu:

```bash
npx @modelcontextprotocol/inspector
```

**W MCP Inspector użyj:**

- Command: `node`
- Arguments: `build/server.js`

## Struktura projektu

- `src/server.ts` - główny plik MCP servera
- `src/update.ts` - skrypt do pobierania dokumentacji Chakra UI
- `src/tmp/` - katalog z pobraną dokumentacją

## Dostępne skrypty

- `pnpm run build` - kompiluje TypeScript do JavaScript
- `pnpm run build:watch` - kompiluje z obserwowaniem zmian
- `pnpm start` - uruchamia zbudowany server
- `pnpm run dev` - uruchamia server w trybie rozwoju (TypeScript)
- `pnpm run update` - aktualizuje dokumentację Chakra UI
