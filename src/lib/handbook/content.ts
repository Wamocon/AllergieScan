/**
 * Single source of truth for the in-app handbook content.
 * Used by:
 *  - /help page (rendered as searchable HTML)
 *  - /api/handbook/pdf route (rendered as real PDF document)
 *
 * Localised content keyed by locale ('de' | 'en').
 */

export type HandbookBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'h3'; text: string }

export interface HandbookSection {
  id: string
  title: string
  intro: string
  blocks: HandbookBlock[]
}

export interface Handbook {
  title: string
  subtitle: string
  version: string
  sections: HandbookSection[]
}

const DE: Handbook = {
  title: 'AllergieScan Handbuch',
  subtitle: 'Sicher einkaufen mit Allergie - Schritt fuer Schritt',
  version: '1.0',
  sections: [
    {
      id: 'einleitung',
      title: 'Einleitung',
      intro: 'Was AllergieScan ist und fuer wen es gemacht wurde.',
      blocks: [
        { type: 'p', text: 'AllergieScan hilft Menschen mit Lebensmittelallergien oder Unvertraeglichkeiten, im Alltag schnell zu erkennen, ob ein Produkt zu ihnen passt. Du scannst einen Barcode, suchst ein Produkt oder fuegst die Zutatenliste als Text ein - die App prueft sofort, ob etwas darin deine Allergene enthaelt.' },
        { type: 'p', text: 'Die App ist eine Entscheidungshilfe. Sie ersetzt keine aerztliche Beratung und keinen Blick auf die Verpackung. Im Zweifel pruefst du die Zutatenliste immer selbst.' },
      ],
    },
    {
      id: 'erste-schritte',
      title: 'Erste Schritte',
      intro: 'In drei Minuten startklar.',
      blocks: [
        { type: 'ol', items: [
          'Konto erstellen: E-Mail und Passwort, kein weiteres Onboarding noetig.',
          'Wizard: Trage deinen Namen ein und waehle deine Allergene aus den EU-14 sowie optional aus den erweiterten 30 Allergenen.',
          'Erster Scan: Tippe in der unteren Leiste auf den gruenen Scan-Button und probiere alle drei Eingabearten aus.',
        ] },
        { type: 'note', text: 'Du kannst dein Profil jederzeit unter "Profil" anpassen. Aenderungen wirken sich sofort auf alle neuen Scans aus.' },
      ],
    },
    {
      id: 'allergieprofil',
      title: 'Dein Allergieprofil',
      intro: 'Wie das Profil funktioniert und was die Risikostufen bedeuten.',
      blocks: [
        { type: 'p', text: 'AllergieScan unterscheidet zwei Allergen-Gruppen: die 14 EU-Pflichtallergene nach LMIV (Gluten, Eier, Fisch, Erdnuesse, Soja, Milch, Schalenfruechte, Sellerie, Senf, Sesam, Schwefeldioxid, Lupinen, Weichtiere, Krebstiere) und 30 erweiterte Allergene und Unvertraeglichkeiten (z.B. Histamin, Fructose, Laktose, Pilze).' },
        { type: 'h3', text: 'Risikostufen' },
        { type: 'ul', items: [
          'Kritisch: Hohes Risiko (z.B. Anaphylaxie). Wird im Ergebnis als "Nicht geeignet" angezeigt.',
          'Hoch: Reaktion sicher zu erwarten. Wird ebenfalls als Gefahr gewertet.',
          'Mittel: Geringere Beschwerden moeglich. Erscheint im Ergebnis als Warnung.',
        ] },
        { type: 'note', text: 'Auch wenn ein Allergen nicht in deinem Profil steht, kann es als Warnung erscheinen - etwa wenn Spuren angegeben sind.' },
      ],
    },
    {
      id: 'scannen',
      title: 'Produkte pruefen',
      intro: 'Drei Wege fuehren zum Ergebnis: Suche, Barcode, Text.',
      blocks: [
        { type: 'h3', text: 'Suche' },
        { type: 'p', text: 'Tippe einen Produktnamen ein. Die App durchsucht die Open Food Facts Datenbank und zeigt passende Treffer. Tippe auf einen Treffer, um die Zutatenliste sofort gegen dein Profil zu pruefen.' },
        { type: 'h3', text: 'Barcode' },
        { type: 'p', text: 'Erlaube den Kamerazugriff und halte den EAN-Strichcode in den Sucher. Die App liest den Code aus und holt die Daten aus Open Food Facts. Du kannst den Code auch manuell eingeben, falls die Kamera nicht verfuegbar ist.' },
        { type: 'h3', text: 'Text' },
        { type: 'p', text: 'Tippe oder fuege die Zutatenliste direkt ein - praktisch bei Eigenmarken oder Produkten, die nicht in der Datenbank stehen. Die Pruefung erfolgt sofort und lokal anhand deiner Allergenliste.' },
      ],
    },
    {
      id: 'ergebnis',
      title: 'Das Ergebnis verstehen',
      intro: 'Was die drei Ampel-Farben bedeuten.',
      blocks: [
        { type: 'ul', items: [
          'Gruen / Geeignet: Keines deiner Allergene wurde in der Zutatenliste erkannt.',
          'Gelb / Vorsicht: Es gibt einen Hinweis - etwa eine Spurenangabe oder eine erweiterte Unvertraeglichkeit.',
          'Rot / Nicht geeignet: Mindestens ein EU-Pflichtallergen aus deinem Profil ist enthalten.',
        ] },
        { type: 'p', text: 'Unter dem Ergebnis siehst du die erkannten Allergene mit Quelle (Zutat, Synonym, Spurenangabe) und ggf. unbekannte Zutaten, die wir nicht eindeutig zuordnen konnten.' },
        { type: 'note', text: 'Pruefe bei einer roten oder gelben Bewertung immer das Originaletikett des Produkts. Hersteller koennen Rezepturen aendern.' },
      ],
    },
    {
      id: 'verlauf',
      title: 'Verlauf',
      intro: 'Was du gescannt hast - jederzeit nachschlagbar.',
      blocks: [
        { type: 'p', text: 'Im Verlauf siehst du deine letzten 50 Scans mit Ampel, Datum und gefundenen Allergenen. Du kannst jeden Eintrag oeffnen und die Detailansicht erneut aufrufen.' },
        { type: 'p', text: 'Der Verlauf wird DSGVO-konform in deinem Account gespeichert. Du kannst ihn jederzeit loeschen.' },
      ],
    },
    {
      id: 'datenschutz',
      title: 'Datenschutz und Sicherheit',
      intro: 'Was wir speichern und warum.',
      blocks: [
        { type: 'p', text: 'Dein Allergieprofil zaehlt nach DSGVO Art. 9 als besondere personenbezogene Daten (Gesundheitsdaten). Wir verarbeiten diese ausschliesslich, um dir die Pruefung anzubieten. Daten liegen verschluesselt in der EU.' },
        { type: 'ul', items: [
          'Du kannst dein Konto und alle Daten jederzeit loeschen.',
          'Wir geben keine Daten an Dritte weiter.',
          'Produktdaten kommen von Open Food Facts, einer offenen Lebensmitteldatenbank.',
        ] },
      ],
    },
    {
      id: 'faq',
      title: 'Haeufige Fragen',
      intro: 'Antworten auf die wichtigsten Fragen.',
      blocks: [
        { type: 'h3', text: 'Warum findet die App ein Produkt nicht?' },
        { type: 'p', text: 'Open Food Facts ist eine Community-Datenbank. Manche regionale Produkte fehlen oder haben keine Zutatenliste. Nutze in diesem Fall die Texteingabe.' },
        { type: 'h3', text: 'Kann ich die App offline nutzen?' },
        { type: 'p', text: 'Die Pruefung selbst laeuft schnell. Fuer die Produktsuche und den Barcode brauchst du eine Internetverbindung.' },
        { type: 'h3', text: 'Kann ich mein Profil exportieren?' },
        { type: 'p', text: 'Ja - auf der Profilseite findest du den Export deiner Daten als JSON. Das gleiche gilt fuer den Verlauf.' },
      ],
    },
  ],
}

