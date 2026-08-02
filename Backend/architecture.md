# Beschreibung

## Use Cases

- Ich als Admin kann Beiträge erstellen (Titel, Inhalt, evtl. später Bild/Tags, Entwurf vs. veröffentlicht)
- Ich als Admin kann Beiträge nach Belieben anzeigen, bearbeiten und löschen lassen
- Ich als Besucher kann veröffentlichte Beiträge lesen, ohne mich anmelden zu müssen

## Constraint

- Nutzung einer Datenbank
- Schreibzugriff (Erstellen/Bearbeiten/Löschen) darf nur dem Admin vorbehalten sein, Lesezugriff ist öffentlich
- Angular als Frontend-Technologie soll weiterverwendet werden

# Entscheidungen

Das Erstellen und Anzeigen sind eigentlich getrennte Aufgaben mit unterschiedlichen Anforderungen: Lesen ist öffentlich, häufig und unkritisch; Schreiben ist selten, sicherheitskritisch und nur für eine einzige Person (Admin) gedacht. Deshalb lohnt es sich, beide getrennt zu betrachten, statt eine Lösung für beides zu erzwingen.

Folgende drei Ansätze wurden abgewogen:

## Option 1: Ein Angular-Projekt, das direkt SQL-Befehle nutzt

Angular (bzw. ein Node-Layer dahinter) spricht die Datenbank direkt an, ohne eigene Backend-API.

| | |
| --- | --- |
| Vorteile | + Kein großer Mehraufwand jetzt, schnell umsetzbar<br>+ Gute Gelegenheit, Erfahrung mit Datenbanken/SQL zu sammeln |
| Nachteile | - DB-Zugangsdaten oder Query-Logik landen faktisch im Client-nahen Code → hohes Sicherheitsrisiko<br>- Kein zentraler Ort für Validierung; Einfügen/Ändern von Daten wird schnell unübersichtlich ("ekliger")<br>- Keine klare Trennung zwischen Lese- und Schreibrechten möglich<br>- Skaliert schlecht, sobald mehr Logik (Auth, Validierung, Caching) dazukommt |

## Option 2: Ein Angular-Projekt + "geheime" Admin-Seite

Eine gemeinsame Angular-App, bei der eine versteckte Route (z. B. `/admin-x7z`) die Schreibfunktionen enthält.

| | |
| --- | --- |
| Vorteile | + Nur ein Frontend-Projekt zu pflegen und zu deployen<br>+ Zwingt dazu, Cybersecurity ernster zu nehmen, weil die Trennung explizit gemacht werden muss |
| Nachteile | - Größerer Mehraufwand, weil Rechteprüfung sauber implementiert werden muss<br>- "Security by obscurity" ist kein echter Schutz – eine geratene/gefundene URL reicht, wenn keine echte Auth dahintersteckt<br>- Admin- und Public-Code bleiben im selben Bundle vermischt, was das Risiko erhöht, versehentlich Admin-Funktionalität mit auszuliefern |

## Option 3: Zwei getrennte Angular-Projekte (eins zum Erstellen, eins zum Anzeigen)

Zwei unabhängige Frontends gegen ein gemeinsames Backend (bzw. eine gemeinsame API/DB): ein öffentliches Read-Projekt und ein separates Write/Admin-Projekt.

| | |
| --- | --- |
| Vorteile | + Klare Trennung von Concerns: Public-Bundle enthält keinerlei Admin-Code<br>+ Admin-Projekt kann unabhängig abgesichert werden (eigene Auth, ggf. eigenes Deployment/Hosting, nicht öffentlich beworben)<br>+ Beide Projekte können unabhängig voneinander weiterentwickelt und deployed werden<br>+ Erzwingt von Anfang an eine saubere Backend-API statt direkter DB-Zugriffe |
| Nachteile | - Größerer initialer Mehraufwand: zwei Projekte, zwei Deployments, ggf. CORS-Konfiguration<br>- Gemeinsame Typen/Modelle (z. B. Artikel-Schema) müssen zwischen den Projekten synchron gehalten werden<br>- Mehr bewegliche Teile insgesamt (2 Frontends + 1 Backend + DB) |

## Entscheidung

**Doppelte Angular-Projekte** – am einfachsten klar zu trennen und zwingt von Anfang an zu einer sauberen Architektur statt eines Shortcuts über direkte SQL-Zugriffe oder eine bloß "versteckte" Admin-Route.

Umgesetzt als:

- `GreenBlog.Api` – gemeinsames .NET-Backend (Minimal API + EF Core) mit Zugriff auf die Datenbank; einziger Ort mit DB-Zugriff, von beiden Frontends genutzt
- `Frontend` – öffentliches Angular-Projekt zum Lesen/Anzeigen der Beiträge
- `GreenblogWrite` – separates Angular-Projekt für den Admin, zum Erstellen/Bearbeiten von Beiträgen

### OKAY never fucking mind

Da ich in VS Code programmiere und mir auch einen db Editor geholt habe, scheint es doch das einfachste zu sein, einfach diesen db Editor zu nutzen bevor ich die Seite mache 
