# ClashQuizOpen – Aufbau der Website

Diese Datei beschreibt den generellen Aufbau der Website von **ClashQuizOpen** im Frontend mit **HTML**, **CSS** und **JavaScript**.

## Grundidee der Website

ClashQuizOpen ist eine browserbasierte Quizanwendung mit einem klaren, modernen und lernorientierten Interface.  
Der Fokus liegt auf:
- einfacher Bedienung
- klarer Struktur
- visueller Konsistenz
- themenbezogenem Lernen über Quizze

Die Anwendung ist bewusst schlank aufgebaut und setzt auf **statisches Frontend + Supabase als Backend**.

---

## Verwendete Technologien

### HTML
HTML dient zur Strukturierung der Seiten:
- Header
- Inhaltsbereiche
- Karten
- Formularelemente
- Buttons
- Quiz-Container

### CSS
CSS wird direkt in den HTML-Dateien verwendet und sorgt für:
- Layout
- Farben
- Karten-Design
- responsive Anpassungen
- konsistente Gestaltung im ClashQuiz-Stil

### JavaScript
JavaScript übernimmt:
- Laden von Daten aus Supabase
- Rendering von Fächern und Themen
- Quizlogik
- Antwortspeicherung
- Navigation
- Statusanzeigen
- Statistikberechnung

---

## Zentrale Seitenstruktur

## 1. `dashboard.html`
Das Dashboard ist der zentrale Einstiegspunkt nach dem Login.

### Aufgaben des Dashboards
- Begrüßung der Nutzerin / des Nutzers
- Anzeige von Profilinformationen
- Anzeige von Quizstatistiken
- Darstellung aller verfügbaren Fächer
- Auswahl eines Themenbereichs
- Start des Quiz

### Aufbau
Das Dashboard besteht aus mehreren Bereichen:

#### Header
- Logo
- Navigation
- Logout-Button

#### Profilbereich
- Begrüßung
- Klassenzugehörigkeit oder Profildaten
- motivierender Zusatztext

#### Statistikbereich
- gespielte Quizze
- richtige Antworten
- Trefferquote

#### Fächerübersicht
- Darstellung als Kartenlayout
- jedes Fach wird in einer eigenen Karte angezeigt
- zugehörige Themenbereiche werden direkt in der Karte angezeigt

---

## 2. `quiz.html`
Die Quizseite ist für die eigentliche Bearbeitung der Fragen zuständig.

### Aufgaben der Quizseite
- Anzeige des gewählten Fachs und Themas
- Darstellung der aktuellen Frage
- Anzeige von vier Antwortmöglichkeiten
- Speichern der gewählten Antwort
- Anzeige von Feedback
- Navigation zwischen Fragen
- Anzeige des Endergebnisses

### Aufbau
Die Quizseite besteht typischerweise aus:

#### Header
- Logo
- Zurück-Button

#### Quiz-Kopfbereich
- Quizmodus
- Fachname
- Themenname
- kompakte Seitenüberschrift

#### Quiz-Karte
- Fragennavigation
- Fortschrittsanzeige
- Fragetext
- Antworten
- Feedbackfeld
- Button für nächste offene Frage oder Ergebnis

---

## JavaScript-Struktur im Projekt

## 1. `js/dashboard.js`
Diese Datei steuert die Logik des Dashboards.

### Aufgaben
- Laden aller Fächer aus Supabase
- Laden aller Topics
- Rendern der Fachkarten
- Verwaltung der Themenauswahl
- Speichern der gewählten IDs in `localStorage`
- Laden und Anzeigen der Statistikdaten

### Besondere UI-Entwicklung
Die Themenauswahl wurde im Projekt von einem klassischen Dropdown zu einer moderneren Chip-/Button-Auswahl weiterentwickelt.  
Dadurch ist die Bedienung direkter und optisch besser an das Dashboard angepasst.

---

## 2. `js/quiz.js`
Diese Datei enthält die komplette Quizlogik.

### Aufgaben
- Lesen der gewählten Fach- und Themen-IDs aus `localStorage`
- Laden passender Fragen aus Supabase
- Erstellen eines Quizversuchs
- Speichern einzelner Antworten
- Aktualisierung des Scores
- Navigation durch Fragen
- Anzeige von Feedback
- Darstellung des Endergebnisses

