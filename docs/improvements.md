# AllergieScan - Verbesserungsvorschläge nach E2E-Test

**Branch:** `feature/e2e-fixes`
**Datum:** Mai 2026
**Methodik:** End-to-End-Test aller Routen mit `next-browser` (DOM-Snapshots, Console-Logs, Theme-Toggle, Mobile-Viewport, beide Locales).

---

## Bereits behobene Bugs (Commit `2db0559`)

| # | Bug | Ursache | Fix |
|---|-----|---------|-----|
| B1 | `/scan` und `/history` nicht in Middleware geschützt | `protectedRoutes = ['/dashboard','/profile']` | `['/dashboard','/profile','/scan','/history']` |
| B2 | Register-Inputs ohne `id`/`htmlFor` (WCAG-Verstoß) | `Field`-Komponente ohne `id`-Prop | `id`-Prop hinzugefügt, alle 4 Inputs verknüpft |
| B3 | Landing-Hero zeigt deutsch auch auf `/en` | Hardcoded `"Weiss, was drin ist."` | `home.heroTitle1-3` + i18n-Keys |
| B4 | Landing-CTA "Einkaufen ohne Sorge." hardcoded | Hardcoded JSX-String | `home.ctaTitle/ctaTitleHighlight/ctaDesc` |
| B5 | "Methode 01" + "3 Schritte" hardcoded | Inline-Strings | `home.method` / `home.steps` |
| B6 | Login-Heading "Bei AllergieScan anmelden." hardcoded | JSX-Literal | `auth.loginWelcome` + `auth.loginHeading` mit `{app}`-Variable |
| B7 | Dashboard-`greet()` liefert deutschen String | Switch direkt im Component | Locale-aware via `dashboard.greetMorgen/Tag/Abend` |
| B8 | Scan-Heading "Pruefe ein Produkt." hardcoded | JSX-Literal | `scan.heading/headingHighlight` |
| B9 | History-Heading "Dein Verlauf." + Empty hardcoded | JSX-Literal | `history.heading/headingHighlight/emptyTitle` |

---

## 17 Verbesserungsvorschläge (priorisiert)

Bewertungsskala: **Impact** (1-5) · **Aufwand** (1-5) · **Priorität** = Impact / Aufwand

### V1 - PWA-Installation und Offline-Cache
**Beschreibung:** Service Worker + Web Manifest, damit Nutzer im Supermarkt offline scannen können (Off-Food-Facts-Daten cachen, letzte 100 Produkte lokal vorhalten).
- **Vorteile:** Hauptanwendungsfall ist Supermarkt mit schlechtem Empfang. App-Symbol auf Homescreen → höhere Retention. Schneller Start.
- **Nachteile:** Cache-Invalidierung komplex (Produkt-Reformulierungen). Storage-Quota auf iOS limitiert. Service-Worker-Updates können Bugs verbergen.
- **Bewertung:** Impact 5 · Aufwand 3 · **Prio 1.67** (höchste)

### V2 - Vollständige Übersetzung aller Allergen-Texte
**Beschreibung:** Aktuell verwendet UI nur `name_de` aus DB (siehe `dashboard/page.tsx`, `history/page.tsx`, `ScanResult.tsx`). Auf locale=en muss `name_en` greifen.
- **Vorteile:** EN-Build endlich konsistent. Kein "Erdnüsse" auf englischer UI.
- **Nachteile:** Pages müssen `useLocale()` durchreichen oder Tagged Object aus DB nehmen. Mehr Joins.
- **Bewertung:** Impact 4 · Aufwand 2 · **Prio 2.0**

### V3 - Echte Loading-Skeletons statt Spinner
**Beschreibung:** `<Loading />`-Komponenten zeigen leere Cards in finaler Größe statt drehender Kreise (Dashboard, History, Profile).
- **Vorteile:** Kein Layout-Shift (CLS), gefühlt schneller.
- **Nachteile:** Mehr Komponenten zu pflegen. Skeletons brauchen Designsprache.
- **Bewertung:** Impact 3 · Aufwand 2 · **Prio 1.5**

### V4 - Server-Components statt Client-Fetch fürs Dashboard
**Beschreibung:** Dashboard lädt aktuell client-seitig `/api/profile` + `/api/history` mit Bearer-Token. Stattdessen Server-Component mit `createServerClient()`.
- **Vorteile:** Erste Renders ohne FOUC, schneller TTI, kein Doppel-Bearer-Token-Handling.
- **Nachteile:** Auth-Cookie statt Bearer, Streaming muss eingerichtet werden, Refresh ist client-seitig schwieriger.
- **Bewertung:** Impact 4 · Aufwand 3 · **Prio 1.33**

