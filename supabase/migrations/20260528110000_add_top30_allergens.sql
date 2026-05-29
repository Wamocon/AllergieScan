-- Migration: Add Top-30 extended allergens
-- These go beyond the 14 EU mandatory allergens (LMIV) and represent
-- additional common allergens and intolerances relevant in DACH.
-- Top-30 hits result in "Vorsicht" (yellow), NOT "Nicht geeignet" (red).

INSERT INTO allergens (code, name_de, name_en, category, description_de, description_en, sort_order) VALUES
  ('lactose', 'Laktoseintoleranz', 'Lactose intolerance', 'top30', 'Milchzucker-Unvertraeglichkeit (nicht immunologisch, aber klinisch relevant)', 'Milk sugar intolerance (not immunological but clinically relevant)', 15),
  ('fructose', 'Fruktosemalabsorption', 'Fructose malabsorption', 'top30', 'Fruchtzucker-Unvertraeglichkeit', 'Fruit sugar intolerance', 16),
  ('histamine', 'Histaminintoleranz', 'Histamine intolerance', 'top30', 'Unvertraeglichkeit gegenueber histaminreichen Lebensmitteln', 'Intolerance to histamine-rich foods', 17),
  ('gluten_sensitivity', 'Glutensensitivitaet (nicht-zoeliakie)', 'Non-celiac gluten sensitivity', 'top30', 'Glutenempfindlichkeit ohne Zoeliakie-Diagnose', 'Gluten sensitivity without celiac diagnosis', 18),
  ('corn', 'Mais', 'Corn', 'top30', 'Maisallergie oder -unvertraeglichkeit', 'Corn allergy or intolerance', 19),
  ('yeast', 'Hefe', 'Yeast', 'top30', 'Hefeallergie oder -unvertraeglichkeit', 'Yeast allergy or intolerance', 20),
  ('coconut', 'Kokosnuss', 'Coconut', 'top30', 'Kokosnussallergie', 'Coconut allergy', 21),
  ('nightshade', 'Nachtschattengewaechse', 'Nightshades', 'top30', 'Unvertraeglichkeit gegenueber Nachtschattengewaechsen (Tomate, Paprika, Kartoffel, Aubergine)', 'Intolerance to nightshade plants (tomato, pepper, potato, eggplant)', 22),
  ('legumes', 'Huelsenfruechte', 'Legumes', 'top30', 'Allergie gegen Huelsenfruechte (ausser Erdnuesse und Soja, die separat gefuehrt werden)', 'Legume allergy (excluding peanuts and soy, tracked separately)', 23),
  ('garlic', 'Knoblauch', 'Garlic', 'top30', 'Knoblauchallergie oder -unvertraeglichkeit', 'Garlic allergy or intolerance', 24),
  ('onion', 'Zwiebel', 'Onion', 'top30', 'Zwiebelallergie oder -unvertraeglichkeit', 'Onion allergy or intolerance', 25),
  ('citrus', 'Zitrusfruechte', 'Citrus fruits', 'top30', 'Allergie oder Unvertraeglichkeit gegenueber Zitrusfruechten', 'Allergy or intolerance to citrus fruits', 26),
  ('stone_fruit', 'Steinobst', 'Stone fruit', 'top30', 'Allergie gegen Steinobst (Pfirsich, Kirsche, Pflaume, Aprikose)', 'Stone fruit allergy (peach, cherry, plum, apricot)', 27),
  ('cinnamon', 'Zimt', 'Cinnamon', 'top30', 'Zimtallergie (haeufige Kontaktallergie und orale Reaktion)', 'Cinnamon allergy (common contact allergy and oral reaction)', 28),
  ('sorbitol', 'Sorbit', 'Sorbitol', 'top30', 'Sorbitunvertraeglichkeit', 'Sorbitol intolerance', 29),
  ('carrageenan', 'Carrageen', 'Carrageenan', 'top30', 'Unvertraeglichkeit gegenueber dem Verdickungsmittel E407', 'Intolerance to thickening agent E407', 30);