### Erweiterungen im Projektverlauf
Im Laufe des Projekts wurde die Quizlogik deutlich erweitert:
- direkte Navigation zwischen Fragen
- Überspringen offener Fragen
- visuelle Statusanzeige für richtige und falsche Fragen
- kompakteres Layout für bessere Bedienbarkeit

---

## 3. `js/supabase.js`
Diese Datei stellt die Verbindung zu Supabase her.

### Aufgabe
- Initialisierung des Supabase-Clients
- Bereitstellung der Verbindung für andere JavaScript-Dateien

---

## 4. `js/auth.js`
Diese Datei übernimmt die Authentifizierungslogik.

### Aufgaben
- Überprüfung, ob ein Nutzer eingeloggt ist
- Weiterleitung bei fehlender Authentifizierung
- Logout-Funktion
- ggf. Laden von Nutzerdaten

---

## Gestaltungsprinzipien im Frontend

## 1. Kartenbasiertes Design
Viele Inhalte werden in Karten dargestellt:
- Profil
- Statistik
- Fachübersicht
- Quizbereich

Das sorgt für:
- gute Lesbarkeit
- klare visuelle Trennung
- modernes Erscheinungsbild

## 2. Wiederkehrende Farbwelt
Die Anwendung nutzt eine einheitliche Farbpalette:
- dunkles Blau / Anthrazit für Grundbereiche
- Gold als Akzentfarbe
- helle Grautöne für Hintergründe
- Grün / Rot für richtige bzw. falsche Antworten

## 3. Direkte Benutzerführung
Die Oberfläche ist so aufgebaut, dass Nutzerinnen und Nutzer schnell zum Ziel kommen:
- Fach auswählen
- Thema auswählen
- Quiz starten
- Fragen beantworten
- Ergebnis sehen

## 4. Klare visuelle Rückmeldungen
Beispiele:
- goldene Hervorhebung aktiver Elemente
- grüne Markierung bei richtigen Antworten
- rote Markierung bei falschen Antworten
- sichtbare Fortschritts- und Statusanzeigen

---

## Entwicklung des UI im Projektverlauf

Im Laufe des Projekts wurde die Oberfläche mehrfach verbessert:

### Dashboard
- optisch modernisiert
- Themenauswahl schöner gestaltet
- gleichmäßigere Kartenstruktur
- bessere visuelle Ausrichtung von Inhalten

### Quiz
- kompakteres Layout
- weniger unnötige Texte
- bessere Platznutzung
- Fragennavigation hinzugefügt
- Statussystem für Fragen ergänzt

---

## Zusammenspiel zwischen Frontend und Datenbank

Die Website ist datengetrieben aufgebaut:

### Dashboard
- lädt Fächer und Themen aus Supabase
- zeigt sie dynamisch an

### Quiz
- lädt Fragen passend zum gewählten Topic
- speichert Antworten und Ergebnisse zurück in Supabase

### Statistik
- nutzt die gespeicherten Quizdaten für Kennzahlen im Dashboard

---

## Vorteile des aktuellen Aufbaus

- leicht verständlich
- gut erweiterbar
- klare Trennung zwischen Seiten und Zuständigkeiten
- modernes, einheitliches UI
- einfache Anbindung an Supabase
- geringer technischer Overhead durch Vanilla JavaScript

---

## Mögliche zukünftige Ausbaustufen

- zentrale Auslagerung des CSS in eigene Stylesheets
- komponentenähnliche Wiederverwendung von UI-Bausteinen
- Admin-Oberfläche für Inhalte
- bessere mobile Optimierung
- Filter- und Suchfunktionen im Dashboard
- detailliertere Nutzerstatistiken
- zusätzliche Ergebnis- und Lernanalysen

---

## Fazit

Der Aufbau von ClashQuizOpen folgt einem klaren, modularen und praxisnahen Ansatz.  
HTML strukturiert die Seiten, CSS sorgt für das visuelle Erscheinungsbild und JavaScript verbindet Oberfläche und Datenbanklogik.  
So entsteht eine schlanke, gut erweiterbare Quizplattform mit modernem Dashboard und funktionaler Quizoberfläche.
