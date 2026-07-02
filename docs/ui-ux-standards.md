# Standard UI/UX trasversali — Gravity Platform

> Regole che valgono su più componenti/moduli e non hanno un posto naturale in un singolo file di
> `components/`. Per lo standard di un componente specifico (form, navbar, filtri, mappa…) vale
> prima il suo file dedicato — qui c'è solo ciò che è davvero cross-modulo.

---

## Spaziatura

Tutta la spaziatura viene dai token di `prototipi/tokens.js` (`margin*`/`padding*`), mai da
valori inventati:

| Token | Valore | Uso tipico |
|-------|--------|------------|
| `marginXXS` / `paddingXXS` | 4px | gap minimi (icona-testo) |
| `marginXS` / `paddingXS` | 8px | gap piccoli tra elementi correlati |
| `marginSM` / `paddingSM` | 12px | padding sezioni compatte (es. filter-drawer) |
| `margin` / `padding` | 16px | padding standard di contenuto |
| `marginMD` / `paddingMD` | 20px | **gap verticale tra `Form.Item`** — vedi `components/form-patterns.md` §1 |
| `marginLG` / `paddingLG` | 24px | padding pagina/card, gap tra sezioni |
| `marginXL`+ | 32px+ | separazioni ampie tra blocchi |

- `controlHeight` (32px) è l'altezza standard dei controlli form (`size` default `middle`);
  `controlHeightLG` (40px) solo se **tutto** il form è `large` — mai un controllo isolato più
  alto degli altri (`components/form-patterns.md` §6).
- `borderRadius` (6px) per controlli, `borderRadiusLG` (8px) per card/box/Alert — non introdurre
  un terzo valore intermedio senza motivo.

## Stati interattivi (hover / focus / disabled / dimmed)

- **Attivo/selezionato**: sempre il primary `#3E00FB` (o la sua bg chiara `#F0EAFF`) — mai un
  colore diverso per "selezionato" da un modulo all'altro.
- **Hover su chip/filtro**: bordo che scurisce (`#b0b0b0`) + testo pieno, senza cambiare sfondo
  (riferimento: `.filter-chip:hover` in `prototipi/filter-drawer.js`).
- **Disabilitato con motivo**: se il perché non è ovvio dal contesto, il motivo va in un
  **tooltip in hover** — mai un'etichetta statica accanto al controllo, mai lasciare l'utente a
  indovinare. Pattern: `components/form-patterns.md` §4 (opzioni Select) e
  `components/filter-drawer.md` (sezioni disabilitate).
- **Dimmed**: quando un elemento ha il focus (es. marker mappa), gli altri passano a
  `opacity: 0.2` invece di sparire — si mantiene il contesto spaziale
  (`components/map-interactions.md`).

## Colore come informazione di stato

Il colore non è mai l'unico canale di uno stato: sempre accompagnato da testo, numero o icona.
Palette di stato in uso — riusarle, non inventarne di nuove per lo stesso significato:

| Stato | Colore | Dove |
|-------|--------|------|
| Disponibile / Available | `#52C41A` | Planning — stato spazi |
| In Opzione / In Option | `#EB2F96` | Planning — stato spazi |
| Riservato / Reserved | `#1677FF` | Planning — stato spazi |
| Attivo | `#1677FF` (blue-6) | Inventory — stato amministrativo |
| In Manutenzione | `#FA8C16` (orange-6) | Inventory — stato amministrativo |
| Inizializzato | `#FAAD14` (gold-6) | Inventory — stato amministrativo |
| Rimosso | `rgba(0,0,0,0.45)` | Inventory — stato amministrativo |
| Canale OOH / DOOH | `#52C41A` / `#EB2F96` | chip e filtri (in tabella anche outline `#3E00FB` / `#FF4A1C`, vedi LAYOUT.md §7) |

## Accessibilità e contrasto

- **Testo su superfici colorate**: contrasto ≥ 3:1 per testo bold (limite accettato), ≥ 4.5:1
  (AA) dove possibile. La scala dei cluster mappa è già tarata e verificata WCAG
  (`docs/CLUSTER_LOGIC.md` §2): non usare tinte più chiare di
  `#A47CFF`, diventano illeggibili anche contro la mappa chiara.
- Le palette sono tarate su **superficie chiara** (`#F5F5F5`/`#fff`): se si introduce una
  superficie scura, i contrasti vanno rivalutati, non riusati alla cieca.

## Icone

- Libreria unica: **Ant Design Icons** (`window.icons`). Dove il dato di dominio ha casing
  incoerente tra prototipi (es. "Palo Luce"/"Palo luce"), lookup **case-insensitive** — pattern:
  `TYPE_ICON_NAMES` in `prototipi/filter-drawer.js`.
- Gli **asset custom** delle tipologie impianto (`window.GravityMap.systypeIconSrc`) sono
  riservati ai marker sulla mappa; altrove (chip, filtri, liste) si usa l'icona Ant Design
  equivalente con fallback.
- **Icone a significato riservato — non riusarle per altro:**
  - `BulbOutlined` / `BulbFilled` = faccia impianto illuminata/retroilluminata (dominio);
  - `CoffeeOutlined` **rossa** (`#FF4A1C`) = nota di design negli handoff, marker inline
    contestuale con popover "Nota di design" (`components/handoff-engine.md`).

## Tipografia — riferimento rapido

Regole complete in CLAUDE.md (SF Pro Text via Ant Design, mai Oswald/Inter in UI). Taglie
osservate nelle schermate esistenti, da riusare:

| Elemento | Size / Weight | Token |
|---------|----------------|-------|
| Titolo pagina | 30px / 600 | `Heading/2` |
| Titolo sezione | 20px / 600 | `fontSizeXL` |
| Header / cella tabella | 14px / 500 · 400 | `Base/Normal` |
| Valore KPI | 24px / 600 | `Heading/3` |
| Label form, breadcrumb, metadata | 14px / 400 | `Base/Normal` |

(dettaglio completo: `LAYOUT.md` §7–§8)
