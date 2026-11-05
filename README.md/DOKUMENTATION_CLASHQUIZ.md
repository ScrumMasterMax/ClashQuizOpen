# ClashQuizOpen – Projektdokumentation

**Version:** 1.0  
**Stand:** 5. November 2026  
**Projekt:** ClashQuizOpen / ClashQuiz  
**Dokumenttyp:** Technische und fachliche Projektdokumentation

> Diese Dokumentation beschreibt den im Repository vorhandenen Stand. Sie ist in zehn Seitenabschnitte gegliedert. Die tatsächliche Seitenzahl beim Ausdruck hängt von Schriftgröße, Seitenrändern und Markdown-Renderer ab.

## Inhaltsverzeichnis

1. Projektüberblick
2. Ausgangslage und Ziele
3. Zielgruppe und Anwendungsszenarien
4. Systemarchitektur und Technologien
5. Seiten und Benutzerführung
6. Datenmodell und Datenfluss
7. Quizablauf und Auswertung
8. Gestaltung, Bedienbarkeit und Barrierefreiheit
9. Einrichtung, Sicherheit und Qualitätssicherung
10. Grenzen, Weiterentwicklung und Fazit

<!-- Seitenumbruch -->

## Seite 1 – Projektüberblick

ClashQuizOpen ist eine browserbasierte Lern- und Quizanwendung. Lernende können ein Konto verwenden, ein Fach und einen Themenbereich auswählen, Fragen beantworten und anschließend ihr Ergebnis ansehen. Das Dashboard stellt außerdem gespeicherte Kennzahlen wie absolvierte Quizversuche, richtige Antworten und Trefferquote dar.

Das Projekt verbindet ein schlankes Frontend aus HTML, CSS und JavaScript mit Supabase als Backend. Die Oberfläche wird im Browser ausgeführt; Inhalte und Nutzungsdaten werden über den Supabase-Client geladen beziehungsweise gespeichert. Das Repository enthält die zentralen Seiten `index.html`, `register.html`, `login.html`, `dashboard.html` und `quiz.html` sowie JavaScript-Dateien im Ordner `js/`.

Die Anwendung verfolgt ein einfaches Lernprinzip: Inhalte werden in Fächer und Themen gegliedert; Fragen gehören zu einem Thema und bieten vier Antwortoptionen. Nach jeder Auswahl erhält die Person direkt Rückmeldung einschließlich einer hinterlegten Erklärung, sofern eine vorhanden ist. Eine abschließende Ergebnisansicht zeigt die Anzahl richtiger Antworten und den prozentualen Wert.

Die Dokumentation beschreibt sowohl den fachlichen Ablauf als auch die technische Umsetzung. Aussagen zur Datenbank beziehen sich auf die im Projekt dokumentierte Struktur; konkrete Einstellungen wie Row-Level-Security-Regeln müssen in der Supabase-Instanz geprüft werden, da sie nicht vollständig im Frontend-Repository enthalten sind.

<!-- Seitenumbruch -->

## Seite 2 – Ausgangslage und Ziele

### Ausgangslage

Lerninhalte werden häufig über getrennte Arbeitsblätter, Lernplattformen oder informelle Abfragen wiederholt. ClashQuiz fasst eine Auswahl von Lernfragen in einer webbasierten Oberfläche zusammen. Die Gliederung nach Fach und Thema soll das gezielte Üben kleiner Wissensgebiete erleichtern. Nutzerkonten ermöglichen, Quizantworten und Ergebnisse einem Profil zuzuordnen.

### Projektziele

- Eine verständliche Oberfläche für Registrierung, Anmeldung und Quiznutzung bereitstellen.
- Fächer und Themen dynamisch aus der Datenbank laden, statt sie fest in Seiten einzutragen.
- Fragen mit vier Antwortmöglichkeiten und optionalen Erklärungen darstellen.
- Antworten und abgeschlossene Versuche für spätere Statistiken speichern.
- Eine responsive Darstellung für große und kleinere Bildschirme unterstützen.
- Die Inhalte so strukturieren, dass weitere Fächer, Themen und Fragen ergänzt werden können.

