# IT_NRW Test Framework

Dieses Projekt bietet ein Framework für automatisierte Tests mit Playwright und Cucumber. Unten finden Sie die Projektstruktur und eine Erklärung zu jeder Datei.

## Projektstruktur

### Erklärung

1. **features/**:
   - Dieser Ordner enthält die Feature-Dateien und die Schrittdefinitionen für Behavior-Driven Development (BDD) Tests.
   - **step_definitions/**:
     - **step.js**: Diese Datei enthält die Schrittdefinitionen für die Feature-Dateien. Hier werden die Schritte definiert, die in den Tests verwendet werden.
   - **FormSubmissionAndVerification.spec.feature**: Eine Feature-Datei, die das Szenario für das Ausfüllen und Überprüfen eines Formulars beschreibt.

2. **pageobjects/**:
   - Dieser Ordner enthält die Page Object Model (POM) Dateien. POM ist ein Designmuster, das die Webelemente und Aktionen einer Seite kapselt.
   - **POManager.js**: Diese Datei verwaltet die verschiedenen Page Objects. Sie erstellt Instanzen der Seitenobjekte und stellt sie den Tests zur Verfügung.
   - **LoginPage.js**: Diese Datei repräsentiert die Login-Seite. Sie enthält die Webelemente und Methoden, die auf der Login-Seite verwendet werden.
   - **FormToFillOut.js**: Diese Datei repräsentiert ein Formular, das ausgefüllt werden muss. Sie enthält die Webelemente und Methoden, die zum Ausfüllen des Formulars verwendet werden.
   - **MyApplicationsPage.js**: Diese Datei repräsentiert die "Meine Anwendungen" Seite. Sie enthält die Webelemente und Methoden, die auf dieser Seite verwendet werden.

3. **Utils/**:
   - Dieser Ordner enthält Hilfsdateien.
   - **testdata.json**: Eine JSON-Datei, die Testdaten enthält. Diese Daten werden in den Tests verwendet.

4. **tests/**:
   - Dieser Ordner enthält die Testdateien.
   - **FormCreationAndManagement.spec.js**: Diese Datei testet das Erstellen, Speichern, Überprüfen und Löschen eines Formulars.

5. **playwright.config.js**:
   - Diese Datei ist die Konfigurationsdatei für Playwright. Sie legt verschiedene Einstellungen und Optionen für das Ausführen der Tests fest.
   - Zum Beispiel:
     - **testDir**: Gibt das Verzeichnis an, in dem sich die Testdateien befinden.
     - **retries**: Legt die Anzahl der Wiederholungen für einen Test im Fehlerfall fest.
     - **timeout**: Legt die maximale Zeit fest, die ein einzelner Test laufen darf.
     - **reporter**: Gibt das Format des Testberichts an, in diesem Fall HTML.
     - **use**: Enthält gemeinsame Einstellungen für alle Projekte, wie z.B. den Browsertyp, ob der Browser im Headless-Modus ausgeführt wird, und ob Screenshots und Traces erstellt werden sollen.

6. **package.json**:
   - Diese Datei ist die npm-Paketkonfigurationsdatei. Sie enthält Informationen über das Projekt und die Abhängigkeiten, die für das Projekt benötigt werden.

7. **package-lock.json**:
   - Diese Datei ist eine Sperrdatei, die genau angibt, welche Versionen der Abhängigkeiten installiert sind. Dies stellt sicher, dass die Abhängigkeiten konsistent installiert werden.

Diese Struktur hilft dabei, die Tests und den Code gut zu organisieren und macht es einfacher, die verschiedenen Teile des Projekts zu verstehen und zu verwalten.