### V5 - Error Boundaries und Toast-System
**Beschreibung:** `error.tsx` pro Route-Segment + globaler Toast (`sonner` oder eigen). Aktuelle App zeigt API-Fehler nur lokal als Inline-Box.
- **Vorteile:** Konsistente UX bei Netzfehlern. Wiederholbare Bedienschritte.
- **Nachteile:** Globaler State (Context/Store). Toasts ablenkend, müssen dezent designed werden.
- **Bewertung:** Impact 4 · Aufwand 2 · **Prio 2.0**

### V6 - Profil-Setup-Inducement nach Login
**Beschreibung:** Wenn nach Login `profile.allergen_config === []`, automatisches Redirect auf `/profile` mit Onboarding-Banner statt leeres Dashboard.
- **Vorteile:** Reduziert Verwirrung "Warum sehe ich keine Scans?". Trichtert Nutzer in Setup.
- **Nachteile:** Bestehende User mit leerem Profil werden genervt → Flag in Profile-Tabelle `onboarding_completed`.
- **Bewertung:** Impact 4 · Aufwand 2 · **Prio 2.0**

### V7 - Barcode-Scanner: native Camera-API + Fallback
**Beschreibung:** `html5-qrcode` ist groß (~250 KB) und auf iOS Safari unzuverlässig. BarcodeDetector-API nativ verwenden, mit `html5-qrcode` als Fallback.
- **Vorteile:** -200 KB JS, schneller, native Performance.
- **Nachteile:** BarcodeDetector ist auf Firefox + älteren iOS noch nicht überall. Detektion muss live geprüft werden.
- **Bewertung:** Impact 4 · Aufwand 3 · **Prio 1.33**

### V8 - Open-Food-Facts-Cache in Supabase
**Beschreibung:** Jeder Lookup `/api/products/barcode/[ean]` cached die Antwort in `product_cache`-Tabelle (TTL 30 Tage). Bei Hit: keine externe API-Last.
- **Vorteile:** Schnellere Wiederholungs-Scans. Resilient gegen OFF-Downtimes. DSGVO-freundlicher (keine Re-Fetches).
- **Nachteile:** Cache-Größe wächst. Stale Daten bei Reformulierung. Migration nötig.
- **Bewertung:** Impact 5 · Aufwand 3 · **Prio 1.67**

### V9 - Allergen-Risk-Erklärung im Scan-Result
**Beschreibung:** Wenn `result=warning`, Tooltip/Popover mit "Warum nur Warnung?" (z. B. "Spuren von ..." vs. "kann enthalten"). Aktuell sehen Nutzer nur gelben Punkt.
- **Vorteile:** Vertrauen in System. Bessere Entscheidung.
- **Nachteile:** Engine muss Begründung mitliefern (Token-Score, Spur-Erkennung). Mehr Backend-Logik.
- **Bewertung:** Impact 5 · Aufwand 4 · **Prio 1.25**

### V10 - Filter und Suche im History
**Beschreibung:** History-Page hat aktuell nur stumme Cards. Filter nach Result (safe/warning/danger), Volltextsuche, Datumsbereich, Export als CSV.
- **Vorteile:** Power-User finden alte Scans. Self-Service-Audit.
- **Nachteile:** UI wird komplexer. Pagination nötig.
- **Bewertung:** Impact 3 · Aufwand 3 · **Prio 1.0**

### V11 - "Diesen Scan teilen"-Funktion
**Beschreibung:** Share-Sheet (Web Share API) mit Produkt + Ergebnis als Link / Bild. Wichtig für Eltern, die Produkte mit Schulen/Verwandten teilen.
- **Vorteile:** Viraler Effekt. Echter Nutzwert für Allergiker-Familien.
- **Nachteile:** Datenschutz: was wird geteilt? Persönliches Profil darf NICHT geteilt werden.
- **Bewertung:** Impact 3 · Aufwand 2 · **Prio 1.5**

### V12 - SEO-Metadaten und strukturierte Daten
**Beschreibung:** `generateMetadata` fehlt auf allen Routes außer Root. `og:image`, Twitter Card, JSON-LD `WebApplication`.
- **Vorteile:** Bessere Auffindbarkeit, schöne Link-Previews in WhatsApp/Slack.
- **Nachteile:** OG-Image-Generierung (Vercel OG) braucht Setup. Wartung pro Sprache.
- **Bewertung:** Impact 3 · Aufwand 2 · **Prio 1.5**

### V13 - Vitest + Playwright-Integration-Tests
**Beschreibung:** Aktuell null automatisierte Tests. Unit-Tests für `engine/*` (Allergen-Match-Logik!), E2E mit Playwright für Register- und Scan-Flow.
- **Vorteile:** Regression-Sicherheit. CI-Gate vor Vercel-Deploy.
- **Nachteile:** Initial-Aufwand (Test-Supabase, Fixtures). Maintenance.
- **Bewertung:** Impact 5 · Aufwand 4 · **Prio 1.25**

