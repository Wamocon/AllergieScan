-- Seed data: Top-14 EU allergens, ingredients, and synonyms
-- This file populates the allergen detection system with initial data

-- ============================================================================
-- 1. TOP-14 EU MANDATORY ALLERGENS (LMIV Annex II)
-- ============================================================================

INSERT INTO allergens (code, name_de, name_en, category, description_de, description_en, sort_order) VALUES
  ('gluten', 'Gluten (glutenhaltiges Getreide)', 'Gluten (cereals containing gluten)', 'top14', 'Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut und deren Hybridstaemme', 'Wheat, rye, barley, oats, spelt, kamut and their hybridised strains', 1),
  ('crustaceans', 'Krebstiere', 'Crustaceans', 'top14', 'Krebstiere und daraus hergestellte Erzeugnisse', 'Crustaceans and products thereof', 2),
  ('eggs', 'Eier', 'Eggs', 'top14', 'Eier und daraus hergestellte Erzeugnisse', 'Eggs and products thereof', 3),
  ('fish', 'Fisch', 'Fish', 'top14', 'Fisch und daraus hergestellte Erzeugnisse', 'Fish and products thereof', 4),
  ('peanuts', 'Erdnuesse', 'Peanuts', 'top14', 'Erdnuesse und daraus hergestellte Erzeugnisse', 'Peanuts and products thereof', 5),
  ('soy', 'Soja', 'Soy', 'top14', 'Sojabohnen und daraus hergestellte Erzeugnisse', 'Soybeans and products thereof', 6),
  ('milk', 'Milch', 'Milk', 'top14', 'Milch und daraus hergestellte Erzeugnisse (einschliesslich Laktose)', 'Milk and products thereof (including lactose)', 7),
  ('nuts', 'Schalenfruechte', 'Tree nuts', 'top14', 'Mandeln, Haselnuesse, Walnuesse, Kaschunuesse, Pecannuesse, Paranuesse, Pistazien, Macadamia', 'Almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia', 8),
  ('celery', 'Sellerie', 'Celery', 'top14', 'Sellerie und daraus hergestellte Erzeugnisse', 'Celery and products thereof', 9),
  ('mustard', 'Senf', 'Mustard', 'top14', 'Senf und daraus hergestellte Erzeugnisse', 'Mustard and products thereof', 10),
  ('sesame', 'Sesam', 'Sesame', 'top14', 'Sesamsamen und daraus hergestellte Erzeugnisse', 'Sesame seeds and products thereof', 11),
  ('sulphites', 'Schwefeldioxid und Sulfite', 'Sulphur dioxide and sulphites', 'top14', 'Schwefeldioxid und Sulfite in Konzentrationen von mehr als 10 mg/kg oder 10 mg/l', 'Sulphur dioxide and sulphites at concentrations of more than 10 mg/kg or 10 mg/l', 12),
  ('lupin', 'Lupinen', 'Lupin', 'top14', 'Lupinen und daraus hergestellte Erzeugnisse', 'Lupin and products thereof', 13),
  ('molluscs', 'Weichtiere', 'Molluscs', 'top14', 'Weichtiere und daraus hergestellte Erzeugnisse', 'Molluscs and products thereof', 14);

-- ============================================================================
-- 2. INGREDIENTS (normalized base entries)
-- ============================================================================

