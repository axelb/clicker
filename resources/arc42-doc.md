#Architekturdokumentation "onlineresponse"

##Einführung und Ziele (engl.: Introduction and Goals)
Onlineresponse ist ein System, um Fragen für Peer Instruction für ein größeres Auditorium zur Verfügung zu stellen. Die Teilnehmenden scannen in einer Lehrveranstaltung einen QR-Code von einer Beamer-Projektionsfläche mit ihren eigenen mobilen Geräten (Handys, Tablets) und werden dadurch zu einer Web-Seite geleitet, wo sie eine Frage des Dozierenden sehen und online ihre Antwort abgeben können. Der Dozierende wertet die Antworten sofort aus und trifft auf Basis der Ergebisse eine Entscheidund über den weiteren Verlauf der Lehreinheit. 

Das System soll online sein, also überall verfügbar sein und unabhängig vom Einsatz (teurer) Clicker-devices.

###Aufgabenstellung (engl.: Requirements Overview)
Es gibt unterschiedliche Typen von Fragen. Zumindest single/multiple choice (SC/MC) und Lückentext (Cloze). Das System soll um weitere Fragetypen erweiterbar sein.


Qualitätsziele (engl.: Quality Goals)

###Stakeholder

Die folgende Tabelle zeigt die konkreten Stakeholder für das System sowie deren Interessen oder Beteiligung:

| Rolle/Kontakt            | Beschreibung (Ziel, Intention)          |
|-------------------------|--------------------------|
| Studierende| Sollen sich ohne nennenswerten Aufwand an der Beantwortung von PI-Fragen im Unterricht beteiligen können. |
|Dozierende| Sollen ein Hilfsmittel für den einsatz von PI in ihrem Unterricht haben. Sie sollen auch ad hoc Fragen formulieren können. |
|Axel Böttcher|Fallstudie für Lehrveranstatlung Software-Architektur|
|Teilnehmende der LVA SWA| Müssen sich mit Arc42-Beschreibungen wie dieser hier auseinander setzen. |

##Randbedingungen (engl.: Architecture Constraints)

###Technische Randbedingungen

|Vorgaben||
|-------------------------|--------------------------|
| **Hardware-Vorgaben**       |   |
|    | Fragen müssen mit allen gängigen mobilen Geräten aufgerufen und beantwortet werden können.  |
| **Software-Vorgaben**   |   |
|     | Auf den Mobilgeräten muss ein QR-Code-Scanner vorhanden sein |
| **Vorgaben des Systembetriebs**          | |
|   | Muss jederzeit im Internet zugreifbar sein        |
|   | Muss deploybar sein auf eine freie SAAS-Plattform (Heroku, OpenShift)|
| **Programmiervorgaben** | |
|   | Serverseitig muss nodejs verwendet werden.   |
|   | Es müssen moderne Frameworks und Entwicklungswerkzeuge verwendet werden |

###Organisatorische Randbedingungen

### Organisation und Struktur

*\<hier Randbedingungen einfügen\>*

### Ressourcen (Budget, Zeit, Personal)
Wird als Porjekt von einer Person (Axel Böttcher) betrieben.


### Organisatorische Standards
Quellcode wird bei github gehostet. Es soll CI und CD erfolgen.

### Juristische Faktoren
Die Software soll unter einer liberalen Open Source Lizenz stehen.

Konventionen
------------



##Kontextabgrenzung

Die folgenden Unterkapitel zeigen die Einbettung unseres Systems in
seine Umgebung.

###Fachlicher Kontext
Kontext: Dozent, Student, System, Admin

###Technischer- oder Verteilungskontext

###Externe Schnittstellen




##Lösungsstrategie



##Bausteinsicht

###Whitebox Gesamtsystem

### *Baustein 1* (Blackbox)

### *Baustein 2* (Blackbox)

### *Baustein n* (Blackbox)

Ebene 2

### *Baustein 1: Server-Code* (Whitebox)



#### *Baustein 1.1* (Blackbox)

#### *Baustein 1.2* (Blackbox)

#### *Baustein 1.n* (Blackbox)

### *Baustein 2: Client-Anwendung Dozierender* (Whitebox)

#### *Baustein 2.1* (Blackbox)

#### *Baustein 2.2* (Blackbox)

#### *Baustein 2.n* (Blackbox)

### *Baustein 3* (Whitebox)

*\<Hier Whitebox-Erläuterung für Baustein 3 einfügen\>*

#### *Baustein 3.1* (Blackbox)

#### *Baustein 3.2* (Blackbox)

#### *Baustein 3.n* (Blackbox)

Ebene 3

### *Baustein 1.1* (Whitebox)

#### *Baustein 1.1.1* (Blackbox)

#### *Baustein 1.1.2* (Blackbox)



##Laufzeitsicht

###Laufzeitszenario 1

###Laufzeitszenario 2


###Laufzeitszenario *n*




##Verteilungssicht

###Infrastruktur Ebene 1

### Verteilungsdiagramm Ebene 1

### Prozessor 1

### Prozessor 2

…

### Prozessor *n*

### Kanal 1

### Kanal 2

…

### Kanal *m*

### Offene Punkte

Infrastruktur Ebene 2







Konzepte
========

Fachliche Strukturen und Modelle
--------------------------------

Typische Muster und Strukturen
------------------------------

Persistenz
----------

Benutzungsoberfläche
--------------------

Ergonomie
---------

Ablaufsteuerung
---------------

Transaktionsbehandlung
----------------------

Sessionbehandlung
-----------------

Sicherheit
----------

Kommunikation und Integration mit anderen IT-Systemen
-----------------------------------------------------

Verteilung
----------

Plausibilisierung und Validierung
---------------------------------

Ausnahme-/Fehlerbehandlung
--------------------------

Management des Systems & Administrierbarkeit
--------------------------------------------

Logging, Protokollierung, Tracing
---------------------------------

Geschäftsregeln
---------------

Konfigurierbarkeit
------------------

Parallelisierung und Threading
------------------------------

Internationalisierung
---------------------

Migration
---------

Testbarkeit
-----------
Tests bemötigen PhantomJS und Python (?)

Skalierung, Clustering
----------------------

Hochverfügbarkeit
-----------------

Codegenerierung
---------------

Buildmanagement
---------------

Stapel-/Batchverarbeitung
-------------------------

Drucken
-------

Reporting
---------



##Entwurfsentscheidungen

Entwurfsentscheidung 1

### Fragestellung

### Rahmenbedingungen

### Annahmen

### Entscheidungskriterien

### Betrachtete Alternativen

### Entscheidung


Entwurfsentscheidung n





##Qualitätsszenarien

Qualitätsbaum

Bewertungsszenarien

  Szenario                Auslöser                Metrik
  ----------------------- ----------------------- -----------------------
                                                  
                                                  

##Risiken

| Risiko                  | Priorität                                       |
|---|---|
| Konsequenz              | Erläuterung                                     |







##Glossar

| Begriff                 | Definition                                      |
|---|---|
| BYOD | Abkürzung für *Bring Your Own Device*. Mobile Endgeräte der Teilnehmenden eine Lehrveranstaltung|
|CD|Continuous deployment|
|CI|Continuous Integration|
|MC|multiple choice|
| PI   | Peer Instruction. Lehrmethode von Kurt Masur ...|
|QR code | Quick Response code. 2-dimensionaler graphischer Code mit Fehlerkorrektur|
|SC|single choice|



