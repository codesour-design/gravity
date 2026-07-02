#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Costruisce il template di esempio Gravity_Template.pptx con tutti i layout."""
from gravity_deck import GravityDeck

d = GravityDeck()

# 1 — Cover (dark)
d.cover(
    "Titolo del documento",
    "Sottotitolo o claim su una o due righe, in Inter.",
    meta="CodeSour · Gravity · Giugno 2026",
    kicker="Tipo di documento",
)

# 2 — Indice (light)
d.index([
    "Contesto e obiettivi",
    "Approccio e metodo",
    "Soluzione proposta",
    "Valore e prossimi passi",
])

# 3 — Divisore di sezione (dark)
d.section(1, "Contesto e obiettivi",
          "Il punto di partenza e cosa vogliamo ottenere.")

# 4 — Contenuto: titolo + testo + bullet (light)
d.content(
    "Il problema da risolvere",
    body=("Una breve introduzione che inquadra il tema in due o tre righe, "
          "scritta in Inter con colore secondario per non competere con il titolo."),
    bullets=[
        "Primo punto chiave, conciso e azionabile.",
        "Secondo punto che aggiunge una sfumatura importante.",
        "Terzo punto a chiusura del ragionamento.",
    ],
    kicker="Contesto",
)

# 5 — Due colonne (light)
d.two_column(
    "Due binari complementari",
    left_title="Sul prototipo",
    left=[
        "Traccia il flusso con un tour guidato.",
        "Inspector dei componenti.",
        "Matrici di dipendenza tra entità.",
    ],
    right_title="Su Jira",
    right=[
        "Lavoro misurabile in ticket.",
        "Stimabile e tracciabile nel backlog.",
        "Requisiti e criteri di accettazione.",
    ],
    kicker="Approccio",
)

# 6 — Card (light)
d.cards(
    "Tre pilastri del metodo",
    [
        {"badge": "1", "title": "Coerenza",
         "text": "Regole, stati e logiche formalizzati in un solo posto, ancorati all'elemento."},
        {"badge": "2", "title": "Tracciabilità",
         "text": "Ogni User Story porta l'identificativo del ticket: prototipo e Jira allineati."},
        {"badge": "3", "title": "Velocità",
         "text": "Meno cicli di chiarimento, meno assunzioni errate, meno rilavorazione."},
    ],
    kicker="Soluzione",
)

# 7 — Statistiche / numeri (light)
d.stats(
    "L'impatto in sintesi",
    [
        ("−40%", "cicli di chiarimento stimati in meno tra design e sviluppo"),
        ("1", "fonte di verità per regole, stati e casi limite"),
        ("100%", "User Story collegate al ticket Jira corrispondente"),
    ],
    kicker="Valore",
)

# 8 — Chiusura (dark)
d.closing("buon lavoro", "Gravity · CodeSour")

d.save("Gravity_Template.pptx")
print("OK Gravity_Template.pptx")