-- Gluten-related ingredients
INSERT INTO ingredients (name_normalized, name_original, language) VALUES
  ('weizenmehl', 'Weizenmehl', 'de'),
  ('weizen', 'Weizen', 'de'),
  ('roggenmehl', 'Roggenmehl', 'de'),
  ('roggen', 'Roggen', 'de'),
  ('gerste', 'Gerste', 'de'),
  ('gerstenmalz', 'Gerstenmalz', 'de'),
  ('hafer', 'Hafer', 'de'),
  ('haferflocken', 'Haferflocken', 'de'),
  ('dinkel', 'Dinkel', 'de'),
  ('dinkelmehl', 'Dinkelmehl', 'de'),
  ('kamut', 'Kamut', 'de'),
  ('hartweizengriess', 'Hartweizengriess', 'de'),
  ('weizenstaerke', 'Weizenstaerke', 'de'),
  ('weizengluten', 'Weizengluten', 'de'),
  ('weizenkleie', 'Weizenkleie', 'de'),
  ('paniermehl', 'Paniermehl', 'de'),
  ('semmelbrösel', 'Semmelbrösel', 'de'),
  ('couscous', 'Couscous', 'de'),
  ('bulgur', 'Bulgur', 'de'),
  ('seitan', 'Seitan', 'de'),
  ('wheat flour', 'Wheat flour', 'en'),
  ('wheat', 'Wheat', 'en'),
  ('rye', 'Rye', 'en'),
  ('barley', 'Barley', 'en'),
  ('oats', 'Oats', 'en'),
  ('spelt', 'Spelt', 'en'),
  ('semolina', 'Semolina', 'en'),
  -- Milk-related ingredients
  ('milch', 'Milch', 'de'),
  ('vollmilch', 'Vollmilch', 'de'),
  ('magermilch', 'Magermilch', 'de'),
  ('milchpulver', 'Milchpulver', 'de'),
  ('vollmilchpulver', 'Vollmilchpulver', 'de'),
  ('magermilchpulver', 'Magermilchpulver', 'de'),
  ('butter', 'Butter', 'de'),
  ('buttermilch', 'Buttermilch', 'de'),
  ('sahne', 'Sahne', 'de'),
  ('rahm', 'Rahm', 'de'),
  ('kaese', 'Kaese', 'de'),
  ('joghurt', 'Joghurt', 'de'),
  ('molke', 'Molke', 'de'),
  ('molkenpulver', 'Molkenpulver', 'de'),
  ('kasein', 'Kasein', 'de'),
  ('laktose', 'Laktose', 'de'),
  ('milcheiweiss', 'Milcheiweiss', 'de'),
  ('suessrahmbutter', 'Suessrahmbutter', 'de'),
  ('sauerrahmbutter', 'Sauerrahmbutter', 'de'),
  ('kondensmilch', 'Kondensmilch', 'de'),
  ('milchzucker', 'Milchzucker', 'de'),
  ('quark', 'Quark', 'de'),
  ('frischkaese', 'Frischkaese', 'de'),
  ('schmelzkaese', 'Schmelzkaese', 'de'),
  ('milk', 'Milk', 'en'),
  ('butter_en', 'Butter', 'en'),
  ('cheese', 'Cheese', 'en'),
  ('cream', 'Cream', 'en'),
  ('whey', 'Whey', 'en'),
  ('casein', 'Casein', 'en'),
  ('lactose', 'Lactose', 'en'),
  ('yogurt', 'Yogurt', 'en'),
  -- Egg-related ingredients
  ('ei', 'Ei', 'de'),
  ('eier', 'Eier', 'de'),
  ('eigelb', 'Eigelb', 'de'),
  ('eiweiss', 'Eiweiss', 'de'),
  ('eipulver', 'Eipulver', 'de'),
  ('volleipulver', 'Volleipulver', 'de'),
  ('eierlikor', 'Eierlikor', 'de'),
  ('lysozym', 'Lysozym', 'de'),
  ('huehnerei', 'Huehnerei', 'de'),
  ('fluessigei', 'Fluessigei', 'de'),
  ('egg', 'Egg', 'en'),
  ('egg yolk', 'Egg yolk', 'en'),
  ('egg white', 'Egg white', 'en'),
  ('albumen', 'Albumen', 'en'),
  -- Soy-related ingredients
  ('soja', 'Soja', 'de'),
  ('sojaoel', 'Sojaoel', 'de'),
  ('sojalecithin', 'Sojalecithin', 'de'),
  ('sojamehl', 'Sojamehl', 'de'),
  ('sojaeiweiss', 'Sojaeiweiss', 'de'),
  ('sojasauce', 'Sojasauce', 'de'),
  ('tofu', 'Tofu', 'de'),
  ('edamame', 'Edamame', 'de'),
  ('sojabohnen', 'Sojabohnen', 'de'),
  ('sojaprotein', 'Sojaprotein', 'de'),
  ('soy', 'Soy', 'en'),
  ('soybean', 'Soybean', 'en'),
  ('soy lecithin', 'Soy lecithin', 'en'),
  ('soy sauce', 'Soy sauce', 'en'),
  -- Peanut-related ingredients
  ('erdnuss', 'Erdnuss', 'de'),
  ('erdnuesse', 'Erdnuesse', 'de'),
  ('erdnussoel', 'Erdnussoel', 'de'),
  ('erdnussbutter', 'Erdnussbutter', 'de'),
  ('erdnussmehl', 'Erdnussmehl', 'de'),
  ('peanut', 'Peanut', 'en'),
  ('peanut oil', 'Peanut oil', 'en'),
  ('groundnut', 'Groundnut', 'en'),
  -- Tree nuts-related ingredients
  ('mandeln', 'Mandeln', 'de'),
  ('haselnuesse', 'Haselnuesse', 'de'),
  ('walnuesse', 'Walnuesse', 'de'),
  ('cashewnuesse', 'Cashewnuesse', 'de'),
  ('pistazien', 'Pistazien', 'de'),
  ('macadamia', 'Macadamia', 'de'),
  ('paranuesse', 'Paranuesse', 'de'),
  ('pecannuesse', 'Pecannuesse', 'de'),
  ('mandelmehl', 'Mandelmehl', 'de'),
  ('haselnussoel', 'Haselnussoel', 'de'),
  ('walnussoel', 'Walnussoel', 'de'),
  ('marzipan', 'Marzipan', 'de'),
  ('nougat', 'Nougat', 'de'),
  ('nussmus', 'Nussmus', 'de'),
  ('almond', 'Almond', 'en'),
  ('hazelnut', 'Hazelnut', 'en'),
  ('walnut', 'Walnut', 'en'),
  ('cashew', 'Cashew', 'en'),
  ('pistachio', 'Pistachio', 'en'),
  ('pecan', 'Pecan', 'en'),
  ('brazil nut', 'Brazil nut', 'en'),
  -- Fish-related ingredients
  ('fisch', 'Fisch', 'de'),
  ('lachs', 'Lachs', 'de'),
  ('thunfisch', 'Thunfisch', 'de'),
  ('sardine', 'Sardine', 'de'),
  ('sardellen', 'Sardellen', 'de'),
  ('anchovis', 'Anchovis', 'de'),
  ('fischoel', 'Fischoel', 'de'),
  ('fischsauce', 'Fischsauce', 'de'),
  ('fischgelatine', 'Fischgelatine', 'de'),
  ('fish', 'Fish', 'en'),
  ('salmon', 'Salmon', 'en'),
  ('tuna', 'Tuna', 'en'),
  ('anchovy', 'Anchovy', 'en'),
  -- Crustacean-related ingredients
  ('garnelen', 'Garnelen', 'de'),
  ('krabben', 'Krabben', 'de'),
  ('shrimps', 'Shrimps', 'de'),
  ('hummer', 'Hummer', 'de'),
  ('languste', 'Languste', 'de'),
  ('krebs', 'Krebs', 'de'),
  ('krebsfleisch', 'Krebsfleisch', 'de'),
  ('shrimp', 'Shrimp', 'en'),
  ('crab', 'Crab', 'en'),
  ('lobster', 'Lobster', 'en'),
  ('prawn', 'Prawn', 'en'),
  -- Celery-related ingredients
  ('sellerie', 'Sellerie', 'de'),
  ('selleriesalz', 'Selleriesalz', 'de'),
  ('selleriepulver', 'Selleriepulver', 'de'),
  ('knollensellerie', 'Knollensellerie', 'de'),
  ('staudensellerie', 'Staudensellerie', 'de'),
  ('celery', 'Celery', 'en'),
  ('celeriac', 'Celeriac', 'en'),
  -- Mustard-related ingredients
  ('senf', 'Senf', 'de'),
  ('senfmehl', 'Senfmehl', 'de'),
  ('senfsaat', 'Senfsaat', 'de'),
  ('senfpulver', 'Senfpulver', 'de'),
  ('senfoel', 'Senfoel', 'de'),
  ('mustard', 'Mustard', 'en'),
  ('mustard seed', 'Mustard seed', 'en'),
  -- Sesame-related ingredients
  ('sesam', 'Sesam', 'de'),
  ('sesamoel', 'Sesamoel', 'de'),
  ('sesamsamen', 'Sesamsamen', 'de'),
  ('sesampaste', 'Sesampaste', 'de'),
  ('tahini', 'Tahini', 'de'),
  ('sesame', 'Sesame', 'en'),
  ('sesame oil', 'Sesame oil', 'en'),
  ('tahini_en', 'Tahini', 'en'),
  -- Sulphites-related ingredients
  ('schwefeldioxid', 'Schwefeldioxid', 'de'),
  ('sulfite', 'Sulfite', 'de'),
  ('sulfit', 'Sulfit', 'de'),
  ('kaliummetabisulfit', 'Kaliummetabisulfit', 'de'),
  ('natriumsulfit', 'Natriumsulfit', 'de'),
  ('sulphur dioxide', 'Sulphur dioxide', 'en'),
  ('sulphites', 'Sulphites', 'en'),
  ('sulfites_en', 'Sulfites', 'en'),
  -- Lupin-related ingredients
  ('lupine', 'Lupine', 'de'),
  ('lupinen', 'Lupinen', 'de'),
  ('lupinenmehl', 'Lupinenmehl', 'de'),
  ('lupineneiweiss', 'Lupineneiweiss', 'de'),
  ('lupinenprotein', 'Lupinenprotein', 'de'),
  ('lupin', 'Lupin', 'en'),
  ('lupin flour', 'Lupin flour', 'en'),
  -- Mollusc-related ingredients
  ('muscheln', 'Muscheln', 'de'),
  ('austern', 'Austern', 'de'),
  ('tintenfisch', 'Tintenfisch', 'de'),
  ('calamari', 'Calamari', 'de'),
  ('schnecken', 'Schnecken', 'de'),
  ('oktopus', 'Oktopus', 'de'),
  ('austernsauce', 'Austernsauce', 'de'),
  ('mussel', 'Mussel', 'en'),
  ('oyster', 'Oyster', 'en'),
  ('squid', 'Squid', 'en'),
  ('clam', 'Clam', 'en'),
  ('scallop', 'Scallop', 'en'),
  ('snail', 'Snail', 'en');

