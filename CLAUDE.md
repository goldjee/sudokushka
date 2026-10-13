# Судокушка

Grandmother-friendly sudoku pet project: iPad, finger input, large handwritten font (Neucha), paper look.

- Next.js (App Router) static export (`output: "export"`, `basePath: "/sudokushka"`) deployed to GitHub Pages.
- Use bun: `bun run dev`, `bun test`, `bun run build`, `bun run lint`, `bun run format` (Biome: single quotes, 4 spaces).
- `src/lib/`: pure logic, unit-tested with `bun test`. `sudoku.ts` generator/solver/conflicts, `game.ts` game rules (moves, undo, hints, records), `storage.ts` localStorage, `i18n.ts` RU/EN strings, `site.ts` base path.
- `src/components/`: `Game.tsx` owns state and persistence; `Board`, `Controls`, `Header`, `Dialogs` are presentational.
- `public/theme.js` applies the saved theme before first paint.
- UI text must exist in both languages. Keep touch targets large.