### Umfang und Abgrenzung

Zum aktuellen Projektumfang gehören Kontoverwaltung über Supabase Auth, Dashboard, Themenauswahl, Quizbearbeitung, Rückmeldung und einfache persönliche Statistik. Im Repository ist keine redaktionelle Verwaltungsoberfläche für Lehrkräfte oder Administratoren erkennbar. Fragen und Stammdaten werden laut Datenbankdokumentation direkt in Supabase gepflegt beziehungsweise importiert.

Das System ist kein vollständiges Lernmanagementsystem: Es bietet im dokumentierten Stand weder Kursverwaltung und Aufgabenabgabe noch Chat, Zertifikate oder einen ausgebauten Lehrkräftebereich. Diese Abgrenzung hält den Kern der Anwendung überschaubar und macht den Quizprozess zum zentralen Anwendungsfall.

<!-- Seitenumbruch -->

## Seite 3 – Zielgruppe und Anwendungsszenarien

### Zielgruppe

Die Benutzeroberfläche richtet sich an Lernende, die selbstständig Inhalte wiederholen möchten. Das Registrierungsformular sieht Vorname, Nachname, Klassenbezeichnung, E-Mail-Adresse und Passwort vor. Die gespeicherten Profildaten können auf dem Dashboard zur persönlichen Begrüßung und Anzeige der Klasse verwendet werden. Die Struktur erlaubt grundsätzlich unterschiedliche Fächer und Themen, ohne eine einzelne Fachrichtung vorauszusetzen.

### Typischer Ablauf

1. Eine neue Person öffnet die Startseite und wechselt zur Registrierung.
2. Sie legt ein Konto an. Die Authentifizierung wird über Supabase abgewickelt; im Erfolgsfall führt die Anwendung zur Anmeldeseite und übernimmt dort die E-Mail-Adresse als vorausgefüllten Wert.
3. Nach erfolgreicher Anmeldung wird das Dashboard geöffnet.
4. Die Person wählt innerhalb einer Fachkarte einen Themenbereich und startet das Quiz.
5. Sie beantwortet Fragen in beliebiger Reihenfolge. Bereits beantwortete Fragen sind über die Fragennavigation wieder aufrufbar; ihre Antwort kann nicht erneut geändert werden.
6. Sobald alle Fragen beantwortet sind, wird die Ergebnisansicht freigeschaltet.
7. Das Quiz kann neu gestartet oder das Dashboard aufgerufen werden.

### Weitere Szenarien

Ein wiederkehrender Nutzer kann seine bisherigen aggregierten Kennzahlen ansehen und ein anderes Thema üben. Wenn keine Fächer, Themen oder Fragen vorhanden sind, zeigt die Oberfläche entsprechende Statusmeldungen. Fehlt bei der Quizseite eine zuvor gespeicherte Auswahl, erscheint ein Hinweis statt eines regulären Quizstarts. Diese Rückmeldungen helfen, leere oder unvollständige Datenbestände von einem normalen Bearbeitungsablauf zu unterscheiden.

<!-- Seitenumbruch -->

## Seite 4 – Systemarchitektur und Technologien

### Frontend

Die HTML-Dateien definieren Struktur und Formulare. CSS ist überwiegend direkt in die jeweilige HTML-Seite eingebettet und gestaltet Layout, Farben, Karten und Breakpoints. JavaScript ohne zusätzliches UI-Framework übernimmt die Interaktion. Der Ansatz reduziert die Anzahl zusätzlicher Abhängigkeiten, verteilt Gestaltung und Seitenlogik jedoch auf mehrere Dateien.

### Backend und Hosting