-- ============================================================================
-- 3. INGREDIENT -> ALLERGEN MAPPING
-- ============================================================================

-- Gluten mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'gluten'
AND i.name_normalized IN (
  'weizenmehl', 'weizen', 'roggenmehl', 'roggen', 'gerste', 'gerstenmalz',
  'hafer', 'haferflocken', 'dinkel', 'dinkelmehl', 'kamut', 'hartweizengriess',
  'weizenstaerke', 'weizengluten', 'weizenkleie', 'paniermehl', 'semmelbrösel',
  'couscous', 'bulgur', 'seitan',
  'wheat flour', 'wheat', 'rye', 'barley', 'oats', 'spelt', 'semolina'
);

-- Milk mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'milk'
AND i.name_normalized IN (
  'milch', 'vollmilch', 'magermilch', 'milchpulver', 'vollmilchpulver',
  'magermilchpulver', 'butter', 'buttermilch', 'sahne', 'rahm', 'kaese',
  'joghurt', 'molke', 'molkenpulver', 'kasein', 'laktose', 'milcheiweiss',
  'suessrahmbutter', 'sauerrahmbutter', 'kondensmilch', 'milchzucker',
  'quark', 'frischkaese', 'schmelzkaese',
  'milk', 'butter_en', 'cheese', 'cream', 'whey', 'casein', 'lactose', 'yogurt'
);

