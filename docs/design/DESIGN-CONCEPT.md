# AllergieScan DACH - Design-Konzept "Scan & Signal"

> Version 1.0 | Mai 2026 | WAMOCON GmbH
> Status: Freigegeben zur Implementierung

---

## 1. Vision & Leitprinzipien

### Produkt-Vision

AllergieScan ist ein digitales Sicherheitswerkzeug fuer Allergiker im DACH-Raum.
Die App wird primaer im Supermarkt auf dem Smartphone genutzt: schnell aufmachen, Barcode scannen, sofort wissen ob das Produkt sicher ist.

### Design-Leitbild

**"Vom Scan zum Signal in unter 3 Sekunden."**

Die App verhaelt sich wie ein Instrument: oeffnen, messen, Ergebnis ablesen. Kein Onboarding-Overhead, keine versteckten Menues, keine Ablenkung.

### Kernprinzipien

| # | Prinzip | Erklaerung |
|---|---------|-----------|
| 1 | **Signal vor Detail** | Erst die emotionale Antwort (Farbe), dann die rationale Info (Tabelle) |
| 2 | **1-Hand-Bedienung** | Alle primaeren Aktionen mit dem Daumen erreichbar (untere 60%) |
| 3 | **3-Sekunden-Regel** | Vom App-Oeffnen bis zum Ergebnis maximal 3 Sekunden |
| 4 | **Progressive Disclosure** | Informationsdichte waechst mit dem Viewport |
| 5 | **Adaptive Navigation** | Bottom-Bar → Rail → Sidebar je nach Geraet |
| 6 | **Konservative Warnung** | Im Zweifel warnen, nie faelschlich beruhigen |

---

## 2. Responsive Architektur

### Breakpoints (Tailwind v4)

| Token | Breite | Geraeteklasse | Navigation |
|-------|--------|---------------|------------|
| (base) | < 768px | Smartphone | Bottom-Tab-Bar + FAB |
| `md:` | 768-1023px | Tablet Portrait | Icon-Rail (56px) |
| `lg:` | 1024-1279px | Tablet Landscape / kleiner Laptop | Sidebar collapsed (72px) |
| `xl:` | 1280-1535px | Desktop | Sidebar expanded (240px) |
| `2xl:` | >= 1536px | Grosser Monitor | Sidebar expanded + breiter Content |

### Layout-Grid

```
Mobile:        1 Spalte, 16px Padding, max-w-lg (512px)
Tablet:        Rail(56px) + Content(1fr), 24px Padding, max-w-4xl (896px)
Desktop:       Sidebar(240px) + Content(1fr), 32px Padding, max-w-6xl (1152px)
Wide Desktop:  Sidebar(240px) + Content(1fr), 32px Padding, max-w-7xl (1280px)
```

---

## 3. Farbsystem

### Semantische Farben (Ampel-System)

| Status | Light Mode | Dark Mode | Verwendung |
|--------|-----------|-----------|------------|
| **Sicher** | `#16A34A` (green-600) | `#22C55E` (green-500) | Keine Allergene gefunden |
| **Warnung** | `#D97706` (amber-600) | `#F59E0B` (amber-500) | Top-30 Allergen oder unbekannte Zutaten |
| **Gefahr** | `#DC2626` (red-600) | `#EF4444` (red-500) | Top-14 Allergen gefunden |

### Neutrale Farben (UI-Grundlage)