Supabase stellt Authentifizierung und PostgreSQL-Datenzugriff bereit. Die Datei `js/supabase.js` initialisiert den JavaScript-Client mit Projekt-URL und einem öffentlichen Anon-Key. Der Client wird über das Supabase-JavaScript-CDN eingebunden. Der Anon-Key ist kein Ersatz für Datenbankzugriffsregeln: Zugriffe müssen serverseitig durch geeignete Policies beschränkt sein.

Das Repository enthält statische HTML-, CSS- und JavaScript-Dateien. Sie können daher von einem statischen Webhost ausgeliefert werden, sofern die Supabase-Konfiguration und die erlaubten Auth-URLs passend gesetzt sind. Ein bestimmter Hosting-Anbieter oder automatisierter Deployment-Prozess ist aus den betrachteten Dateien nicht abzuleiten.

### Zuständigkeiten der JavaScript-Dateien

- `js/supabase.js`: Supabase-Client initialisieren.
- `js/auth.js`: Registrierung, Anmeldung, Logout, Dashboard-Schutz und Profildaten.
- `js/dashboard.js`: Fächer/Themen laden, Karten rendern und Statistiken berechnen.
- `js/quiz.js`: Fragen laden, Quizversuch und Antworten speichern, Navigation und Ergebnisansicht.

### Architekturbild

**Browserseiten → JavaScript-Logik → Supabase Auth / PostgreSQL**.  
Die Datenbank ist die gemeinsame Quelle für Inhalte und Nutzeraktivitäten; die Seiten selbst enthalten hauptsächlich Darstellung und Bedienlogik.

<!-- Seitenumbruch -->

## Seite 5 – Seiten und Benutzerführung

### Startseite (`index.html`)

Die Startseite ist der öffentliche Einstieg und verlinkt auf die relevanten Bereiche der Anwendung. Sie stellt das Produkt vor und bietet den Übergang zur Anmeldung beziehungsweise Registrierung.

### Registrierung (`register.html`)

Das Formular fordert die im Interface vorgesehenen Profildaten sowie E-Mail und Passwort an. `auth.js` übergibt E-Mail, Passwort und die Profilangaben als Metadaten an `supabaseClient.auth.signUp`. Erfolg und Fehler werden als Text auf der Seite angezeigt. Anschließend wird die Login-Seite mit vorausgefüllter E-Mail geöffnet.

### Anmeldung (`login.html`)

Die Anmeldung erfolgt mit E-Mail-Adresse und Passwort über `signInWithPassword`. Bei erfolgreicher Anmeldung wechselt der Browser zum Dashboard. Authentifizierungsfehler werden für Nutzer sichtbar ausgegeben.

### Dashboard (`dashboard.html`)

Das Dashboard kombiniert Profilbegrüßung, drei Statistikkarten und eine dynamische Fachübersicht. `dashboard.js` lädt Fächer und Themen aus den Tabellen `subjects` und `topics`. Themen werden als auswählbare Schaltflächen dargestellt. Die Auswahl wird pro Fach im Arbeitsspeicher der Seite gehalten; beim Start speichert die Anwendung Fach- und Themen-IDs sowie Namen in `localStorage` und wechselt zu `quiz.html`. Der Logout-Button beendet die Sitzung und führt zurück zur Startseite.

### Quizseite (`quiz.html`)

Die Quizseite liest die Auswahl aus `localStorage`, lädt passende aktive Fragen und rendert Fragennavigation, Fortschritt, Antwortoptionen, Feedback und Ergebnis. Die Schaltflächen ermöglichen den Wechsel zu einzelnen Fragen und zur nächsten offenen Frage. Auf schmalen Bildschirmen werden Bereiche und Bedienelemente untereinander angeordnet.

<!-- Seitenumbruch -->

## Seite 6 – Datenmodell und Datenfluss

Die vorhandene Datenbankdokumentation beschreibt fünf zentrale fachliche Tabellen. Die Authentifizierungsnutzer kommen zusätzlich aus Supabase Auth; Profile werden über die Tabelle `profiles` gelesen.