-- Egg mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'eggs'
AND i.name_normalized IN (
  'ei', 'eier', 'eigelb', 'eiweiss', 'eipulver', 'volleipulver',
  'eierlikor', 'lysozym', 'huehnerei', 'fluessigei',
  'egg', 'egg yolk', 'egg white', 'albumen'
);

-- Soy mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'soy'
AND i.name_normalized IN (
  'soja', 'sojaoel', 'sojalecithin', 'sojamehl', 'sojaeiweiss',
  'sojasauce', 'tofu', 'edamame', 'sojabohnen', 'sojaprotein',
  'soy', 'soybean', 'soy lecithin', 'soy sauce'
);

-- Peanut mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'peanuts'
AND i.name_normalized IN (
  'erdnuss', 'erdnuesse', 'erdnussoel', 'erdnussbutter', 'erdnussmehl',
  'peanut', 'peanut oil', 'groundnut'
);

-- Tree nuts mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'nuts'
AND i.name_normalized IN (
  'mandeln', 'haselnuesse', 'walnuesse', 'cashewnuesse', 'pistazien',
  'macadamia', 'paranuesse', 'pecannuesse', 'mandelmehl', 'haselnussoel',
  'walnussoel', 'marzipan', 'nougat', 'nussmus',
  'almond', 'hazelnut', 'walnut', 'cashew', 'pistachio', 'pecan', 'brazil nut'
);

