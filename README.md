# Diese Datei bezieht sich vor allem auf die Datenstruktur, welche in Supabase aufgebaut wurde.

# ClashQuizOpen

Öffentliche Version von **ClashQuiz** – einer webbasierten Quizanwendung mit **HTML**, **CSS**, **JavaScript** und **Supabase**.

## Projektüberblick

Im Verlauf des Projekts wurde ClashQuiz Schritt für Schritt von einer einfachen Quizoberfläche zu einer strukturierten Lernplattform mit Themenbereichen, Fortschrittsanzeige und Supabase-gestützter Datenspeicherung ausgebaut.

## Bisher umgesetzte Kernfunktionen

### 1. Datenstruktur mit Supabase aufgebaut
- Verwendung von **Supabase / PostgreSQL** als Backend.
- Aufbau und Nutzung der Tabellen für:
  - `subjects`
  - `topics`
  - `questions`
  - `quiz_attempts`
  - `quiz_answers`
- Nutzung von UUID-basierten Beziehungen zwischen Fach, Themenbereich und Fragen.

### 2. Fragenimport im SQL-Format etabliert
- Fragen wurden im Projekt zunächst als **SQL-Insert-Statements** gepflegt.
- Einheitliches Importformat für `public.questions` definiert.
- Themenbezogene Fragenpakete wurden vorbereitet und in Supabase importiert.
- Subjekt- und Topic-Zuordnung erfolgt über `subject_id` und `topic_id`.

### 3. Themenbereiche strukturiert erweitert
- Für bestehende Fächer wurden neue **Topics / Themenbereiche** angelegt.
- Beispielhafte Themenstruktur:
  - **VPR** mit Themen wie:
    - Router
    - Firewall
    - DNS-Filter
    - Repeater
    - Access Point
  - **TDM** mit Themen wie:
    - SQL
    - Python
    - Pseudocode
- SQL-Befehle wurden so aufgebaut, dass doppelte Themenbereiche vermieden werden.

### 4. Quizlogik mit Supabase-Anbindung umgesetzt
- Laden von Fragen anhand des gewählten **Fachs** und **Themenbereichs**.
- Erzeugung eines Quizversuchs über `quiz_attempts`.
- Speichern einzelner Antworten über `quiz_answers`.
- Abschluss eines Quizversuchs mit:
  - `score`
  - `total_questions`
  - `completed_at`

### 5. Dashboard mit Fach- und Themenauswahl aufgebaut
- Gestaltung einer modernen Dashboard-Seite im ClashQuiz-Design.
- Anzeige aller verfügbaren Fächer aus der Datenbank.
- Ursprünglich Themenauswahl per Dropdown.
- Später Umstellung auf eine **visuelle Themenauswahl mit Topic-Chips**, passend zum Dashboard-Design.
- Start eines Quiz über Speicherung der Auswahl in `localStorage` und Weiterleitung zur Quizseite.

### 6. Dashboard optisch und strukturell verbessert
- Kartenbasiertes Layout für die Fächerübersicht.
- Vereinheitlichung der Position des Bereichs **„Themenbereich“** auf allen Fachkarten.
- Bessere visuelle Konsistenz bei unterschiedlich langen Fachbeschreibungen.
- Modernisiertes UI im Stil des restlichen Dashboards.

### 7. Quizseite funktional erweitert
- Erstellung einer kompakten Quizansicht mit:
  - Frage
  - vier Antwortmöglichkeiten
  - Feedbackbereich
  - Navigationsbutton
- Verknüpfung mit Supabase zur dynamischen Anzeige der Fragen je Topic.

### 8. Fragennavigation innerhalb des Quiz integriert
- Einführung einer direkten Navigation zwischen Fragen.
- Darstellung von nummerierten Fragefeldern:
  - Frage 1
  - Frage 2
  - usw.
- Möglichkeit, Fragen zu **überspringen** und später zurückzukehren.
- Aktive Frage wird optisch hervorgehoben.