| Tabelle | Aufgabe und wesentliche Felder |
|---|---|
| `subjects` | Fächer mit `id`, `name` und `description` |
| `topics` | Themen eines Fachs; unter anderem `id`, `subject_id`, `name`, `description` |
| `questions` | Frage, vier Antworten, `correct_answer`, Erklärung und Aktiv-Status |
| `quiz_attempts` | Ein Quizdurchlauf mit `user_id`, Fach/Thema, Score, Gesamtzahl und Abschlusszeit |
| `quiz_answers` | Einzelne Antwort mit Versuch, Frage, Nutzer, Auswahl und Korrektheitsstatus |

### Beziehungen

Ein Fach kann mehrere Themen enthalten; ein Thema kann mehrere Fragen enthalten. Ein Nutzer kann mehrere Quizversuche starten. Jeder Versuch kann mehrere gespeicherte Antworten umfassen. IDs und Fremdschlüssel verbinden diese Datensätze. Die genaue Constraint- und Policy-Konfiguration ist im Repository nicht vollständig spezifiziert.

### Datenfluss

Beim Dashboard-Aufruf werden Profil, Fächer, Themen und Nutzungsdaten geladen. Beim Quizstart wird zunächst ein Datensatz in `quiz_attempts` angelegt. Anschließend werden Fragen anhand von Fach, Thema und `is_active = true` abgefragt und nach `created_at` sortiert. Für jede Antwort wird ein Datensatz in `quiz_answers` geschrieben. Beim Abschluss aktualisiert das Frontend den Versuch um Score, Gesamtzahl und Zeitstempel.

Die Tabelle `profiles` wird über die Auth-User-ID abgefragt. Das Registrierungsfrontend speichert Profilattribute als Auth-Metadaten; die Synchronisierung dieser Werte in `profiles` hängt von der Datenbankeinrichtung ab und sollte dort nachvollzogen werden.

<!-- Seitenumbruch -->

## Seite 7 – Quizablauf und Auswertung

### Start eines Quiz

`initQuizPage()` prüft, ob die erforderlichen Auswahlwerte vorhanden sind und ob ein angemeldeter Nutzer verfügbar ist. Danach erstellt `createQuizAttempt()` einen Versuch. Die Fragenabfrage filtert nach ausgewählter `subject_id`, `topic_id` und aktivem Status. Ohne passende Fragen zeigt die Oberfläche einen entsprechenden Hinweis.

### Antwortverarbeitung

Für jeden Fragenindex speichert das Frontend einen Zustand mit den Feldern `answered`, `isCorrect` und `selectedAnswer`. Nach dem ersten Klick wird die Antwort vorübergehend gesperrt. Die Anwendung vergleicht den gewählten Buchstaben mit `correct_answer` und speichert die Auswahl in `quiz_answers`. Erst nach erfolgreichem Speichern wird der Zustand als beantwortet markiert; bei einem Speicherfehler wird die Auswahl nicht als abgeschlossen behandelt und ein erneuter Versuch ermöglicht.

Das Feedback markiert die richtige Antwort grün und eine falsch gewählte Antwort rot. Eine Erklärung wird aus dem Frageeintrag angezeigt; fehlt sie, erscheint ein Ersatzhinweis. Die Navigation kennzeichnet beantwortete Fragen und erlaubt, zu ihnen zurückzukehren. Änderungen an einer bereits gespeicherten Antwort sind nicht vorgesehen.

### Ergebnis

Der Score wird aus den lokal gespeicherten Zuständen als Anzahl richtiger Antworten berechnet. Der Prozentwert ergibt sich aus `score / Gesamtzahl × 100`, gerundet auf eine ganze Zahl. Erst wenn alle Fragen beantwortet wurden, kann die Ergebnisansicht geöffnet werden. Dann wird der Versuch mit Abschlusszeit, Score und Gesamtzahl aktualisiert.