-- Fish mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'fish'
AND i.name_normalized IN (
  'fisch', 'lachs', 'thunfisch', 'sardine', 'sardellen', 'anchovis',
  'fischoel', 'fischsauce', 'fischgelatine',
  'fish', 'salmon', 'tuna', 'anchovy'
);

-- Crustacean mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'crustaceans'
AND i.name_normalized IN (
  'garnelen', 'krabben', 'shrimps', 'hummer', 'languste', 'krebs', 'krebsfleisch',
  'shrimp', 'crab', 'lobster', 'prawn'
);

-- Celery mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'celery'
AND i.name_normalized IN (
  'sellerie', 'selleriesalz', 'selleriepulver', 'knollensellerie', 'staudensellerie',
  'celery', 'celeriac'
);

-- Mustard mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'mustard'
AND i.name_normalized IN (
  'senf', 'senfmehl', 'senfsaat', 'senfpulver', 'senfoel',
  'mustard', 'mustard seed'
);

-- Sesame mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'sesame'
AND i.name_normalized IN (
  'sesam', 'sesamoel', 'sesamsamen', 'sesampaste', 'tahini',
  'sesame', 'sesame oil', 'tahini_en'
);

-- Sulphites mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'sulphites'
AND i.name_normalized IN (
  'schwefeldioxid', 'sulfite', 'sulfit', 'kaliummetabisulfit', 'natriumsulfit',
  'sulphur dioxide', 'sulphites', 'sulfites_en'
);

-- Lupin mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'lupin'
AND i.name_normalized IN (
  'lupine', 'lupinen', 'lupinenmehl', 'lupineneiweiss', 'lupinenprotein',
  'lupin', 'lupin flour'
);

-- Mollusc mappings
INSERT INTO ingredient_allergen_map (ingredient_id, allergen_id, confidence)
SELECT i.id, a.id, 'definite'
FROM ingredients i, allergens a
WHERE a.code = 'molluscs'
AND i.name_normalized IN (
  'muscheln', 'austern', 'tintenfisch', 'calamari', 'schnecken', 'oktopus', 'austernsauce',
  'mussel', 'oyster', 'squid', 'clam', 'scallop', 'snail'
);

-- ============================================================================
-- 4. SYNONYMS (additional spellings and variations)
-- ============================================================================

-- The ingredients table already contains the primary normalized forms.
-- Synonyms table adds ADDITIONAL variant spellings that map to the same ingredient.

-- Gluten synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Weizenmehl Type 405', 'weizenmehl type 405'),
  ('Weizenmehl Type 550', 'weizenmehl type 550'),
  ('Weizenmehl Type 1050', 'weizenmehl type 1050'),
  ('Weizenvollkornmehl', 'weizenvollkornmehl'),
  ('Weizenvollkornschrot', 'weizenvollkornschrot')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'weizenmehl';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Weizengriess', 'weizengriess'),
  ('Hartweizenmehl', 'hartweizenmehl'),
  ('Durumweizen', 'durumweizen'),
  ('Durum', 'durum'),
  ('Griess', 'griess'),
  ('Hartweizen', 'hartweizen')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'hartweizengriess';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Roggenmehl Type 815', 'roggenmehl type 815'),
  ('Roggenmehl Type 997', 'roggenmehl type 997'),
  ('Roggenvollkornmehl', 'roggenvollkornmehl'),
  ('Roggenschrot', 'roggenschrot')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'roggenmehl';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Gerstenflocken', 'gerstenflocken'),
  ('Gerstengraupen', 'gerstengraupen'),
  ('Gerstenmalzextrakt', 'gerstenmalzextrakt'),
  ('Malzextrakt', 'malzextrakt'),
  ('Malz', 'malz'),
  ('Braumalz', 'braumalz')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'gerstenmalz';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Dinkelvollkornmehl', 'dinkelvollkornmehl'),
  ('Dinkelgriess', 'dinkelgriess'),
  ('Dinkelflocken', 'dinkelflocken'),
  ('Gruenkern', 'gruenkern')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'dinkelmehl';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Brotkrumen', 'brotkrumen'),
  ('Semmelmehl', 'semmelmehl'),
  ('Panade', 'panade'),
  ('Panadebrosel', 'panadebrosel')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'paniermehl';