const EN: Handbook = {
  title: 'AllergieScan Handbook',
  subtitle: 'Shop safely with allergies, step by step',
  version: '1.0',
  sections: [
    {
      id: 'einleitung',
      title: 'Introduction',
      intro: 'What AllergieScan is and who it is for.',
      blocks: [
        { type: 'p', text: 'AllergieScan helps people with food allergies or intolerances quickly check whether a product is safe for them. You scan a barcode, search a product or paste an ingredients list, and the app instantly tells you whether any of your allergens are present.' },
        { type: 'p', text: 'The app is a decision aid. It does not replace medical advice or reading the label. When in doubt, always check the original packaging.' },
      ],
    },
    {
      id: 'erste-schritte',
      title: 'Getting started',
      intro: 'Ready in three minutes.',
      blocks: [
        { type: 'ol', items: [
          'Create an account: email and password, no other onboarding required.',
          'Wizard: enter your name and pick your allergens from the EU-14 list and optionally from the extended 30 allergens.',
          'First scan: tap the green scan button in the bottom bar and try all three input modes.',
        ] },
        { type: 'note', text: 'You can update your profile any time. Changes apply to all new scans immediately.' },
      ],
    },
    {
      id: 'allergieprofil',
      title: 'Your allergy profile',
      intro: 'How the profile works and what the risk levels mean.',
      blocks: [
        { type: 'p', text: 'AllergieScan distinguishes two groups: the 14 EU-mandatory allergens under LMIV (gluten, eggs, fish, peanuts, soy, milk, tree nuts, celery, mustard, sesame, sulfites, lupin, molluscs, crustaceans) and 30 extended allergens and intolerances (e.g. histamine, fructose, lactose, fungi).' },
        { type: 'h3', text: 'Risk levels' },
        { type: 'ul', items: [
          'Critical: high risk (e.g. anaphylaxis). Shown as "Not suitable" in the result.',
          'High: reaction expected. Also rated as danger.',
          'Medium: milder symptoms possible. Shown as a warning.',
        ] },
        { type: 'note', text: 'Even allergens not on your profile may appear as warnings - for example when traces are declared.' },
      ],
    },
    {
      id: 'scannen',
      title: 'Checking products',
      intro: 'Three ways: search, barcode, text.',
      blocks: [
        { type: 'h3', text: 'Search' },
        { type: 'p', text: 'Type a product name. The app queries Open Food Facts and shows matches. Tap a result to instantly check its ingredients against your profile.' },
        { type: 'h3', text: 'Barcode' },
        { type: 'p', text: 'Grant camera access and aim at the EAN barcode. The app reads the code and fetches the data. You can also enter the code manually.' },
        { type: 'h3', text: 'Text' },
        { type: 'p', text: 'Type or paste the ingredients list directly - useful for store brands or products not in the database. The check runs locally against your allergen list.' },
      ],
    },
    {
      id: 'ergebnis',
      title: 'Understanding the result',
      intro: 'What the three traffic-light colours mean.',
      blocks: [
        { type: 'ul', items: [
          'Green / Safe: none of your allergens were detected in the list.',
          'Yellow / Caution: there is a hint - traces, an extended intolerance, or a synonym match.',
          'Red / Not suitable: at least one EU-mandatory allergen from your profile is present.',
        ] },
        { type: 'p', text: 'Below the result you see the detected allergens with their source (ingredient, synonym, trace declaration) and any unknown ingredients we could not map confidently.' },
        { type: 'note', text: 'For yellow or red results, always check the original packaging. Manufacturers can change recipes.' },
      ],
    },
    {
      id: 'verlauf',
      title: 'History',
      intro: 'What you have scanned - always at hand.',
      blocks: [
        { type: 'p', text: 'The history shows your last 50 scans with traffic light, date and detected allergens. You can open any entry to revisit the details.' },
        { type: 'p', text: 'The history is stored in your account in compliance with GDPR. You can delete it at any time.' },
      ],
    },
    {
      id: 'datenschutz',
      title: 'Privacy and security',
      intro: 'What we store and why.',
      blocks: [
        { type: 'p', text: 'Your allergy profile is special category personal data under GDPR Art. 9 (health data). We process it only to provide the check. Data is stored encrypted in the EU.' },
        { type: 'ul', items: [
          'You can delete your account and all data at any time.',
          'We do not share data with third parties.',
          'Product data comes from Open Food Facts, an open food database.',
        ] },
      ],
    },
    {
      id: 'faq',
      title: 'Frequently asked questions',
      intro: 'Answers to the most common questions.',
      blocks: [
        { type: 'h3', text: 'Why is a product not found?' },
        { type: 'p', text: 'Open Food Facts is a community database. Some regional products are missing or lack ingredient lists. In that case, use the text input.' },
        { type: 'h3', text: 'Can I use the app offline?' },
        { type: 'p', text: 'The check itself is fast. For search and barcode you need an internet connection.' },
        { type: 'h3', text: 'Can I export my profile?' },
        { type: 'p', text: 'Yes - the profile page lets you export your data as JSON. The same applies to your history.' },
      ],
    },
  ],
}

export function getHandbook(locale: string): Handbook {
  return locale === 'en' ? EN : DE
}
