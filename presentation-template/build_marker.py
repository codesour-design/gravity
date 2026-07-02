#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deck 'Sistema Marker' — stessa impaginazione della sorgente (12 slide),
con lo stile del Gravity_Template."""
from gravity_deck import GravityDeck

d = GravityDeck()

# 1 — Cover (con i 4 numeri, come nella sorgente)
d.cover("Sistema Marker",
        "Libreria delle icone mappa per spazi pubblicitari OOH & DOOH.",
        kicker="Gravity · Design System",
        stats=[("19", "Tipologie"), ("7", "Status"),
               ("2", "Categorie"), ("133", "Marker")])

# 2 — Overview: cos'è il sistema marker
d.stats("Cos'è il sistema marker",
        [("19", "tipologie", "Tipi di impianto, da Cartello a Billboard, ciascuno con un'icona dedicata."),
         ("7", "status", "Stati operativi distinti per colore, dal verde Available al grigio Removed."),
         ("2", "categorie", "OOH (affissione classica) e DOOH (digitale), con strutture separate."),
         ("133", "marker", "Combinazioni totali esportate e organizzate in cartelle per tipo.")],
        kicker="Overview",
        intro=("I marker sono le icone che rappresentano gli spazi pubblicitari sulla mappa "
               "Gravity. Ogni marker codifica tre informazioni: la tipologia (forma), lo status "
               "operativo (colore) e la categoria OOH o DOOH (struttura)."),
        footnote="Anatomia di un marker — Pin + icona tipo + colore status")

# 3 — Status system: i 7 status operativi
d.swatch_groups("I 7 status operativi", [
    {"label": "Amministrativi · Inventario impianti", "items": [
        {"color": "#4096FF", "name": "Attivo", "code": "active · #4096FF",
         "desc": "Impianto operativo e in esercizio."},
        {"color": "#FFC53D", "name": "Inizializzato", "code": "initialized · #FFC53D",
         "desc": "Creato, in fase di allestimento."},
        {"color": "#FFA940", "name": "In Manutenzione", "code": "maintenance · #FFA940",
         "desc": "Temporaneamente non operativo."},
        {"color": "#D9D9D9", "name": "Rimosso", "code": "removed · #D9D9D9",
         "desc": "Dismesso, non più in esercizio."},
    ]},
    {"label": "Commerciali · Pianificazione", "items": [
        {"color": "#52C41A", "name": "Disponibile", "code": "available · #52C41A",
         "desc": "Spazio libero, prenotabile."},
        {"color": "#F759AB", "name": "In Opzione", "code": "inOption · #F759AB",
         "desc": "Opzionato temporaneamente da un cliente."},
        {"color": "#9254DE", "name": "Riservato", "code": "reserved · #9254DE",
         "desc": "Prenotato e confermato per una campagna."},
    ]},
], kicker="Status system",
   intro="Lo status è definito dal colore del marker e si divide in due famiglie, "
         "secondo la funzionalità che usa la mappa.")

# 4 — Tipologie OOH (15)
d.taglist("Tipologie OOH", [
    {"label": "Out of Home · 15 tipi", "items": [
        "Cartello", "Cassonetto", "Fermata bus", "Fioriera", "Insegna", "Palina",
        "Palina Butterfly", "Palo Luce", "Parapedonale", "Pensilina", "Plancia",
        "Rotor", "Speciale", "Stendardo", "Telo"]},
], kicker="Out of Home")

# 5 — Tipologie DOOH (4)
d.taglist("Tipologie DOOH", [
    {"label": "Digital Out of Home · 4 tipi", "items": [
        "Alux", "Billboard", "Totem", "Speciale"]},
], kicker="Digital Out of Home")

# 6 — Le due mappe a confronto (tabella)
d.table("Le due mappe a confronto",
        ["", "Inventario Impianti", "Pianificazione"], [
            ["Funzionalità", "Il parco impianti esistente", "Costruire una campagna"],
            ["Livello dato", "Stato amministrativo dell'impianto",
             "Stato commerciale dello spazio"],
            ["Stati", "Attivo · In Manutenzione · Rimosso · Inizializzato",
             "Disponibile · In Opzione · Riservato"],
            ["Hover sul marker", "Solo ingrandimento ×1.12 — nessuna card",
             "Solo ingrandimento ×1.12 — nessuna card"],
            ["Click sul marker", "×1.4, gli altri si attenuano, apre la card",
             "×1.4, gli altri si attenuano, apre la card"],
            ["Azione nella card", "Vai al dettaglio dell'impianto",
             "Aggiungi / Rimuovi dalla pianificazione"],
            ["Selezione multipla", "Non prevista", "Checkbox + badge ✓ viola sul marker"],
            ["Cluster", "Bolla colorata + alone",
             "Anche anello viola + label «selez./totale» (no MVP)"],
        ], kicker="Inventory vs Planning",
        col_widths=[2.5, 4.55, 4.55],
        intro="Lo stesso motore di mappa serve due funzionalità diverse. Il livello "
              "di interazione è condiviso; cambia il livello dato e lo scopo.")

# 7 — Mappa Inventory
d.content("Mappa — Inventory",
          body="Scopo. Vedere e gestire il parco impianti esistente.",
          bullets=[
              "Vista d'insieme — cluster per densità.",
              "Click sul marker → card con «Vai al dettaglio».",
              "Stato amministrativo: Attivo · In Manutenzione · Rimosso · Inizializzato.",
              "Nessuna selezione multipla.",
          ],
          kicker="Inventario impianti")

# 8 — Mappa Planning
d.content("Mappa — Planning",
          body="Scopo. Selezionare gli spazi disponibili per costruire una campagna.",
          bullets=[
              "Vista d'insieme — cluster + impianti selezionati.",
              "Click sul marker → card con «Aggiungi alla pianificazione».",
              "Stato commerciale: Disponibile · In Opzione · Riservato.",
              "Selezione multipla con lista impianti.",
          ],
          kicker="Pianificazione")

# 9 — Come funzionano i cluster
d.cards("Come funzionano i cluster", [
    {"badge": "1", "title": "Alone", "text": "Stessa tinta della bolla, opacità 40%."},
    {"badge": "2", "title": "Bolla", "text": "Colore in base alla cardinalità del cluster."},
    {"badge": "3", "title": "Numero", "text": "Conteggio degli impianti — sempre visibile."},
], kicker="Cluster",
   intro="Quando più impianti sono vicini vengono aggregati in un cluster: un'unica "
         "bolla, con alone e numero del conteggio.",
   footnote="Il numero è sempre visibile, anche in MVP. Post-MVP (solo Planning): "
            "anello viola + label «selezionati / totale» sul cluster.")

# 10 — Scaglioni di colore
d.swatch_grid("Scaglioni di colore", [
    {"color": "#A47CFF", "name": "Scaglione 1", "sub": "≤ 2 impianti", "code": "#A47CFF · 32px", "d": 0.55},
    {"color": "#976AFF", "name": "Scaglione 2", "sub": "3 – 5 impianti", "code": "#976AFF · 32px", "d": 0.55},
    {"color": "#8A52FF", "name": "Scaglione 3", "sub": "6 – 10 impianti", "code": "#8A52FF · 36px", "d": 0.65},
    {"color": "#7838FB", "name": "Scaglione 4", "sub": "11 – 20 impianti", "code": "#7838FB · 36px", "d": 0.65},
    {"color": "#3E00FB", "name": "Scaglione 5", "sub": "21 – 50 impianti", "code": "#3E00FB · 40px", "d": 0.75},
    {"color": "#2900A0", "name": "Scaglione 6", "sub": "> 50 impianti", "code": "#2900A0 · 40px", "d": 0.75},
], kicker="Cluster", cols=3,
   intro="La scala è derivata dal primary Gravity #3E00FB: dal viola medio (pochi "
         "impianti) all'indaco profondo (cluster grandi). Sei scaglioni con passi "
         "di luminosità uniformi.")

# 11 — Da cluster a marker
d.cards("Da cluster a marker", [
    {"badge": "1", "title": "Decluster a zoom > 15",
     "text": "Oltre questa soglia i cluster si sciolgono e si mostrano tutti i marker individuali."},
    {"badge": "2", "title": "Click = zoom-to-bounds",
     "text": "La mappa si adatta esattamente sugli impianti contenuti, non uno zoom fisso."},
    {"badge": "3", "title": "Baricentro",
     "text": "Il cluster è posizionato sulla media delle coordinate degli impianti."},
], kicker="Zoom & aggregazione",
   intro="Logica di aggregazione.",
   footnote="Dimensione marker per zoom — il marker base scala con lo zoom; gli stati "
            "di interazione applicano un moltiplicatore su questa dimensione.")

# 12 — Comportamento del marker
d.two_column("Comportamento del marker",
             left_title="Stati base",
             left=[
                 "Default — icona base, scala con lo zoom.",
                 "Hover — solo ingrandimento ×1.12, nessuna card.",
                 "Focused (click) — ×1.4 + ombra viola, apre la card e attenua gli altri.",
             ],
             right_title="Selezione & contesto",
             right=[
                 "Selected — checkbox attivo, badge ✓ viola (solo Planning).",
                 "Dimmed — opacità 0.2 quando un altro marker è in focus.",
             ],
             kicker="Interazione")

d.save("Sistema_Marker_Gravity.pptx")
print("OK Sistema_Marker_Gravity.pptx")
