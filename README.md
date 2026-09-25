# lernplaner-miniapp

## Ziel der Anwendung

Dieses kleine lokale Web-Programm dient der persönlichen Lernplanung. Der Benutzer kann einzelne Lernaufgaben anlegen und in einer einfachen Liste übersichtlich verwalten.

## Funktionen

Die erste Version der Anwendung umfasst nur die grundlegenden Funktionen für die tägliche Lernorganisation:

- Aufgabe hinzufügen
- Aufgabenliste anzeigen
- Status ändern
- Aufgabe löschen

Für jede Aufgabe werden folgende Felder verwendet:

- Titel
- Fach oder Thema
- Fälligkeitsdatum
- Priorität
- Status

### Priorität

- hoch
- normal
- niedrig

### Status

- offen
- erledigt

## Technischer Stack

Für die erste Version wird nur folgender Stack verwendet:

- HTML
- CSS
- JavaScript
- kein Backend

## Lokale Ausführung

1. Projektordner öffnen.
2. Die Datei index.html im Browser öffnen.
3. Alternativ kann ein einfacher lokaler Webserver gestartet werden:

```bash
python -m http.server 8000
```

Danach im Browser auf folgende Adresse gehen:

```text
http://localhost:8000
```

## Hinweis

Das Projekt ist als kleine Lernplaner-Miniapp für das persönliche Lernen konzipiert. Ziel ist eine einfache, verständliche Umsetzung ohne zusätzliche Funktionen oder Backend-Struktur.