### V14 - Dark-Mode-Polish (Surface-Kontraste)
**Beschreibung:** Im Dark-Mode wirken `bg-surface` und `bg-canvas-raised` sehr ähnlich. Cards verschwimmen. Border in Dark sollte heller (z. B. `rgba(255,255,255,0.08)`).
- **Vorteile:** Bessere Hierarchie, professionellerer Look.
- **Nachteile:** Token müssen neu balanciert werden, Risiko von Regressionen in Light-Mode wenn nicht sauber via `.dark` gescoped.
- **Bewertung:** Impact 3 · Aufwand 1 · **Prio 3.0** (Quick-Win!)

### V15 - Magic-Link-Login als zweite Option
**Beschreibung:** Supabase unterstützt `signInWithOtp` - User kriegt E-Mail-Link, kein Passwort. Reduce Friction.
- **Vorteile:** Niedrigere Login-Barriere, weniger "Passwort vergessen". Sicherer (keine Passwort-Reuse).
- **Nachteile:** Email-Delivery muss zuverlässig sein. User-Verwirrung wenn beide Optionen sichtbar.
- **Bewertung:** Impact 3 · Aufwand 2 · **Prio 1.5**

### V16 - Telemetrie und Fehler-Monitoring
**Beschreibung:** Sentry für Runtime-Errors, PostHog/Plausible für Funnels (Register-Abbrüche pro Wizard-Schritt!).
- **Vorteile:** Datengetriebene Produktentwicklung. Frühe Erkennung von Vercel-Issues.
- **Nachteile:** Datenschutz (DSGVO-konform aufsetzen, opt-in). Bundle-Größe.
- **Bewertung:** Impact 4 · Aufwand 2 · **Prio 2.0**

### V17 - Multi-Profile (Familie)
**Beschreibung:** Ein Account, mehrere Allergie-Profile (Kind 1, Kind 2, Partner). Aktiver Profil-Switch im TopBar. Scan prüft gegen aktives Profil.
- **Vorteile:** Killer-Feature für Eltern allergischer Kinder (= Kernzielgruppe). Großer Mehrwert.
- **Nachteile:** Schema-Erweiterung, RLS umbauen, UI komplexer.
- **Bewertung:** Impact 5 · Aufwand 5 · **Prio 1.0**

---

## Empfohlene Roadmap (priorisiert nach Score)

1. **V14** (Dark-Polish, 1 Tag) - sofort
2. **V5** (Error Boundaries + Toasts, 2 Tage)
3. **V6** (Onboarding-Redirect, 1 Tag)
4. **V2** (i18n Allergen-Namen, 1 Tag)
5. **V16** (Sentry + Plausible, 1 Tag)
6. **V1** (PWA + Offline-Cache, 1 Woche)
7. **V8** (Product-Cache, 3 Tage)
8. **V12** (SEO/OG-Images, 1 Tag)
9. **V15** (Magic-Link, 1 Tag)
10. **V11** (Share, 2 Tage)
11. **V3** (Skeletons, 1 Tag)
12. **V4** (Server-Components, 3 Tage)
13. **V7** (BarcodeDetector, 2 Tage)
14. **V13** (Tests, 1 Woche)
15. **V9** (Risk-Erklärung, 1 Woche)
16. **V10** (History-Filter, 3 Tage)
17. **V17** (Multi-Profil, 2 Wochen)

---

## E2E-Testabdeckung dieser Session

| Route | Status | Erkenntnis |
|-------|--------|-----------|
| `/de` | 200, A11y ok | Hardcoded German (B3-B5) gefixt |
| `/en` | 200 | Hardcoded German (B3-B5) gefixt |
| `/de/login` | 200 | Hardcoded "Bei AllergieScan anmelden." (B6) gefixt |
| `/de/register` | 200 | A11y `htmlFor` (B2) gefixt |
| `/de/dashboard` | jetzt redirect → login (B1 nicht relevant) | greet() i18n (B7) gefixt |
| `/de/scan` | jetzt redirect → login (B1) | Heading i18n (B8) gefixt |
| `/de/history` | jetzt redirect → login (B1) | Heading + Empty i18n (B9) gefixt |
| `/de/help` | 200, A11y ok | Handbuch + PDF funktioniert |
| `/de/profile` | redirect ok | i18n + Presets OK |
| `/api/handbook/pdf?locale=de` | 200 (11233 bytes) | OK |
| Dark Mode Toggle | OK | V14 Polish empfohlen |
| Mobile (375x812) | OK | Bottom-Nav rendert |