-- Milk synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Kuhmilch', 'kuhmilch'),
  ('Frischmilch', 'frischmilch'),
  ('H-Milch', 'h-milch'),
  ('Trinkmilch', 'trinkmilch'),
  ('Weidemilch', 'weidemilch'),
  ('Alpenmilch', 'alpenmilch'),
  ('Biomilch', 'biomilch')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'milch';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Suessrahm', 'suessrahm'),
  ('Sauerrahm', 'sauerrahm'),
  ('Schlagsahne', 'schlagsahne'),
  ('Schlagrahm', 'schlagrahm'),
  ('Schmand', 'schmand'),
  ('Saure Sahne', 'saure sahne'),
  ('Creme fraiche', 'creme fraiche'),
  ('Obers', 'obers')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sahne';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Natriumkaseinat', 'natriumkaseinat'),
  ('Kaliumkaseinat', 'kaliumkaseinat'),
  ('Kaseinat', 'kaseinat'),
  ('Milchprotein', 'milchprotein')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'kasein';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Molkeneiweiss', 'molkeneiweiss'),
  ('Molkenprotein', 'molkenprotein'),
  ('Suesssmolke', 'suessmolke'),
  ('Sauermolke', 'sauermolke'),
  ('Molkekonzentrat', 'molkekonzentrat'),
  ('Whey', 'whey_de')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'molke';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Emmentaler', 'emmentaler'),
  ('Gouda', 'gouda'),
  ('Parmesan', 'parmesan'),
  ('Mozzarella', 'mozzarella'),
  ('Cheddar', 'cheddar'),
  ('Edamer', 'edamer'),
  ('Camembert', 'camembert'),
  ('Brie', 'brie'),
  ('Tilsiter', 'tilsiter'),
  ('Appenzeller', 'appenzeller')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'kaese';

-- Egg synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Freilandei', 'freilandei'),
  ('Freilandeier', 'freilandeier'),
  ('Bio-Eier', 'bio-eier'),
  ('Bodenhaltungseier', 'bodenhaltungseier'),
  ('Trockenvollei', 'trockenvollei'),
  ('Trockenei', 'trockenei')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'eier';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Eiklar', 'eiklar'),
  ('Eischnee', 'eischnee'),
  ('Ovolactin', 'ovolactin'),
  ('Ovalbumin', 'ovalbumin')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'eiweiss';

-- Soy synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Lecithin (Soja)', 'lecithin (soja)'),
  ('Lecithin', 'lecithin'),
  ('E322', 'e322'),
  ('Emulgator: Sojalecithin', 'emulgator: sojalecithin'),
  ('Emulgator Lecithin (aus Soja)', 'emulgator lecithin (aus soja)')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sojalecithin';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Sojabohne', 'sojabohne'),
  ('Soja-Granulat', 'soja-granulat'),
  ('Sojaflocken', 'sojaflocken'),
  ('Sojaschnitt', 'sojaschnitt'),
  ('Texturiertes Sojaprotein', 'texturiertes sojaprotein')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sojabohnen';

-- Peanut synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Erdnusskerne', 'erdnusskerne'),
  ('Erdnussmus', 'erdnussmus'),
  ('Erdnusspaste', 'erdnusspaste'),
  ('Gerostete Erdnuesse', 'gerostete erdnuesse'),
  ('Erdnussflocken', 'erdnussflocken'),
  ('Arachis hypogaea', 'arachis hypogaea')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'erdnuesse';

-- Tree nuts synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Mandel', 'mandel'),
  ('Mandelblattchen', 'mandelblattchen'),
  ('Mandelstifte', 'mandelstifte'),
  ('Gemahlene Mandeln', 'gemahlene mandeln'),
  ('Mandelmilch', 'mandelmilch'),
  ('Mandelmus', 'mandelmus')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'mandeln';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Haselnuss', 'haselnuss'),
  ('Haselnusskerne', 'haselnusskerne'),
  ('Gemahlene Haselnuesse', 'gemahlene haselnuesse'),
  ('Haselnussmus', 'haselnussmus'),
  ('Haselnusspaste', 'haselnusspaste')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'haselnuesse';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Walnuss', 'walnuss'),
  ('Walnusskerne', 'walnusskerne'),
  ('Baumnuss', 'baumnuss')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'walnuesse';

INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Marcipan', 'marcipan'),
  ('Marzipanrohmasse', 'marzipanrohmasse'),
  ('Marzipanmasse', 'marzipanmasse')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'marzipan';

-- Celery synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Sellerieknolle', 'sellerieknolle'),
  ('Selleriegruen', 'selleriegruen'),
  ('Selleriesaft', 'selleriesaft')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sellerie';

-- Mustard synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Dijon-Senf', 'dijon-senf'),
  ('Senfkoerner', 'senfkoerner'),
  ('Mittelscharfer Senf', 'mittelscharfer senf'),
  ('Suesser Senf', 'suesser senf')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'senf';

-- Sesame synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Sesamkoerner', 'sesamkoerner'),
  ('Schwarzer Sesam', 'schwarzer sesam'),
  ('Gerosteter Sesam', 'gerosteter sesam')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'sesam';

-- Sulphites synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('E220', 'e220'),
  ('E221', 'e221'),
  ('E222', 'e222'),
  ('E223', 'e223'),
  ('E224', 'e224'),
  ('E226', 'e226'),
  ('E227', 'e227'),
  ('E228', 'e228'),
  ('Natriummetabisulfit', 'natriummetabisulfit'),
  ('Kaliumdisulfit', 'kaliumdisulfit')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'schwefeldioxid';

-- Fish synonyms (DE)
INSERT INTO synonyms (term, term_normalized, ingredient_id, language)
SELECT s.term, s.term_normalized, i.id, 'de'
FROM ingredients i,
(VALUES
  ('Forelle', 'forelle'),
  ('Kabeljau', 'kabeljau'),
  ('Hering', 'hering'),
  ('Makrele', 'makrele'),
  ('Seelachs', 'seelachs'),
  ('Pangasius', 'pangasius'),
  ('Zander', 'zander'),
  ('Scholle', 'scholle'),
  ('Heilbutt', 'heilbutt'),
  ('Dorsch', 'dorsch')
) AS s(term, term_normalized)
WHERE i.name_normalized = 'fisch';

-- ============================================================================
-- 5. TEST PRODUCTS (realistic examples from German supermarkets)
-- ============================================================================

INSERT INTO products (ean, name, brand, ingredients_text, source, data_quality) VALUES
  ('4000521005702', 'Milka Alpenmilch Schokolade', 'Milka', 'Zucker, Kakaobutter, Magermilchpulver, Kakaomasse, Suessrahmbutter, Emulgator (Sojalecithin), Haselnussmark, Aroma', 'openfoodfacts', 'verified'),
  ('4017100024009', 'Haribo Goldbären', 'Haribo', 'Glukosesirup, Zucker, Gelatine, Saeuerungsmittel: Citronensaeure, Frucht- und Pflanzenkonzentrate (Saflor, Spirulina, Apfel, Holunderbeere, Orange, Zitrone, Mango, Passionsfrucht, schwarze Johannisbeere, Aronia, Traube, Karottenkonzentrat), Aroma, Ueberzugsmittel: Bienenwachs weiss und gelb, Carnaubawachs', 'openfoodfacts', 'verified'),
  ('4001724819806', 'Dr. Oetker Ristorante Pizza Mozzarella', 'Dr. Oetker', 'Weizenmehl, Tomatenmark, Mozzarella (19%), Wasser, pflanzliches Oel (Raps), Zucker, Hefe, Speisesalz, Basilikum, Oregano', 'openfoodfacts', 'verified'),
  ('40084015', 'Nutella', 'Ferrero', 'Zucker, Palmoel, Haselnuesse (13%), Magermilchpulver (8.7%), fettarmer Kakao (7.4%), Emulgator: Lecithine (Soja), Vanillin', 'openfoodfacts', 'verified'),
  ('4305615100036', 'Gut und Guenstig Haferflocken', 'Gut und Guenstig', 'Haferflocken aus Vollkornhafer', 'openfoodfacts', 'verified');
