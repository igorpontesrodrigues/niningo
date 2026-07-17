-- =====================================================
-- NININ GO — Seed Data (Dados Iniciais)
-- Execute DEPOIS do 001_initial_schema.sql
-- =====================================================

-- ── 5 VILAS ───────────────────────────────────────────
INSERT INTO villages (id, name, slug, color, symbol, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Vila das Brumas Verdes',    'brumas-verdes',    '#2d7a4a', '🌿', 'Escondida entre florestas densas e névoa eterna. Seus ninjas dominam o vento e a terra.'),
  ('11111111-0000-0000-0000-000000000002', 'Vila das Dunas Eternas',    'dunas-eternas',    '#c87832', '🔥', 'Erguida no coração do deserto. Seus ninjas são mestres do fogo e da resistência.'),
  ('11111111-0000-0000-0000-000000000003', 'Vila das Águas Sombrias',   'aguas-sombrias',   '#2a5080', '🌊', 'Fundada entre os mares do norte. Domina a água e o genjutsu enevoado.'),
  ('11111111-0000-0000-0000-000000000004', 'Vila dos Relâmpagos',       'relampagos',       '#b8960c', '⚡', 'No alto das montanhas tempestuosas. Seus guerreiros são os mais rápidos do mundo.'),
  ('11111111-0000-0000-0000-000000000005', 'Vila das Pedras Sangrentas','pedras-sangrentas','#6b3a7d', '🪨', 'Entalhada nas rochas milenares. Força bruta e segredos ancestrais de pedra.');

-- ── CLÃS (3 por Vila) ──────────────────────────────────
-- Brumas Verdes
INSERT INTO clans (id, village_id, name, trait_description, visual_override) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Clã Kazeryu', 'Linhagem do dragão do vento. Cabelos prateados são a marca da família.', '{"hairColor": "#c0c0c0"}'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Clã Morikai', 'Guardiões da floresta. Olhos verdes profundos revelam sua herança.', '{"eyeColor": "#16a34a"}'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Clã Tsuchida', 'Mestres da terra e da construção. Sem override visual.', '{}');

-- Dunas Eternas
INSERT INTO clans (id, village_id, name, trait_description, visual_override) VALUES
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Clã Hokuen', 'Filhos do sol abrasador. Cabelos ruivos como chamas.', '{"hairColor": "#dc2626"}'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Clã Sabaku', 'Nômades do deserto. Marca de areia dourada nos olhos.', '{"eyeColor": "#d97706"}'),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'Clã Enzan', 'Forjadores de armas do fogo. Pele levemente acobreada pela forja.', '{}');

-- Águas Sombrias
INSERT INTO clans (id, village_id, name, trait_description, visual_override) VALUES
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'Clã Umikage', 'Linhagem dos espelhos d''água. Cabelos azul-escuro como o mar profundo.', '{"hairColor": "#1e40af"}'),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003', 'Clã Kirigiri', 'Assassinos da névoa. Olhos cinza como neblina.', '{"eyeColor": "#6b7280"}'),
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003', 'Clã Namisei', 'Navegadores ancestrais. Sem override visual.', '{}');

-- Relâmpagos
INSERT INTO clans (id, village_id, name, trait_description, visual_override) VALUES
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000004', 'Clã Raikō', 'Descendentes do trovão. Cabelos brancos com fios dourados.', '{"hairColor": "#fbbf24"}'),
  ('22222222-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000004', 'Clã Hayate', 'Os mais velozes entre os ninjas. Olhos âmbar faiscantes.', '{"eyeColor": "#f59e0b"}'),
  ('22222222-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000004', 'Clã Kumoha', 'Estrategistas das alturas. Sem override visual.', '{}');

-- Pedras Sangrentas
INSERT INTO clans (id, village_id, name, trait_description, visual_override) VALUES
  ('22222222-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000005', 'Clã Iwakami', 'Guerreiros de pele de pedra. Cabelos negros como obsidiana.', '{"hairColor": "#1c1917"}'),
  ('22222222-0000-0000-0000-000000000014', '11111111-0000-0000-0000-000000000005', 'Clã Murasaki', 'Alquimistas da terra. Olhos violeta místicos.', '{"eyeColor": "#7c3aed"}'),
  ('22222222-0000-0000-0000-000000000015', '11111111-0000-0000-0000-000000000005', 'Clã Ganban', 'Mineiros das profundezas. Sem override visual.', '{}');

