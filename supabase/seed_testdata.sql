-- ============================================================================
-- TEST DATA: Users, profiles, and additional products for manual testing
-- Run after migrations and seed.sql: npx supabase db reset (includes all)
-- Or run standalone: psql -h 127.0.0.1 -p 54332 -U postgres -d postgres -f supabase/seed_testdata.sql
-- ============================================================================

-- ============================================================================
-- 1. TEST USERS (via Supabase auth.users - password: Test1234!)
-- ============================================================================

-- Test user 1: Has Top-14 allergies (milk, nuts, gluten)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test-top14@allergiescan.local',
  crypt('Test1234!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Tester Top14"}',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"test-top14@allergiescan.local"}',
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(), now(), now()
) ON CONFLICT DO NOTHING;

-- Test user 2: Has Top-30 allergies (fructose, histamine, onion, citrus)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test-top30@allergiescan.local',
  crypt('Test1234!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Tester Top30"}',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub":"22222222-2222-2222-2222-222222222222","email":"test-top30@allergiescan.local"}',
  'email',
  '22222222-2222-2222-2222-222222222222',
  now(), now(), now()
) ON CONFLICT DO NOTHING;

-- Test user 3: Has mixed allergies (both Top-14 + Top-30)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test-mixed@allergiescan.local',
  crypt('Test1234!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Tester Mixed"}',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '{"sub":"33333333-3333-3333-3333-333333333333","email":"test-mixed@allergiescan.local"}',
  'email',
  '33333333-3333-3333-3333-333333333333',
  now(), now(), now()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. USER PROFILES with allergen configs
-- (trigger auto-creates profile on user insert, we update allergen_config)
-- ============================================================================

-- User 1: milk (critical), nuts (critical), gluten (high)
UPDATE user_profiles
SET allergen_config = (
  SELECT jsonb_agg(jsonb_build_object(
    'allergen_id', a.id,
    'allergen_code', a.code,
    'risk_level', CASE a.code
      WHEN 'milk' THEN 'critical'
      WHEN 'nuts' THEN 'critical'
      WHEN 'gluten' THEN 'high'
    END
  ))
  FROM allergens a WHERE a.code IN ('milk', 'nuts', 'gluten')
)
WHERE id = '11111111-1111-1111-1111-111111111111';

-- User 2: fructose (high), histamine (high), onion (medium), citrus (medium)
UPDATE user_profiles
SET allergen_config = (
  SELECT jsonb_agg(jsonb_build_object(
    'allergen_id', a.id,
    'allergen_code', a.code,
    'risk_level', CASE a.code
      WHEN 'fructose' THEN 'high'
      WHEN 'histamine' THEN 'high'
      WHEN 'onion' THEN 'medium'
      WHEN 'citrus' THEN 'medium'
    END
  ))
  FROM allergens a WHERE a.code IN ('fructose', 'histamine', 'onion', 'citrus')
)
WHERE id = '22222222-2222-2222-2222-222222222222';

-- User 3: milk (critical), peanuts (critical), histamine (high), coconut (medium), corn (medium)
UPDATE user_profiles
SET allergen_config = (
  SELECT jsonb_agg(jsonb_build_object(
    'allergen_id', a.id,
    'allergen_code', a.code,
    'risk_level', CASE a.code
      WHEN 'milk' THEN 'critical'
      WHEN 'peanuts' THEN 'critical'
      WHEN 'histamine' THEN 'high'
      WHEN 'coconut' THEN 'medium'
      WHEN 'corn' THEN 'medium'
    END
  ))
  FROM allergens a WHERE a.code IN ('milk', 'peanuts', 'histamine', 'coconut', 'corn')
)
WHERE id = '33333333-3333-3333-3333-333333333333';

-- ============================================================================
-- 3. ADDITIONAL TEST PRODUCTS (covering Top-30 scenarios)
-- ============================================================================

INSERT INTO products (ean, name, brand, ingredients_text, source, data_quality) VALUES

-- Product with histamine triggers (salami, tomatoes)
('9999000000001', 'Steinofen Salamipizza', 'Testmarke', 'Weizenmehl, Wasser, Tomatenmark (14%), Mozzarella, Salami (8%, Schweinefleisch, Speisesalz, Gewuerze), Olivenoel, Hefe, Zucker, Speisesalz, Oregano, Knoblauchpulver', 'manual', 'unverified'),

-- Product with fructose triggers (agave, honey, apple juice)
('9999000000002', 'Bio Fruchtriegel Apfel-Honig', 'Testmarke', 'Haferflocken (35%), Agavendicksaft (20%), getrocknete Aepfel (15%), Honig (10%), Apfelsaft, Rosinen, Sonnenblumenkerne, Zimt, Meersalz', 'manual', 'unverified'),

-- Product with coconut + citrus triggers
('9999000000003', 'Tropical Smoothie Bowl Mix', 'Testmarke', 'Kokosraspeln (25%), gefriergetrocknete Mango, Kokosmilchpulver (15%), Zitronensaft, Orangenschale, Chiasamen, Hanfsamen, Vanille', 'manual', 'unverified'),

-- Product with corn (hidden as maltodextrin/dextrose)
('9999000000004', 'Protein Riegel Schoko-Crisp', 'Testmarke', 'Milchprotein, Maltodextrin, Kakaobutter, Dextrose, Reiscrisps, pflanzliches Fett, Emulgator Sojalecithin, Aroma, Suessstoff Sucralose', 'manual', 'unverified'),

-- Product with nightshade (paprika, tomato, potato starch)
('9999000000005', 'Paprika Chips', 'Testmarke', 'Kartoffeln, Sonnenblumenoel, Paprikapulver (5%), Zucker, Speisesalz, Zwiebelpulver, Tomatenpulver, Hefeextrakt, Knoblauchpulver, Chilipulver, Raucharoma', 'manual', 'unverified'),

-- Product with onion + garlic triggers
('9999000000006', 'Asia Wok Sauce', 'Testmarke', 'Sojasosse (Wasser, Sojabohnen, Weizenmehl, Speisesalz), Zucker, Roestzwiebeln (10%), Knoblauchgranulat (5%), Sesamoel, Ingwer, Chili, Staerke, Worcestershiresosse', 'manual', 'unverified'),

-- Product with sorbitol (sugar-free gum)
('9999000000007', 'Zahnpflege Kaugummi Minze', 'Testmarke', 'Suessstoffe (Sorbit, Xylit, Mannitol, Aspartam, Acesulfam-K), Kaumasse, Aromen, Feuchthaltemittel E422, Emulgator Sojalecithin, Farbstoff E171, Ueberzugsmittel E903', 'manual', 'unverified'),

-- Product with carrageenan (plant milk)
('9999000000008', 'Hafer Barista Drink', 'Testmarke', 'Wasser, Hafer (10%), Sonnenblumenoel, Stabilisator Carrageen (E407), Calciumcarbonat, Speisesalz, Vitamine (D2, B12)', 'manual', 'unverified'),

-- Product that is SAFE for most profiles (plain rice)
('9999000000009', 'Basmati Reis', 'Testmarke', 'Basmatireis, langkoernig, geschaelt', 'manual', 'verified'),

-- Product with stone fruit (jam)
('9999000000010', 'Aprikosen Konfituere extra', 'Testmarke', 'Aprikosen (50%), Zucker, Geliermittel Pektin, Citronensaeure, Zitronensaft', 'manual', 'unverified'),

-- Product with legumes (hummus)
('9999000000011', 'Hummus Classic', 'Testmarke', 'Kichererbsen (60%), Sesammus (Tahini, 15%), Wasser, Olivenoel, Zitronensaft, Knoblauch, Speisesalz, Kreuzkuemmel', 'manual', 'unverified'),

-- Complex product that triggers multiple Top-14 AND Top-30 simultaneously
('9999000000012', 'Curry Fertiggericht Asia Style', 'Testmarke', 'Kokosmilch (25%), Haehnchenfleisch (20%), Reis, Zwiebeln, Paprika, Erdnuesse (3%), Sojasosse (Wasser, Sojabohnen, Weizen, Salz), Kokosfett, Knoblauch, Ingwer, Currypaste (Chili, Zitronengras, Knoblauch, Schalotten, Garnelenpaste), Zucker, Fischsosse, Koriander, Limettensaft', 'manual', 'unverified');
