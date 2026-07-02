# Tema PowerPoint — Gravity

Template aziendale riutilizzabile per documenti Gravity / CodeSour, in linea con
il brand: cover e divisori su sfondo dark, contenuti su sfondo light, titoli in
**Oswald** e testo in **Inter** (font **incorporati** nel file), colori
`#3E00FB` (primary) e `#FF4A1C` (secondary).

## File nella cartella

| File | A cosa serve |
|------|--------------|
| `Gravity_Template.pptx` | Il template pronto: 8 slide d'esempio, una per ogni layout. Aprilo, duplica le slide che ti servono e sostituisci i testi. I font Oswald/Inter sono già dentro al file. |
| `gravity_deck.py` | Il "motore": genera le slide in automatico da codice o da un file JSON. |
| `build_template.py` | Lo script che ha creato `Gravity_Template.pptx` (esempio di uso del motore). |
| `example_spec.json` | Esempio di documento descritto in JSON, da dare in pasto al motore. |
| `assets/` | Logo Gravity in PNG (versione bianca per dark, viola per light). |
| `fonts/` | Oswald e Inter in TTF (Regular + Bold) usati per l'incorporazione. |

## Layout disponibili

1. **cover** — copertina dark con titolo, sottotitolo, kicker e meta
2. **index** — indice numerato (passa a due colonne oltre 4 voci)
3. **section** — divisore di sezione dark con numero gigante
4. **content** — titolo + testo introduttivo + elenco puntato
5. **two_column** — due colonne con titoletto e bullet/testo
6. **cards** — 2–4 card con badge numerato
7. **stats** — numeri grandi con etichetta
8. **closing** — chiusura dark ("buon lavoro", "Grazie", ecc.)

## Uso A — a mano in PowerPoint

Apri `Gravity_Template.pptx`, duplica la slide del layout che vuoi e cambia i
testi. Non serve installare i font: sono dentro al file.

## Uso B — generazione automatica da JSON

Descrivi il documento in un file JSON (vedi `example_spec.json`) e lancia:

```bash
python3 gravity_deck.py example_spec.json mio_documento.pptx
```

I tipi di slide e i campi accettati sono documentati in cima a `gravity_deck.py`
(funzione `build_from_spec`).

## Uso C — generazione da codice Python

```python
from gravity_deck import GravityDeck

d = GravityDeck()
d.cover("Proposta commerciale", "Per Cliente X", meta="CodeSour · 2026",
        kicker="Offerta")
d.section(1, "Il contesto")
d.content("Obiettivo", body="...", bullets=["...", "..."], kicker="Sintesi")
d.cards("Vantaggi", [
    {"badge": "1", "title": "Velocità", "text": "..."},
    {"badge": "2", "title": "Qualità",  "text": "..."},
])
d.closing("Grazie")
d.save("proposta.pptx")     # i font vengono incorporati in automatico
```

## Note tecniche

- Formato 16:9 (33,87 × 19,05 cm).
- L'incorporazione font usa il meccanismo OOXML standard
  (`embedTrueTypeFonts`), riconosciuto da PowerPoint su Windows e Mac.
- Oswald viene incorporato con il peso SemiBold come "Regular" (resa più solida
  nei titoli) e Bold come variante grassetto.
- I PNG del logo sono rigenerabili dai sorgenti SVG in `brand/` con `cairosvg`.

## Dipendenze per la generazione automatica

```bash
pip install python-pptx
```

(Per rigenerare i PNG del logo serve anche `cairosvg`; per ri-incorporare i font
basta python-pptx, i TTF sono già nella cartella `fonts/`.)