-- ── LOCAIS (3 por Vila) ────────────────────────────────
-- Brumas Verdes
INSERT INTO locations (id, village_id, name, description, level_range_min, level_range_max, is_starting_location) VALUES
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Portão das Brumas', 'A entrada da vila, coberta por névoa eterna. Ninjas novatos iniciam aqui.', 1, 10, TRUE),
  ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Floresta Sussurrante', 'Mata densa com criaturas sombrias. Local de treino intermediário.', 5, 15, FALSE),
  ('33333333-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Pico da Névoa Eterna', 'O cume mais alto, onde o vento conversa com os ninjas mais fortes.', 15, 30, FALSE);

-- Dunas Eternas
INSERT INTO locations (id, village_id, name, description, level_range_min, level_range_max, is_starting_location) VALUES
  ('33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Mercado das Dunas', 'O vibrante centro comercial da vila do deserto.', 1, 10, TRUE),
  ('33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Mar de Areia', 'Dunas intermináveis habitadas por escorpiões gigantes.', 5, 15, FALSE),
  ('33333333-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'Ruínas do Antigo Oásis', 'Ruínas de uma civilização perdida. Segredos e perigos espreitam.', 15, 30, FALSE);

-- Águas Sombrias
INSERT INTO locations (id, village_id, name, description, level_range_min, level_range_max, is_starting_location) VALUES
  ('33333333-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'Porto da Névoa', 'O cais principal da vila aquática. Sempre encoberto por neblina.', 1, 10, TRUE),
  ('33333333-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003', 'Mangue Negro', 'Pântano perigoso cheio de criaturas aquáticas.', 5, 15, FALSE),
  ('33333333-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003', 'Abismo Submarino', 'Profundezas oceânicas reveladas apenas aos mais fortes.', 15, 30, FALSE);

-- Relâmpagos
INSERT INTO locations (id, village_id, name, description, level_range_min, level_range_max, is_starting_location) VALUES
  ('33333333-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000004', 'Praça do Trovão', 'O coração pulsante da vila, onde o ar cheira a eletricidade.', 1, 10, TRUE),
  ('33333333-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000004', 'Encosta da Tempestade', 'Ravinas cortadas por raios constantes.', 5, 15, FALSE),
  ('33333333-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000004', 'Cume dos Deuses do Relâmpago', 'O ponto mais alto, tocado pelo céu. Somente lendas chegam aqui.', 15, 30, FALSE);

-- Pedras Sangrentas
INSERT INTO locations (id, village_id, name, description, level_range_min, level_range_max, is_starting_location) VALUES
  ('33333333-0000-0000-0000-000000000013', '11111111-0000-0000-0000-000000000005', 'Forja Central', 'O coração industrial da vila, onde o metal encontra a pedra.', 1, 10, TRUE),
  ('33333333-0000-0000-0000-000000000014', '11111111-0000-0000-0000-000000000005', 'Cavernas Profundas', 'Labirintos subterrâneos habitados por criaturas de pedra.', 5, 15, FALSE),
  ('33333333-0000-0000-0000-000000000015', '11111111-0000-0000-0000-000000000005', 'Trono das Rochas Santas', 'Câmara ancestral onde o poder da terra concentra-se.', 15, 30, FALSE);

-- ── JUTSUS (3 por natureza de chakra) ─────────────────
-- FOGO
INSERT INTO jutsus (name, description, chakra_nature, damage_multiplier, chakra_cost, rank_required) VALUES
  ('Bola de Fogo', 'Uma esfera de chamas que incendeia o inimigo.', 'fire', 1.3, 10, 'genin'),
  ('Cortina de Fogo', 'Parede de chamas que causa dano em área.', 'fire', 1.6, 20, 'genin'),
  ('Dragão de Chamas', 'Um dragão de fogo devora o inimigo.', 'fire', 2.2, 35, 'chunin');

-- ÁGUA
INSERT INTO jutsus (name, description, chakra_nature, damage_multiplier, chakra_cost, rank_required) VALUES
  ('Lança d''Água', 'Projétil de água pressurizada perfura defesas.', 'water', 1.3, 10, 'genin'),
  ('Prisão Aquática', 'Esfera d''água aprisiona e afoga o inimigo.', 'water', 1.5, 18, 'genin'),
  ('Grande Tsunami', 'Onda colossal devasta tudo no caminho.', 'water', 2.1, 32, 'chunin');

-- VENTO
INSERT INTO jutsus (name, description, chakra_nature, damage_multiplier, chakra_cost, rank_required) VALUES
  ('Faca do Vento', 'Lâminas de ar cortam o inimigo.', 'wind', 1.2, 8, 'genin'),
  ('Vendaval', 'Rajada intensa derruba e causa dano.', 'wind', 1.5, 15, 'genin'),
  ('Grande Esfera de Vento', 'Tornado concentrado destrói tudo.', 'wind', 2.0, 30, 'chunin');

-- TERRA
INSERT INTO jutsus (name, description, chakra_nature, damage_multiplier, chakra_cost, rank_required) VALUES
  ('Lança de Pedra', 'Estalactite de rocha perfura o inimigo.', 'earth', 1.4, 12, 'genin'),
  ('Muralha de Terra', 'Cria uma barreira e golpeia com fragmentos.', 'earth', 1.6, 20, 'genin'),
  ('Golpe Sísmico', 'Abala o chão e fragmentos atingem o alvo.', 'earth', 2.2, 35, 'chunin');

-- RAIO
INSERT INTO jutsus (name, description, chakra_nature, damage_multiplier, chakra_cost, rank_required) VALUES
  ('Descarga Elétrica', 'Choque rápido paralisa momentaneamente.', 'lightning', 1.3, 10, 'genin'),
  ('Lâmina de Raio', 'A mão envolve-se em raios cortantes.', 'lightning', 1.7, 22, 'genin'),
  ('Tempestade Divina', 'Raios múltiplos caem sobre o inimigo.', 'lightning', 2.3, 38, 'chunin');

-- ── MISSÕES D-RANK (5 por local inicial) ──────────────
-- Portão das Brumas (Brumas Verdes)
INSERT INTO missions (name, description, rank, location_id, stamina_cost, duration_minutes, xp_reward, ryo_reward) VALUES
  ('Patrulha do Amanhecer', 'Faça uma ronda pelo perímetro da vila no amanhecer.', 'd', '33333333-0000-0000-0000-000000000001', 3, 10, 15, 10),
  ('Entrega de Pergaminhos', 'Entregue documentos ao escritório do líder.', 'd', '33333333-0000-0000-0000-000000000001', 4, 15, 20, 12),
  ('Captura do Gato Perdido', 'O gato da senhora Emiko fugiu novamente.', 'd', '33333333-0000-0000-0000-000000000001', 2, 8, 12, 8),
  ('Treino de Arremesso', 'Pratique kunais no campo de treino oficial.', 'd', '33333333-0000-0000-0000-000000000001', 5, 20, 25, 15),
  ('Ajuda na Academia', 'Assista estudantes iniciantes no dojo.', 'd', '33333333-0000-0000-0000-000000000001', 3, 12, 18, 10);

-- ── EQUIPAMENTOS BÁSICOS ──────────────────────────────
INSERT INTO equipment (name, type, stats, description, rarity) VALUES
  ('Kunai Simples',        'weapon',     '{"ninjutsu": 1}',                 'A arma padrão de todo ninja iniciante.', 'common'),
  ('Shuriken Set',         'weapon',     '{"speed": 1}',                    'Conjunto de 10 shurikens afiados.', 'common'),
  ('Armadura de Couro',    'armor',      '{"defense": 2}',                  'Proteção básica que não atrapalha o movimento.', 'common'),
  ('Faixa de Cabeça',      'accessory',  '{"hp": 10}',                      'A famosa faixa dos ninjas registrados.', 'common'),
  ('Pergaminho de Cura',   'consumable', '{"hp_restore": 30}',              'Recupera 30 de HP quando usado.', 'common'),
  ('Pílula de Chakra',     'consumable', '{"chakra_restore": 20}',          'Recupera 20 de Chakra quando usado.', 'common');

-- ── LOJA DAS VILAS ────────────────────────────────────
-- Adicionar todos os itens comuns em todas as vilas
INSERT INTO shop_items (village_id, equipment_id, price)
SELECT v.id, e.id, 
  CASE e.name
    WHEN 'Kunai Simples'      THEN 50
    WHEN 'Shuriken Set'       THEN 40
    WHEN 'Armadura de Couro'  THEN 120
    WHEN 'Faixa de Cabeça'    THEN 80
    WHEN 'Pergaminho de Cura' THEN 25
    WHEN 'Pílula de Chakra'   THEN 30
  END as price
FROM villages v
CROSS JOIN equipment e;