### 9. Visuelles Statussystem für beantwortete Fragen
- Nummernfelder zeigen den Bearbeitungsstatus direkt an.
- Richtig beantwortete Fragen werden markiert mit:
  - **grüner Umrandung / grünem Hintergrund**
  - **goldenem Haken**
- Falsch beantwortete Fragen werden markiert mit:
  - **roter Umrandung / rotem Hintergrund**
  - **goldenem X**
- Die Farbgebung wurde an die vorhandenen Antwortfelder angepasst.

### 10. Quizlayout für bessere Usability optimiert
- Quizseite kompakter gestaltet, damit wichtige Elemente schneller sichtbar sind.
- Reduzierung unnötiger Texte und Abstände.
- Kombination von **Fach** und **Thema** im Header.
- Ziel: weniger Scrollen und klarerer Fokus auf den Lerninhalt.

### 11. Antwortverteilung in importierten Fragen korrigiert
- Nach dem Import wurde festgestellt, dass bei einer größeren Fragenmenge immer **Antwort A** korrekt war.
- Dafür wurde ein SQL-Update-Konzept genutzt, um:
  - die korrekte Antwortposition zu variieren
  - `correct_answer` entsprechend neu zu setzen
- Diese Korrektur wurde gezielt auf bestimmte Themenbereiche angewendet.

### 12. Statistiken im Dashboard eingebunden
- Anzeige von Kennzahlen für Nutzerinnen und Nutzer:
  - gespielte Quizze
  - richtige Antworten
  - Trefferquote
- Daten werden aus `quiz_attempts` und `quiz_answers` geladen.

## Technischer Aufbau

### Frontend
- **HTML** für Seitenstruktur
- **CSS** direkt in den HTML-Dateien für individuelles Styling
- **Vanilla JavaScript** für Logik, UI-Interaktionen und Datenverarbeitung

### Backend / Datenbank
- **Supabase** als Backend-as-a-Service
- **PostgreSQL** für Datenhaltung
- Authentifizierung über Supabase Auth

### Wichtige Dateien
- `dashboard.html` – Übersicht über Fächer, Themen und Nutzerstatistiken
- `quiz.html` – Quizoberfläche
- `js/dashboard.js` – Datenlogik für Fächer, Themen und Statistiken
- `js/quiz.js` – Quizlogik, Navigation, Antwortspeicherung und Ergebnisdarstellung
- `js/supabase.js` – Supabase-Konfiguration
- `js/auth.js` – Authentifizierungslogik

## Inhaltliche Entwicklung im Projekt

Im Laufe des Projekts wurden nicht nur Funktionen implementiert, sondern auch die inhaltliche Struktur des Lernsystems ausgebaut:
- Anlegen neuer Fächer und Themenbereiche
- Import größerer Fragenmengen
- Definition eines einheitlichen SQL-Formats für Fragen
- Vorbereitung von Prompts zur automatisierten Fragenerstellung
- Nachbearbeitung importierter Fragen zur Qualitätsverbesserung

## Aktueller Stand

ClashQuizOpen verfügt aktuell über:
- eine funktionierende Dashboard-Seite
- mehrere Fächer mit zugehörigen Themenbereichen
- eine Supabase-gestützte Quizlogik
- Antwortspeicherung und Ergebnisermittlung
- visuelle Fragennavigation im Quiz
- Statistikanzeige im Dashboard
- eine erweiterbare Datenstruktur für weitere Fragen und Themen

## Nächste sinnvolle Ausbaustufen

Mögliche nächste Schritte im Projekt:
- Persistente Speicherung von Zwischenständen im Quiz
- Möglichkeit zum Fortsetzen unvollständig bearbeiteter Quizze
- Admin- oder Importbereich für neue Fragen
- Bessere Migrations- und Deployment-Struktur für Supabase
- Erweiterte Auswertungen pro Fach und Themenbereich
- Responsiveness und UX-Feinschliff auf mobilen Geräten

## Hinweis

Diese README fasst die wesentlichen funktionalen, strukturellen und gestalterischen Schritte des bisherigen Projektverlaufs zusammen und dient als Überblick über den aktuellen Entwicklungsstand von ClashQuizOpen.