Die Statistiken des Dashboards werden aus gespeicherten Versuchen und Antwortdatensätzen gebildet. Die Trefferquote entspricht richtigen Antworten geteilt durch gespeicherte Antworten; bei noch keinen Antworten wird 0 % angezeigt. Bei Ladefehlern zeigt das Dashboard Platzhalter statt vermeintlicher Kennzahlen.

<!-- Seitenumbruch -->

## Seite 8 – Gestaltung, Bedienbarkeit und Barrierefreiheit

### Visuelle Gestaltung

Die Seiten verwenden eine wiederkehrende Farbwelt aus dunklem Anthrazit, Gold und hellen Grautönen. Gold hebt Aktionen und aktive Themen hervor. Grün und Rot dienen als visuelle Rückmeldung für richtige beziehungsweise falsche Antworten. Karten, abgerundete Ecken, Schatten und großzügige Abstände gliedern Dashboard, Login und Quiz in verständliche Bereiche.

### Responsive Verhalten

Die HTML-Seiten enthalten Viewport-Metadaten und CSS-Media-Queries. Auf kleineren Ansichten werden mehrspaltige Anordnungen reduziert; Karten und Buttons können die verfügbare Breite ausfüllen. Die Quizseite passt Abstände und Fragennavigation für schmale Bildschirme an. Die Umsetzung sollte regelmäßig mit realen Geräten und verschiedenen Browserbreiten geprüft werden, insbesondere bei langen Themen- oder Antworttexten.

### Bedienbarkeit

Formularfelder besitzen sichtbare Beschriftungen oder Platzhalter; Pflichtfelder nutzen `required`. Status- und Fehlermeldungen informieren über Ladezustände und fehlgeschlagene Aktionen. Fragefortschritt und farbliche Markierungen helfen, den Bearbeitungsstand zu erkennen. Für eine belastbare barrierefreie Nutzung sollten zusätzliche Prüfungen folgen: Tastaturbedienbarkeit aller dynamischen Elemente, sichtbarer Fokus, ausreichender Kontrast, semantische Überschriften, Screenreader-Ankündigungen für Feedback sowie Fehlerhinweise, die nicht nur auf Farbe beruhen.

### Mögliche Verbesserungen

Gemeinsame CSS-Regeln könnten in Stylesheets ausgelagert werden, um Farben und responsive Regeln zentral zu pflegen. Außerdem sollte die HTML-Semantik konsistent geprüft werden. Dynamisch erzeugte Inhalte sollten weiterhin escaped werden; Dashboard- und Quizlogik enthalten hierfür einfache Escape-Funktionen. Diese clientseitige Maßnahme ersetzt keine serverseitigen Zugriffsregeln.

<!-- Seitenumbruch -->

## Seite 9 – Einrichtung, Sicherheit und Qualitätssicherung

### Einrichtung für Entwicklung oder Betrieb

1. Repository-Dateien auf einen statischen Webserver legen.
2. In `js/supabase.js` die richtige Supabase-Projekt-URL und den öffentlichen Client-Key konfigurieren.
3. Supabase Auth sowie die benötigten Tabellen und Beziehungen bereitstellen.
4. Auth-Redirect-URLs und zulässige Website-URL für die verwendete Domain konfigurieren.
5. Fächer, Themen und aktive Fragen einpflegen.
6. Zugriffspolicies testen, bevor echte Nutzerkonten oder Lerndaten verwendet werden.

Die vorhandene `README.md/README_DATABASE.md` enthält eine Übersicht der Tabellen und des Datenflusses. Sie weist auch auf direkte SQL-Importe hin. Konkrete Deployment-Befehle sind nicht Bestandteil dieser Dokumentation.

### Sicherheitsaspekte

