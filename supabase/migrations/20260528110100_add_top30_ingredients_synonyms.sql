-- Migration: Add Top-30 ingredients, mappings, and synonyms
-- Covers: lactose, fructose, histamine, gluten_sensitivity, corn, yeast,
-- coconut, nightshade, legumes, garlic, onion, citrus, stone_fruit, cinnamon, sorbitol, carrageenan

-- ============================================================================
-- INGREDIENTS for Top-30 allergens
-- ============================================================================

-- Fructose-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('fruktose', 'Fruktose', 'de'),
  ('fruchtzucker', 'Fruchtzucker', 'de'),
  ('maissirup', 'Maissirup', 'de'),
  ('high fructose corn syrup', 'High fructose corn syrup', 'en'),
  ('agavendicksaft', 'Agavendicksaft', 'de'),
  ('agavensirup', 'Agavensirup', 'de'),
  ('apfelsaft', 'Apfelsaft', 'de'),
  ('birnensaft', 'Birnensaft', 'de'),
  ('honig', 'Honig', 'de'),
  ('invertzucker', 'Invertzucker', 'de'),
  ('fructose_en', 'Fructose', 'en'),
  ('honey', 'Honey', 'en');

-- Histamine-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('tomatenmark', 'Tomatenmark', 'de'),
  ('tomatenpuere', 'Tomatenpueree', 'de'),
  ('sauerkraut', 'Sauerkraut', 'de'),
  ('rotweinessig', 'Rotweinessig', 'de'),
  ('balsamicoessig', 'Balsamicoessig', 'de'),
  ('hefeextrakt', 'Hefeextrakt', 'de'),
  ('sojasosse', 'Sojasosse', 'de'),
  ('wuerzsosse', 'Wuerzsosse', 'de'),
  ('worcestershiresosse', 'Worcestershiresosse', 'de'),
  ('thunfischkonserve', 'Thunfischkonserve', 'de'),
  ('salami', 'Salami', 'de'),
  ('schinken gereift', 'Schinken gereift', 'de');

-- Corn-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('mais', 'Mais', 'de'),
  ('maismehl', 'Maismehl', 'de'),
  ('maisstaerke', 'Maisstaerke', 'de'),
  ('maisgriesspulversirup', 'Maisgriesspulversirup', 'de'),
  ('popcorn', 'Popcorn', 'de'),
  ('polenta', 'Polenta', 'de'),
  ('dextrose', 'Dextrose', 'de'),
  ('maltodextrin', 'Maltodextrin', 'de'),
  ('corn', 'Corn', 'en'),
  ('cornstarch', 'Cornstarch', 'en'),
  ('corn syrup', 'Corn syrup', 'en'),
  ('maize', 'Maize', 'en');

-- Yeast-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('hefe', 'Hefe', 'de'),
  ('backhefe', 'Backhefe', 'de'),
  ('bierhefe', 'Bierhefe', 'de'),
  ('trockenhefe', 'Trockenhefe', 'de'),
  ('naehrhefe', 'Naehrhefe', 'de'),
  ('yeast', 'Yeast', 'en'),
  ('yeast extract', 'Yeast extract', 'en');

-- Coconut-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('kokosnuss', 'Kokosnuss', 'de'),
  ('kokos', 'Kokos', 'de'),
  ('kokosoel', 'Kokosoel', 'de'),
  ('kokosmilch', 'Kokosmilch', 'de'),
  ('kokosraspeln', 'Kokosraspeln', 'de'),
  ('kokosflocken', 'Kokosflocken', 'de'),
  ('kokosfett', 'Kokosfett', 'de'),
  ('coconut', 'Coconut', 'en'),
  ('coconut oil', 'Coconut oil', 'en'),
  ('coconut milk', 'Coconut milk', 'en');

