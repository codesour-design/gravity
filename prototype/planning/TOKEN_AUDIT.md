# Token Audit — Planning (esito)

Audit dell'uso dei token Gravity in `index.html`, **completato e applicato** (giugno 2026).
Fonte di verità: `prototype/_shared/tokens.js` (GRAVITY_THEME + GRAVITY_CSS_VARS).
L'inventario completo dei problemi pre-correzione è nella history git di questo file.

---

## Token aggiunti a `tokens.js` durante l'audit

| Token | Valore | Uso |
|---|---|---|
| `--gravity-primary-bg` | `#F0EAFF` | sfondo stati selected/active con tinta primary (unifica 3 varianti pre-esistenti) |
| `--gravity-bg-subtle` | `#FAFAFA` | sfondo hover neutro / aree espanse (unifica 3 grigi quasi identici) |
| `--gravity-primary-border` | `#C5B4FF` | bordi primary chiariti (unifica `#E4DCFF`/`#C5B4FF`/`#D3ADF7`) |
| `--gravity-radius-xl` | `10px` | card floating, map controls, overlay |
| `--gravity-fs-micro` | `10px` | label uppercase, codici impianto |
| `--gravity-fs-caption` | `11px` | metadati, label impianti, footer |
| `--gravity-fs-body-sm` | `13px` | testo di riga standard (la size più usata nel prototipo) |
| `--gravity-fs-body-lg` | `15px` | valore DataCard in sidebar |
| `--gravity-domain-lt` / `-lt-bg` | `#7C3AED` / `#EDE9FE` | badge Long Term |
| `--gravity-domain-lt-incomp` / `-lt-incomp-bg` | `#B45309` / `#FEF3C7` | badge LT incompatibile |
| `--gravity-domain-discount` | `#059669` | prezzo scontato |
| `--gravity-domain-overbudget` | `#DC2626` | superamento budget |
| `--gravity-domain-partial` | `#FA8C16` | selezione parziale facce |

> I colori `--gravity-domain-*` sono semantici del dominio OOH (non palette AntD):
> se devono apparire in Figma servono variabili dedicate nel DS.

## Correzioni applicate nel prototipo

- Sfondi bianchi → `var(--gravity-bg-container)` (26 punti); restano `#fff` solo dove corretto
  (color/fg avatar, stroke/fill SVG, knob su primary, Google Maps styler).
- `border-radius` 4/6/8/10px → CSS vars corrispondenti (30 occorrenze).
- `gap`/`padding` sulla scala 4/8/12/16/24/32 → `--gravity-space-*` (~35 occorrenze).
- Font: `var(--gravity-font-body)` anche nelle occorrenze hardcoded; monospace uniformato a
  `var(--gravity-font-code)` (era SF Mono/Fira Code).
- Hover `.ss-bar-cerca`: `#3300d0` → `var(--gravity-primary-hover)`.

## Volutamente NON tokenizzato

- Valori fuori scala **2, 3, 5, 6, 7, 9, 10, 14, 20px** in elementi grafici custom — non
  mappabili ai token senza distorcerli.
- Compound padding con almeno un valore fuori scala (es. `padding: 6px 12px`) — lasciati interi:
  tokenizzare metà compound peggiora la leggibilità.
- Ombre custom dei pannelli laterali/focus card (`-2px 0 20px…`, ombra colorata primary):
  candidate a un futuro `--gravity-shadow-lateral` se il pattern si ripete in altri moduli.
