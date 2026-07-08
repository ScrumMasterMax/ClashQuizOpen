# ClashQuizOpen – Datenbankstruktur

Diese Datei beschreibt den grundlegenden Aufbau der Datenbank von **ClashQuizOpen** auf Basis von **Supabase / PostgreSQL**.

## Ziel der Datenbank

Die Datenbank bildet die inhaltliche und funktionale Grundlage der Quizanwendung.  
Sie verwaltet:
- Fächer
- Themenbereiche
- Fragen
- Quizversuche
- einzelne Antworten der Nutzerinnen und Nutzer

Die Struktur wurde so angelegt, dass neue Fächer, Topics und Fragen flexibel ergänzt werden können.

---

## Verwendete Haupttabellen

### 1. `subjects`
Diese Tabelle enthält die übergeordneten **Fächer**.

#### Zweck
- Speichert alle Lernbereiche / Fächer
- Dient als oberste organisatorische Ebene

#### Typische Inhalte
- `id`
- `name`
- `description`

#### Beispiele
- VPR
- TDM
- weitere Schulfächer oder Themenblöcke

---

### 2. `topics`
Diese Tabelle enthält die **Themenbereiche** innerhalb eines Fachs.

#### Zweck
- Unterteilt ein Fach in konkrete Teilbereiche
- Verknüpft Themen logisch mit einem bestimmten Fach

#### Typische Inhalte
- `id`
- `subject_id`
- `name`
- `description`

#### Beziehung
- Ein `topic` gehört immer genau zu einem `subject`
- Ein `subject` kann mehrere `topics` besitzen

#### Beispiele
**Für VPR**
- Router
- Firewall
- DNS-Filter
- Repeater
- Access Point

**Für TDM**
- SQL
- Python
- Pseudocode

---

### 3. `questions`
Diese Tabelle enthält die eigentlichen **Quizfragen**.

#### Zweck
- Speichert alle Fragen inklusive Antwortmöglichkeiten
- Ordnet jede Frage einem Fach und einem Themenbereich zu

#### Typische Inhalte
- `id`
- `subject_id`
- `topic_id`
- `question_text`
- `answer_a`
- `answer_b`
- `answer_c`
- `answer_d`
- `correct_answer`
- `explanation`
- `is_active`

#### Bedeutung wichtiger Felder
- `question_text`: eigentliche Fragestellung
- `answer_a` bis `answer_d`: vier Antwortmöglichkeiten
- `correct_answer`: speichert den richtigen Buchstaben (`a`, `b`, `c`, `d`)
- `explanation`: kurze Erklärung zur richtigen Lösung
- `is_active`: steuert, ob die Frage im Quiz verwendet wird

#### Beziehung
- Eine Frage gehört zu genau einem `subject`
- Eine Frage gehört zu genau einem `topic`

---

### 4. `quiz_attempts`
Diese Tabelle speichert jeden gestarteten bzw. abgeschlossenen **Quizversuch**.

#### Zweck
- Dokumentiert, wann ein Nutzer ein Quiz bearbeitet hat
- Speichert das Endergebnis eines Durchlaufs

#### Typische Inhalte
- `id`
- `user_id`
- `subject_id`
- `topic_id`
- `score`
- `total_questions`
- `completed_at`

#### Bedeutung
- `score`: Anzahl richtig beantworteter Fragen
- `total_questions`: Gesamtanzahl der Fragen im Versuch
- `completed_at`: Zeitpunkt des Abschlusses

#### Beziehung
- Ein Quizversuch gehört zu einem Nutzer
- Ein Quizversuch bezieht sich auf ein Fach und meist auf ein Topic

---

### 5. `quiz_answers`
Diese Tabelle enthält die einzelnen **Antworten eines Nutzers** innerhalb eines Quizversuchs.

#### Zweck
- Speichert jede beantwortete Frage einzeln
- Ermöglicht spätere Auswertungen und Statistiken

#### Typische Inhalte
- `id`
- `attempt_id`
- `question_id`
- `user_id`
- `selected_answer`
- `is_correct`

#### Bedeutung
- `selected_answer`: gewählte Antwort (`a`, `b`, `c`, `d`)
- `is_correct`: Kennzeichnung, ob die Antwort richtig war

#### Beziehung
- Eine Antwort gehört zu genau einem `quiz_attempt`
- Eine Antwort gehört zu genau einer `question`

---

## Beziehungen zwischen den Tabellen

Die Datenbank folgt einer hierarchischen Struktur:

- Ein **Subject** besitzt mehrere **Topics**
- Ein **Topic** besitzt mehrere **Questions**
- Ein **User** kann mehrere **Quiz Attempts** haben
- Ein **Quiz Attempt** enthält mehrere **Quiz Answers**

### Vereinfacht dargestellt

```text
subjects
  └── topics
        └── questions

users
  └── quiz_attempts
        └── quiz_answers
```

---

## Inhaltlicher Ablauf in der Anwendung

### Auswahl im Dashboard
1. Nutzer wählt ein **Fach**
2. Nutzer wählt einen **Themenbereich**
3. Die IDs werden gespeichert und an die Quizseite übergeben

### Quizstart
1. Ein neuer Datensatz in `quiz_attempts` wird erstellt
2. Die passenden Fragen aus `questions` werden geladen
3. Die Auswahl erfolgt über `subject_id` und `topic_id`

### Quizverlauf
1. Nutzer beantwortet eine Frage
2. Die Antwort wird in `quiz_answers` gespeichert
3. Das Frontend verwaltet zusätzlich den aktuellen Bearbeitungsstatus

### Quizabschluss
1. `score` und `total_questions` werden berechnet
2. Der Quizversuch wird in `quiz_attempts` aktualisiert
3. Die Daten stehen für spätere Statistiken zur Verfügung

---

## Besondere Projektentscheidungen

### 1. UUID-basierte IDs
Die Tabellen arbeiten mit UUIDs, um:
- eindeutige Schlüssel zu garantieren
- Beziehungen sauber und sicher herzustellen
- Erweiterungen einfacher zu machen

### 2. Trennung von Fach und Topic
Fragen sind nicht nur einem Fach, sondern zusätzlich einem Themenbereich zugeordnet.  
Dadurch können Quizze gezielt pro Unterthema gestartet werden.

### 3. Direkte SQL-Importe
Fragen wurden im Projekt per SQL in Supabase importiert.  
Dadurch konnte die Datenpflege schnell und kontrolliert erfolgen.

### 4. Nachträgliche Qualitätsanpassung
Bei importierten Fragen wurde die Verteilung der richtigen Antworten nachträglich per SQL verbessert, damit nicht immer dieselbe Antwortposition korrekt ist.

---

## Vorteile der aktuellen Struktur

- leicht erweiterbar
- klare Trennung zwischen Inhalten und Nutzeraktivität
- geeignet für mehrere Fächer und viele Themenbereiche
- gute Grundlage für Statistiken und Auswertungen
- sauber mit Supabase nutzbar

---

## Mögliche zukünftige Erweiterungen

- Tabellen für Klassen, Kurse oder Gruppen
- Rollenmodell für Lehrkräfte / Admins / Lernende
- Import- und Verwaltungsbereiche für Fragen
- Zwischenstände für pausierte Quizze
- detailliertere Lernanalysen
- Bewertung pro Fach oder Themenbereich

---

## Fazit

Die Datenbankstruktur von ClashQuizOpen ist modular aufgebaut und unterstützt sowohl die inhaltliche Organisation der Fragen als auch die Speicherung echter Nutzungsdaten.  
Sie bildet damit die stabile Grundlage für die aktuelle Quizfunktion sowie für künftige Erweiterungen.