-- Nightshade-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('tomate', 'Tomate', 'de'),
  ('tomaten', 'Tomaten', 'de'),
  ('paprika', 'Paprika', 'de'),
  ('paprikapulver', 'Paprikapulver', 'de'),
  ('kartoffelstaerke', 'Kartoffelstaerke', 'de'),
  ('kartoffel', 'Kartoffel', 'de'),
  ('aubergine', 'Aubergine', 'de'),
  ('chili', 'Chili', 'de'),
  ('chilipulver', 'Chilipulver', 'de'),
  ('cayennepfeffer', 'Cayennepfeffer', 'de'),
  ('tomato', 'Tomato', 'en'),
  ('pepper', 'Pepper', 'en'),
  ('potato starch', 'Potato starch', 'en'),
  ('eggplant', 'Eggplant', 'en');

-- Legumes-related (excluding peanuts and soy)
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('linsen', 'Linsen', 'de'),
  ('kichererbsen', 'Kichererbsen', 'de'),
  ('bohnen', 'Bohnen', 'de'),
  ('kidneybohnen', 'Kidneybohnen', 'de'),
  ('weisse bohnen', 'Weisse Bohnen', 'de'),
  ('erbsen', 'Erbsen', 'de'),
  ('erbsenprotein', 'Erbsenprotein', 'de'),
  ('hummus', 'Hummus', 'de'),
  ('lentils', 'Lentils', 'en'),
  ('chickpeas', 'Chickpeas', 'en'),
  ('beans', 'Beans', 'en'),
  ('peas', 'Peas', 'en');

-- Garlic-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('knoblauch', 'Knoblauch', 'de'),
  ('knoblauchpulver', 'Knoblauchpulver', 'de'),
  ('knoblauchgranulat', 'Knoblauchgranulat', 'de'),
  ('knoblauchoel', 'Knoblauchoel', 'de'),
  ('garlic', 'Garlic', 'en'),
  ('garlic powder', 'Garlic powder', 'en');

-- Onion-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('zwiebel', 'Zwiebel', 'de'),
  ('zwiebeln', 'Zwiebeln', 'de'),
  ('zwiebelpulver', 'Zwiebelpulver', 'de'),
  ('roestzwiebeln', 'Roestzwiebeln', 'de'),
  ('schalotten', 'Schalotten', 'de'),
  ('lauch', 'Lauch', 'de'),
  ('onion', 'Onion', 'en'),
  ('shallot', 'Shallot', 'en'),
  ('leek', 'Leek', 'en');

-- Citrus-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('zitrone', 'Zitrone', 'de'),
  ('zitronensaft', 'Zitronensaft', 'de'),
  ('orange', 'Orange', 'de'),
  ('orangensaft', 'Orangensaft', 'de'),
  ('limette', 'Limette', 'de'),
  ('grapefruit', 'Grapefruit', 'de'),
  ('zitronenschale', 'Zitronenschale', 'de'),
  ('orangenschale', 'Orangenschale', 'de'),
  ('citronensaeure', 'Citronensaeure', 'de'),
  ('lemon', 'Lemon', 'en'),
  ('orange_en', 'Orange', 'en'),
  ('lime', 'Lime', 'en'),
  ('citric acid', 'Citric acid', 'en');

-- Stone fruit-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('pfirsich', 'Pfirsich', 'de'),
  ('kirsche', 'Kirsche', 'de'),
  ('pflaume', 'Pflaume', 'de'),
  ('aprikose', 'Aprikose', 'de'),
  ('nektarine', 'Nektarine', 'de'),
  ('zwetschge', 'Zwetschge', 'de'),
  ('mirabelle', 'Mirabelle', 'de'),
  ('peach', 'Peach', 'en'),
  ('cherry', 'Cherry', 'en'),
  ('plum', 'Plum', 'en'),
  ('apricot', 'Apricot', 'en');

-- Cinnamon-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('zimt', 'Zimt', 'de'),
  ('zimtpulver', 'Zimtpulver', 'de'),
  ('ceylonzimt', 'Ceylonzimt', 'de'),
  ('cassiazimt', 'Cassiazimt', 'de'),
  ('cinnamon', 'Cinnamon', 'en');

-- Sorbitol-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('sorbit', 'Sorbit', 'de'),
  ('sorbitol_de', 'Sorbitol', 'de'),
  ('e420', 'E420', 'de'),
  ('zuckeralkohol sorbit', 'Zuckeralkohol Sorbit', 'de'),
  ('sorbitol_en', 'Sorbitol', 'en');