Das Frontend verwendet einen öffentlichen Supabase-Anon-Key; dieser darf nicht als geheim betrachtet werden. Sicherheit muss durch Supabase-Policies sichergestellt werden. Mindestens ist zu verifizieren, dass ein Nutzer nur das eigene Profil, die eigenen Quizversuche und Antworten lesen oder ändern kann und dass Schreibzugriffe keine fremden `user_id`-Werte erlauben. Die öffentliche Lesbarkeit von Fragen und Fächern ist eine fachliche Entscheidung. Passwörter werden an Supabase Auth übergeben und sollten nicht in eigener Anwendungsspeicherung abgelegt werden.

### Qualitätssicherung

Für eine manuelle Abnahme empfiehlt sich, Registrierung und Login mit gültigen und ungültigen Eingaben zu testen, Dashboard und Logout zu prüfen, fehlende Inhalte zu simulieren, die Speicherung einer richtigen und falschen Antwort nachzuverfolgen und den Abschlusswert gegen die gespeicherten Datensätze abzugleichen. Zusätzlich sollten Netzwerkfehler, nicht angemeldete Zugriffe, mobile Ansichten, Tastaturbedienung und Supabase-Policies geprüft werden. Im Repository ist kein automatisierter Testlauf dokumentiert; die genannten Punkte sind daher ein Prüfkatalog und kein Testbericht.

<!-- Seitenumbruch -->

## Seite 10 – Grenzen, Weiterentwicklung und Fazit

### Bekannte Grenzen des dokumentierten Stands

Die Anwendung bietet eine einfache Quiznavigation und grundlegende Statistik, jedoch keine umfangreiche Lernanalyse. Antworten werden nach dem Speichern gesperrt. Eine administrative Oberfläche zur Pflege von Fragen ist nicht erkennbar; Inhalte erfordern derzeit Datenbankzugriff beziehungsweise SQL-Import. Ein abgebrochener Versuch kann als unvollständiger Datensatz bestehen bleiben, da der Versuch bereits zu Quizbeginn angelegt wird. Außerdem ist die korrekte Profilbereitstellung von der Supabase-Datenbankkonfiguration abhängig.

### Sinnvolle nächste Schritte

- Policies, Tabellenconstraints und Profil-Synchronisierung in Supabase dokumentieren und testen.
- Automatisierte Tests für Quizabschluss, Scoreberechnung und Berechtigungen ergänzen.
- Einen geschützten Frageneditor für Lehrkräfte oder Verantwortliche entwickeln.
- Optionale Filter, Suchfunktion und erweiterte Lernstatistiken hinzufügen.
- Einheitliche Stylesheets und wiederverwendbare Oberflächenbausteine einführen.
- Barrierefreiheit, Datenschutzinformationen und Löschprozesse systematisch überprüfen.
- Umgang mit abgebrochenen Quizversuchen und Wiederholungen fachlich festlegen.

### Fazit

ClashQuizOpen ist eine kompakte, datengetriebene Quizanwendung mit klarer Trennung der wichtigsten Aufgaben: Authentifizierung, Inhaltsauswahl, Quizbearbeitung und Speicherung der Ergebnisse. Die Verbindung aus statischem Frontend und Supabase ermöglicht einen schlanken technischen Aufbau und eine flexible Pflege von Fächern, Themen und Fragen. Für den produktiven Einsatz sind vor allem die serverseitigen Zugriffsregeln, die Profilkonfiguration und eine wiederholbare Qualitätssicherung entscheidend. Die vorhandene Basis eignet sich für schrittweise Erweiterungen, ohne den unkomplizierten Lernablauf aus den Augen zu verlieren.

### Begriffe

**Fach:** übergeordneter Lernbereich. **Thema:** Unterteilung eines Fachs. **Quizversuch:** ein gestarteter Durchlauf. **Trefferquote:** Anteil richtiger Antworten an allen gespeicherten Antworten. **Supabase Anon-Key:** öffentlicher Client-Key, dessen Nutzung durch Policies eingeschränkt werden muss.