| Element | Light | Dark |
|---------|-------|------|
| Background (Page) | `zinc-50` (#FAFAFA) | `zinc-950` (#09090B) |
| Surface (Cards) | `white` (#FFFFFF) | `zinc-900` (#18181B) |
| Surface Elevated | `white` + shadow-md | `zinc-800` (#27272A) |
| Border | `zinc-200` (#E4E4E7) | `zinc-800` (#27272A) |
| Text Primary | `zinc-900` (#18181B) | `zinc-50` (#FAFAFA) |
| Text Secondary | `zinc-500` (#71717A) | `zinc-400` (#A1A1AA) |
| Text Muted | `zinc-400` (#A1A1AA) | `zinc-500` (#71717A) |

### Akzentfarbe (Brand)

| Verwendung | Light | Dark |
|------------|-------|------|
| Brand Primary | `rose-600` (#E11D48) | `rose-500` (#F43F5E) |
| Brand Hover | `rose-700` (#BE123C) | `rose-400` (#FB7185) |
| Interactive Focus | `rose-500/20` Ring | `rose-400/20` Ring |

> Begruendung Rose: Signalisiert Gesundheit/Allergie-Warnung, hebt sich von den Ampelfarben ab, wirkt premium und modern.

---

## 4. Typografie

### Font-Stack

```css
--font-sans: "Geist", system-ui, -apple-system, sans-serif;
--font-mono: "Geist Mono", ui-monospace, monospace;
```

### Skalierung

| Token | Mobile | Desktop | Verwendung |
|-------|--------|---------|------------|
| `text-xs` | 12px | 12px | Timestamps, Badges |
| `text-sm` | 14px | 14px | Sekundaertext, Labels |
| `text-base` | 16px | 16px | Body-Text (Mobile Base) |
| `text-lg` | 18px | 18px | Card-Titel |
| `text-xl` | 20px | 20px | Section-Titel |
| `text-2xl` | 24px | 24px | Page-Titel |
| `text-3xl` | 30px | 30px | Hero-Titel (Mobile) |
| `text-4xl` | 36px | 36px | - |
| `text-5xl` | 48px | 48px | Ergebnis-Label (Fullscreen) |

### Gewichte

| Gewicht | Verwendung |
|---------|------------|
| `font-normal` (400) | Body, Beschreibungen |
| `font-medium` (500) | Labels, Nav-Items, Tabellen-Header |
| `font-semibold` (600) | Card-Titel, Buttons |
| `font-bold` (700) | Page-Titel, Ergebnis-Worte (SICHER/WARNUNG/GEFAHR) |

---

## 5. Spacing & Sizing

### Basis-Grid: 4px

| Token | Wert | Verwendung |
|-------|------|------------|
| `space-1` | 4px | Inline-Gaps (Icon + Text) |
| `space-2` | 8px | Tight padding (Badges) |
| `space-3` | 12px | Button padding-y, List-Item gaps |
| `space-4` | 16px | Card padding (Mobile), Standard-Gap |
| `space-6` | 24px | Card padding (Desktop), Section-Gaps |
| `space-8` | 32px | Section-Margins |
| `space-12` | 48px | Page-Sections |
| `space-16` | 64px | Hero-Spacing |

### Border-Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px (`rounded-lg`) |
| Cards | 12px (`rounded-xl`) |
| Modals / Sheets | 16px (`rounded-2xl`) |
| Badges / Pills | 9999px (`rounded-full`) |
| Input-Felder | 8px (`rounded-lg`) |

### Touch-Targets

| Geraet | Minimum | Empfohlen |
|--------|---------|-----------|
| Mobile | 44x44px | 48x48px |
| Tablet | 40x40px | 44x44px |
| Desktop | 32x32px | 36x36px |

---

## 6. Komponenten-Spezifikation

### 6.1 Navigation

#### Mobile: Bottom-Tab-Bar

```
Hoehe: 64px + Safe Area
Elemente: 3 Tabs + 1 FAB (zentriert)
Tabs: Home | [Scan-FAB] | Profil
FAB: 56px Durchmesser, brand-primary, elevated shadow
Active-Indicator: Dot unter Icon (4px, brand-primary)
```

#### Tablet: Icon-Rail

```
Breite: 56px, fixed left
Elemente: Logo (oben) + 4 Icons (vertikal) + Settings (unten)
Icons: Home, Scan, Verlauf, Profil
Active-Indicator: Vertikaler Balken links (3px, brand-primary)
Tooltip on Hover: Label rechts neben Icon
```

#### Desktop: Sidebar

```
Breite: 240px (expanded), 72px (collapsed via Toggle)
Elemente: Logo + Nav-Items mit Icon + Label + Active-State
Sections: Haupt-Navigation | Divider | Einstellungen
Footer in Sidebar: Version + Hilfe-Link
Collapse-Toggle: Chevron-Icon oben rechts
```

### 6.2 Header

```
Mobile:  44px, Logo-Text links, Theme + Lang rechts
Tablet:  Kein separater Header (in Rail integriert)
Desktop: Kein separater Header (in Sidebar integriert)

Glassmorphism: bg-white/80 backdrop-blur-sm (Mobile only)
Sticky: top-0 z-50
```

### 6.3 Scanner-Card

```
Mobile:  Fullscreen-Overlay (100vh, 100vw) bei Tap auf FAB
         Home zeigt Camera-Preview (50% Hoehe) als Teaser
Tablet:  Inline-Card, 50% Breite im Split-View
Desktop: Bento-Card (flexible Breite), mit Datei-Upload-Zone

Kamera-Viewfinder:
  - Rounded corners (16px)
  - Scan-Line Animation (horizontale Linie, rose-500, bounce)
  - Dunkel-Overlay ausserhalb Scanbereich (black/50)

Fallback (kein Kamera):
  - EAN-Eingabefeld (numerisch, 13 Zeichen)
  - Datei-Upload Button (Bild hochladen)
  - Drag & Drop Zone (Desktop only)
```

### 6.4 Ergebnis-Anzeige

#### Phase 1: Signal (Mobile Fullscreen)

```
Dauer: Sofort sichtbar, bleibt bis Swipe/Tap
Layout: Zentriertes Icon + Status-Wort + Produktname
Hintergrund: Volle Ampelfarbe (green/amber/red)
Text: Weiss, bold, text-5xl fuer Status-Wort
Animation: Scale-In (0.95 → 1.0, 200ms ease-out)
Swipe-Hint: Pfeil nach oben, pulsierend
```

#### Phase 2: Detail-Sheet (Mobile)

```
Trigger: Swipe-up oder Auto-Expand nach 1.5s
Layout: Farb-Header (48px) + Weisser Content
Content: Produktname, Allergen-Liste, Unbekannte Zutaten
Allergen-Item: Farbdot + Name + Kategorie-Badge (Top-14/Top-30)
Actions: "Nochmal scannen" (primaer) + "Zurueck" (sekundaer)
```

#### Tablet/Desktop: Inline-Result

```
Layout: Card mit Farb-Sidebar (4px links) oder Farb-Header
Inhalt: Produktbild (falls vorhanden) + Tabelle + Volltext
Tabelle: Allergen | Kategorie | Gefundene Zutat
Extra-Actions: Kopieren, Teilen, Export
```

### 6.5 Verlauf

```
Mobile:  Horizontal scrollbare Mini-Cards (120px breit)
         Vollansicht: Vertikale Liste, gruppiert nach Tag
Tablet:  Grid (4 Spalten), Cards mit Farbdot + Name + Zeit
Desktop: Sortierbare Tabelle mit Spalten:
         Datum | Produkt | Ergebnis | Allergene | Quelle
         Filter: Dropdown (Alle/Sicher/Warnung/Gefahr)
         Suche: Inline-Suchfeld
```

### 6.6 Profil / Allergen-Auswahl

```
Mobile:  Vertikale Liste, gruppiert (Top-14 / Top-30)
         Toggle-Switches pro Allergen
Tablet:  2-Spalten Grid, Kategorie-Header
Desktop: Bento-Grid, Checkbox-Groups mit Beschreibungen
         Zusatz-Info: Typische Zutaten pro Allergen (Tooltip)
```

### 6.7 Buttons

| Variante | Styling |
|----------|---------|
| Primary | `bg-zinc-900 text-white` / dark: `bg-zinc-50 text-zinc-900` |
| Secondary | `border border-zinc-300 text-zinc-900` / dark: `border-zinc-700 text-zinc-100` |
| Danger | `bg-red-600 text-white` |
| Ghost | `text-zinc-600 hover:bg-zinc-100` / dark: `text-zinc-400 hover:bg-zinc-800` |
| FAB (Scan) | `bg-rose-600 text-white shadow-lg` / 56px round |

```
Padding: px-4 py-2.5 (default), px-6 py-3 (large)
Border-Radius: rounded-lg (8px)
Font: text-sm font-semibold
Transition: 150ms ease-out (background, transform)
Hover: slight darken + translateY(-1px)
Active: translateY(0) + deeper color
Focus: ring-2 ring-rose-500/20 ring-offset-2
```

### 6.8 Cards

```
Background: bg-white dark:bg-zinc-900
Border: border border-zinc-200 dark:border-zinc-800
Radius: rounded-xl (12px)
Shadow: shadow-sm (default), shadow-md (hover/elevated)
Padding: p-4 (mobile), p-6 (desktop)
Transition: shadow 150ms ease-out on hover
```

### 6.9 Badges / Status-Pills

```
Sicher:  bg-green-100 text-green-800 / dark: bg-green-900/30 text-green-400
Warnung: bg-amber-100 text-amber-800 / dark: bg-amber-900/30 text-amber-400
Gefahr:  bg-red-100 text-red-800 / dark: bg-red-900/30 text-red-400
Info:    bg-zinc-100 text-zinc-700 / dark: bg-zinc-800 text-zinc-300

Form: rounded-full px-2.5 py-0.5 text-xs font-medium
```

---

## 7. Interaktions-Patterns

### 7.1 Scan-Flow

```
MOBILE:
1. User oeffnet App → Home mit Kamera-Preview
2. Barcode kommt ins Bild → Auto-Detect + Vibration
3. Fullscreen-Ampel erscheint (200ms Fade-In)
4. Auto-Expand zu Detail-Sheet nach 1.5s (oder Swipe)
5. "Nochmal scannen" → Zurueck zu Kamera

TABLET:
1. Split-View: Links Kamera, Rechts letztes Ergebnis
2. Barcode erkannt → Rechte Seite aktualisiert sich
3. Kamera bleibt aktiv (kein Screen-Wechsel)
4. Mehrere Produkte hintereinander scannen moeglich

DESKTOP:
1. Webcam-Preview oder Datei-Upload-Zone
2. Ergebnis erscheint als Inline-Card unterhalb
3. History-Liste aktualisiert sich live
4. Keyboard: Enter = Scan bestaetigen, Esc = abbrechen
```

### 7.2 Animationen

| Aktion | Animation | Dauer | Easing |
|--------|-----------|-------|--------|
| Card erscheint | Fade-In + Scale(0.98→1) | 200ms | ease-out |
| Ergebnis-Signal | Scale(0.9→1) + Fade | 250ms | ease-out |
| Sheet expandieren | TranslateY(100%→0) | 300ms | ease-in-out |
| Navigation-Switch | Crossfade | 150ms | ease-out |
| Button Hover | TranslateY(0→-1px) | 150ms | ease-out |
| Badge erscheint | Scale(0→1) | 200ms | spring |
| Skeleton Loading | Shimmer (links→rechts) | 1500ms | linear, infinite |

### 7.3 Feedback-Patterns

| Event | Feedback |
|-------|----------|
| Barcode erkannt | Vibration (50ms) + Sound (optional) + Visueller Flash |
| Scan-Ergebnis GEFAHR | Doppel-Vibration (50ms-pause-50ms) |
| Profil gespeichert | Toast: "Gespeichert" (2s, unten) |
| Netzwerk-Fehler | Toast: "Keine Verbindung" (persistent, dismissable) |
| Leere Suche | Inline-Hinweis unter Suchfeld |

---

## 8. Responsive Verhalten pro Seite

### 8.1 Home / Dashboard

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Kamera-Preview (50%) | Split: Kamera (50%) + Last-Result (50%) | Bento: Kamera + Suche + Statistik + Verlauf |
| Suchfeld | Suchfeld (breiter) | Suchfeld + Keyboard Shortcut Hint |
| Letzte Scans (Horizontal-Scroll) | Letzte Scans (4-er Grid) | Letzte Scans (Tabelle, 5 Eintraege) |

### 8.2 Scan-Ergebnis

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Fullscreen Ampel → Sheet | Side-Panel (50% rechts) | Inline-Card mit Tabelle |
| Produktname + Allergen-Liste | + EAN + Quelle | + Vollstaendige Zutatenliste + Bild |
| 2 Buttons | 3 Buttons | 4 Buttons (+ Kopieren, Teilen) |

### 8.3 Verlauf

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Liste, gruppiert nach Tag | Grid (3-4 Spalten) | Sortierbare Tabelle + Filter + Suche + Export |
| Infinite Scroll | Pagination (12 pro Seite) | Pagination (25 pro Seite) |
| Tap → Detail-Sheet | Tap → Side-Panel | Tap → Inline-Expansion |

### 8.4 Profil

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Vertikal-Liste mit Toggles | 2-Spalten Checkbox-Grid | Bento-Grid mit Kategorie-Cards |
| Sticky Save-Button unten | Save-Button oben rechts | Save-Button oben rechts + Auto-Save |

### 8.5 Legal Pages

| Mobile | Tablet | Desktop |
|--------|--------|---------|
| Full-Width Prose | max-w-2xl centered | max-w-2xl centered + TOC Sidebar |

---

## 9. Accessibility (WCAG 2.2 AA)

| Anforderung | Umsetzung |
|-------------|-----------|
| **Kontrast** | Min. 4.5:1 (Text), 3:1 (grosse Elemente). Ampelfarben auf weissem Text: alle > 4.5:1 |
| **Touch-Targets** | Min. 44x44px (Mobile), 24px Spacing zwischen Targets |
| **Focus-Indicator** | 2px Ring (rose-500/20), offset-2, auf allen interaktiven Elementen |
| **Screen-Reader** | aria-labels fuer Scan-Ergebnis, aria-live="polite" fuer dynamische Updates |
| **Motion** | `prefers-reduced-motion`: Keine Animationen, sofortige State-Changes |
| **Color-Blind** | Ampel-System IMMER mit Icon + Text, nie nur Farbe (✓/⚠/✗) |
| **Keyboard** | Alle Aktionen per Keyboard erreichbar. Tab-Order logisch. Skip-Links. |

---

## 10. Dark Mode

### Strategie: True Dark (nicht invertiert)

```
Light → Dark Mapping:
  white        → zinc-950 (Background)
  zinc-50      → zinc-900 (Surface)
  zinc-100     → zinc-800 (Surface Elevated)
  zinc-200     → zinc-700 (Borders)
  zinc-900     → zinc-50  (Text Primary)
  zinc-500     → zinc-400 (Text Secondary)

Ampelfarben werden NICHT invertiert, sondern leicht aufgehellt:
  green-600 → green-500
  amber-600 → amber-500
  red-600   → red-500

Shadows werden in Dark Mode durch Border ersetzt (shadow unsichtbar auf dark bg).
```

### Umschaltung

```
- System-Default beim ersten Besuch (prefers-color-scheme)
- Toggle in Header/Sidebar (Sun/Moon Icon)
- Praeferenz in localStorage gespeichert
- class="dark" auf <html> Element (Tailwind dark: Variante)
```

---

## 11. Motion & Performance

### Performance-Budgets

| Metrik | Ziel |
|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s (Mobile 4G) |
| Bundle Size (First Load JS) | < 100KB gzipped |

### Skeleton Loading

```
Jede Seite hat ein loading.tsx mit Skeleton:
- Kamera-Bereich: Graues Rechteck mit Shimmer
- Cards: Rounded Rects mit Shimmer
- Text: Horizontale Balken (60%/80%/40% Breite)
- Tabelle: Zeilen-Skeletts mit alternierenden Breiten
```

---

## 12. Komponenten-Inventar

### Atoms

- Button (Primary, Secondary, Ghost, Danger, FAB)
- Badge (Safe, Warning, Danger, Info)
- Input (Text, Search, Number)
- Toggle / Switch
- Icon (Heroicons Set, 20px/24px)
- Spinner / Loader
- Skeleton

### Molecules

- NavItem (Icon + Label + Active-State)
- AllergenChip (Dot + Name + Category-Badge)
- ScanResultMini (Dot + Name + Time)
- SearchField (Icon + Input + Clear-Button)
- Toast (Icon + Message + Dismiss)

### Organisms

- BottomTabBar (3 Tabs + FAB)
- IconRail (Logo + NavItems + Settings)
- Sidebar (Logo + NavGroups + Footer)
- ScannerCard (Viewfinder + Fallback-Inputs)
- ResultSignal (Fullscreen Ampel)
- ResultDetail (Header + AllergenTable + Actions)
- HistoryList (Grouped Cards / Table)
- AllergenGrid (Category-Sections + Toggles)

### Templates

- MobileLayout (Header + Content + BottomBar)
- TabletLayout (Rail + Content + Footer)
- DesktopLayout (Sidebar + Content + Footer)

---

## 13. Implementierungs-Reihenfolge

| Phase | Umfang | Prioritaet |
|-------|--------|-----------|
| **Phase 1** | Mobile-Layout komplett (Bottom-Bar, FAB, Scanner Fullscreen, Result Signal) | HOCH |
| **Phase 2** | Dark Mode korrekt, Farb-System, Badges, Cards | HOCH |
| **Phase 3** | Tablet-Layout (Rail + Split-View) | MITTEL |
| **Phase 4** | Desktop-Layout (Sidebar + Bento + Tabelle) | MITTEL |
| **Phase 5** | Animationen, Transitions, Skeleton-Loading | NIEDRIG |
| **Phase 6** | Desktop-Extras (Keyboard Shortcuts, Drag&Drop, Export) | NIEDRIG |

---

## 14. Referenzen & Inspiration

| Quelle | Was wir uebernehmen |
|--------|-------------------|
| Linear (2026) | Sidebar-Collapse, Keyboard Shortcuts, Clean Typography |
| Vercel Dashboard | Glassmorphism Header, Monospace-Akzente, Bento-Grid |
| Apple Health | Ampelfarben, grosse Statusanzeigen |
| Yuka (Food Scanner) | Scan-Flow, Ergebnis-Card-Design |
| Material Design 3 | Window Size Classes, Adaptive Navigation |
| Tailwind v4 | Container Queries, Mobile-First Breakpoints |
| NNGroup (2026) | Progressive Disclosure, Status Trackers |
| NHS Design System | Accessibility-First, Clear Health Communication |

---

*Dokument erstellt: 29. Mai 2026*
*Naechster Schritt: Freigabe durch Geschaeftsfuehrung, dann Implementierung Phase 1*