-- Carrageenan-related
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('carrageen', 'Carrageen', 'de'),
  ('e407', 'E407', 'de'),
  ('carrageenan_de', 'Carrageenan', 'de'),
  ('carrageenan_en', 'Carrageenan', 'en'),
  ('e407a', 'E407a', 'de');

-- ============================================================================
-- INGREDIENT -> ALLERGEN MAPPINGS for Top-30
-- ============================================================================

-- Lactose mappings (reuse existing milk-related ingredients that specifically indicate lactose)
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'lactose'
AND i.name_normalized IN ('laktose', 'milchzucker', 'lactose');

-- Fructose mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'fructose'
AND i.name_normalized IN (
  'fruktose', 'fruchtzucker', 'maissirup', 'high fructose corn syrup',
  'agavendicksaft', 'agavensirup', 'invertzucker', 'fructose_en'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'probable'
FROM ingredients i, allergens a
WHERE a.code = 'fructose'
AND i.name_normalized IN ('honig', 'honey', 'apfelsaft', 'birnensaft');

-- Histamine mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'histamine'
AND i.name_normalized IN (
  'hefeextrakt', 'sauerkraut', 'rotweinessig', 'balsamicoessig',
  'sojasosse', 'wuerzsosse', 'worcestershiresosse', 'salami', 'schinken gereift'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'probable'
FROM ingredients i, allergens a
WHERE a.code = 'histamine'
AND i.name_normalized IN ('tomatenmark', 'tomatenpuere', 'thunfischkonserve');

-- Corn mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'corn'
AND i.name_normalized IN (
  'mais', 'maismehl', 'maisstaerke', 'popcorn', 'polenta',
  'corn', 'cornstarch', 'corn syrup', 'maize'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'probable'
FROM ingredients i, allergens a
WHERE a.code = 'corn'
AND i.name_normalized IN ('dextrose', 'maltodextrin', 'maissirup', 'maisgriesspulversirup');

-- Yeast mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'yeast'
AND i.name_normalized IN (
  'hefe', 'backhefe', 'bierhefe', 'trockenhefe', 'naehrhefe',
  'yeast', 'yeast extract', 'hefeextrakt'
);

-- Coconut mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'coconut'
AND i.name_normalized IN (
  'kokosnuss', 'kokos', 'kokosoel', 'kokosmilch', 'kokosraspeln',
  'kokosflocken', 'kokosfett', 'coconut', 'coconut oil', 'coconut milk'
);

-- Nightshade mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'nightshade'
AND i.name_normalized IN (
  'tomate', 'tomaten', 'paprika', 'paprikapulver', 'aubergine',
  'chili', 'chilipulver', 'cayennepfeffer',
  'tomato', 'pepper', 'eggplant'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'probable'
FROM ingredients i, allergens a
WHERE a.code = 'nightshade'
AND i.name_normalized IN ('kartoffelstaerke', 'kartoffel', 'potato starch', 'tomatenmark', 'tomatenpuere');

-- Legumes mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'legumes'
AND i.name_normalized IN (
  'linsen', 'kichererbsen', 'bohnen', 'kidneybohnen', 'weisse bohnen',
  'erbsen', 'erbsenprotein', 'hummus',
  'lentils', 'chickpeas', 'beans', 'peas'
);

-- Garlic mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'garlic'
AND i.name_normalized IN (
  'knoblauch', 'knoblauchpulver', 'knoblauchgranulat', 'knoblauchoel',
  'garlic', 'garlic powder'
);

-- Onion mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'onion'
AND i.name_normalized IN (
  'zwiebel', 'zwiebeln', 'zwiebelpulver', 'roestzwiebeln', 'schalotten',
  'onion', 'shallot'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'probable'
FROM ingredients i, allergens a
WHERE a.code = 'onion'
AND i.name_normalized IN ('lauch', 'leek');

-- Citrus mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'citrus'
AND i.name_normalized IN (
  'zitrone', 'zitronensaft', 'orange', 'orangensaft', 'limette',
  'grapefruit', 'zitronenschale', 'orangenschale',
  'lemon', 'orange_en', 'lime'
);

INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'possible'
FROM ingredients i, allergens a
WHERE a.code = 'citrus'
AND i.name_normalized IN ('citronensaeure', 'citric acid');

-- Stone fruit mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'stone_fruit'
AND i.name_normalized IN (
  'pfirsich', 'kirsche', 'pflaume', 'aprikose', 'nektarine',
  'zwetschge', 'mirabelle',
  'peach', 'cherry', 'plum', 'apricot'
);

-- Cinnamon mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'cinnamon'
AND i.name_normalized IN (
  'zimt', 'zimtpulver', 'ceylonzimt', 'cassiazimt', 'cinnamon'
);

-- Sorbitol mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'sorbitol'
AND i.name_normalized IN (
  'sorbit', 'sorbitol_de', 'e420', 'zuckeralkohol sorbit', 'sorbitol_en'
);

-- Carrageenan mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'carrageenan'
AND i.name_normalized IN (
  'carrageen', 'e407', 'carrageenan_de', 'carrageenan_en', 'e407a'
);

-- ============================================================================
-- SYNONYMS for Top-30 allergens
-- ============================================================================

-- Fructose synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Fruchtsüsse', 'fruchtsüsse'),
  ('Fruktosesirup', 'fruktosesirup'),
  ('Fruktose-Glukose-Sirup', 'fruktose-glukose-sirup'),
  ('Glukose-Fruktose-Sirup', 'glukose-fruktose-sirup'),
  ('HFCS', 'hfcs'),
  ('Isoglukose', 'isoglukose')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'fruktose';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Agavennektar', 'agavennektar'),
  ('Agave', 'agave')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'agavendicksaft';

-- Histamine synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Hefe-Extrakt', 'hefe-extrakt'),
  ('Autolysiertes Hefeextrakt', 'autolysiertes hefeextrakt'),
  ('Wuerze', 'wuerze')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'hefeextrakt';

-- Corn synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Speisestaerke', 'speisestaerke'),
  ('Modifizierte Staerke', 'modifizierte staerke'),
  ('Staerke', 'staerke')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'maisstaerke';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Traubenzucker', 'traubenzucker'),
  ('Glucose', 'glucose'),
  ('Glukose', 'glukose')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'dextrose';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Maisgriess', 'maisgriess'),
  ('Maiskoerner', 'maiskoerner'),
  ('Suessmais', 'suessmais')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'mais';

-- Coconut synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Kokosnussmilch', 'kokosnussmilch'),
  ('Kokosnussoel', 'kokosnussoel'),
  ('Kokoscreme', 'kokoscreme'),
  ('Kokoswasser', 'kokoswasser')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'kokos';

-- Nightshade synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Getrocknete Tomaten', 'getrocknete tomaten'),
  ('Tomatenstuecke', 'tomatenstuecke'),
  ('Tomatenpulver', 'tomatenpulver'),
  ('Tomatenflocken', 'tomatenflocken')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'tomaten';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Suesskartoffel', 'suesskartoffel'),
  ('Kartoffelflocken', 'kartoffelflocken'),
  ('Kartoffelmehl', 'kartoffelmehl'),
  ('Kartoffelpueree', 'kartoffelpueree')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'kartoffel';

-- Cinnamon synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Zimtstange', 'zimtstange'),
  ('Zimtrinde', 'zimtrinde'),
  ('Gemahlener Zimt', 'gemahlener zimt')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'zimt';

-- Sorbitol synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Zuckeralkohol', 'zuckeralkohol'),
  ('Zuckeraustauschstoff Sorbit', 'zuckeraustauschstoff sorbit'),
  ('Sorbitsirup', 'sorbitsirup')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sorbit';

-- Carrageenan synonyms
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Verdickungsmittel E407', 'verdickungsmittel e407'),
  ('Verdickungsmittel Carrageen', 'verdickungsmittel carrageen'),
  ('Irisch Moos', 'irisch moos')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'carrageen';
