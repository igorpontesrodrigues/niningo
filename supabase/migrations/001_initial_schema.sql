-- =====================================================
-- NININ GO — Schema Inicial do Banco de Dados
-- Execute no Supabase SQL Editor
-- =====================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── VILAS ─────────────────────────────────────────────
CREATE TABLE villages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL,         -- hex color ex: #2d7a4a
  symbol      TEXT,                  -- emoji ou URL de SVG
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── CLÃS ──────────────────────────────────────────────
CREATE TABLE clans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id       UUID REFERENCES villages(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  trait_description TEXT,
  visual_override  JSONB DEFAULT '{}', -- ex: {"hairColor": "#ff69b4"}
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── LOCAIS / MAPA ─────────────────────────────────────
CREATE TABLE locations (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id           UUID REFERENCES villages(id),
  name                 TEXT NOT NULL,
  description          TEXT,
  level_range_min      INT DEFAULT 1,
  level_range_max      INT DEFAULT 10,
  is_starting_location BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── PERSONAGENS ───────────────────────────────────────
CREATE TABLE characters (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  village_id              UUID REFERENCES villages(id),
  clan_id                 UUID REFERENCES clans(id),
  chakra_nature           TEXT NOT NULL CHECK (chakra_nature IN ('fire','water','wind','earth','lightning')),
  current_location_id     UUID REFERENCES locations(id),
  level                   INT DEFAULT 1,
  xp                      INT DEFAULT 0,
  ryo                     INT DEFAULT 100,
  rank                    TEXT DEFAULT 'genin' CHECK (rank IN ('genin','chunin','jonin','kage')),
  rested_bonus_expires_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ── STATS DO PERSONAGEM ───────────────────────────────
CREATE TABLE character_stats (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
  hp           INT DEFAULT 100,
  max_hp       INT DEFAULT 100,
  chakra       INT DEFAULT 50,
  max_chakra   INT DEFAULT 50,
  stamina      INT DEFAULT 20,
  max_stamina  INT DEFAULT 20,
  strength     INT DEFAULT 5,
  defense      INT DEFAULT 5,
  speed        INT DEFAULT 5,
  ninjutsu     INT DEFAULT 5,
  taijutsu     INT DEFAULT 5,
  genjutsu     INT DEFAULT 5
);

-- ── APARÊNCIA DO PERSONAGEM ───────────────────────────
CREATE TABLE character_appearance (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
  hair_color   TEXT DEFAULT '#3a1f00',
  eye_color    TEXT DEFAULT '#3b82f6',
  skin_tone    TEXT DEFAULT '#f5d0a9',
  outfit_id    TEXT DEFAULT 'default'
);

-- ── STATUS ONLINE/OFFLINE ─────────────────────────────
CREATE TABLE character_online_status (
  character_id     UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  is_online        BOOLEAN DEFAULT FALSE,
  last_seen_at     TIMESTAMPTZ DEFAULT NOW(),
  offline_npc_state TEXT CHECK (offline_npc_state IN ('sleeping', 'wandering', NULL))
);

-- ── SESSÕES DE STAMINA ────────────────────────────────
CREATE TABLE stamina_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id     UUID REFERENCES characters(id) ON DELETE CASCADE,
  went_offline_at  TIMESTAMPTZ,
  came_online_at   TIMESTAMPTZ,
  stamina_recovered INT DEFAULT 0,
  rested_bonus     BOOLEAN DEFAULT FALSE
);

-- ── JUTSUS ────────────────────────────────────────────
CREATE TABLE jutsus (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  chakra_nature   TEXT NOT NULL,
  damage_multiplier FLOAT DEFAULT 1.0,
  chakra_cost     INT DEFAULT 10,
  rank_required   TEXT DEFAULT 'genin',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── JUTSUS DO PERSONAGEM ──────────────────────────────
CREATE TABLE character_jutsus (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  jutsu_id     UUID REFERENCES jutsus(id),
  unlocked_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, jutsu_id)
);

-- ── EQUIPAMENTOS ──────────────────────────────────────
CREATE TABLE equipment (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('weapon','armor','accessory','consumable')),
  stats       JSONB DEFAULT '{}',  -- ex: {"strength": 3, "defense": 2}
  description TEXT,
  rarity      TEXT DEFAULT 'common' CHECK (rarity IN ('common','uncommon','rare','epic')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── INVENTÁRIO DO PERSONAGEM ──────────────────────────
CREATE TABLE character_inventory (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id),
  quantity     INT DEFAULT 1,
  equipped     BOOLEAN DEFAULT FALSE
);

-- ── MISSÕES ───────────────────────────────────────────
CREATE TABLE missions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  description      TEXT,
  rank             TEXT DEFAULT 'd' CHECK (rank IN ('d','c','b','a','s')),
  location_id      UUID REFERENCES locations(id),
  stamina_cost     INT DEFAULT 5,
  duration_minutes INT DEFAULT 15,
  xp_reward        INT DEFAULT 20,
  ryo_reward       INT DEFAULT 15,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── MISSÕES DO PERSONAGEM ─────────────────────────────
CREATE TABLE character_missions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  mission_id   UUID REFERENCES missions(id),
  status       TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','failed')),
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completes_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ── LOG DE VIAGEM ─────────────────────────────────────
CREATE TABLE travel_logs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id      UUID REFERENCES characters(id) ON DELETE CASCADE,
  from_location_id  UUID REFERENCES locations(id),
  to_location_id    UUID REFERENCES locations(id),
  mode              TEXT NOT NULL CHECK (mode IN ('safe','normal','fast')),
  pvp_chance        FLOAT DEFAULT 0,
  victories         INT DEFAULT 0,
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  arrives_at        TIMESTAMPTZ,
  status            TEXT DEFAULT 'traveling' CHECK (status IN ('traveling','arrived','interrupted'))
);

-- ── ITENS DA LOJA ─────────────────────────────────────
CREATE TABLE shop_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id   UUID REFERENCES villages(id),
  equipment_id UUID REFERENCES equipment(id),
  price        INT NOT NULL,
  stock        INT DEFAULT -1  -- -1 = infinito
);

-- ── AMIZADES ─────────────────────────────────────────
CREATE TABLE friendships (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  receiver_id  UUID REFERENCES characters(id) ON DELETE CASCADE,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);

-- ── CHAT (histórico) ──────────────────────────────────
CREATE TABLE chat_messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  location_id  UUID REFERENCES locations(id),
  channel      TEXT NOT NULL CHECK (channel IN ('local','village','clan','squad','global')),
  content      TEXT NOT NULL,
  meta         JSONB DEFAULT '{}',  -- villageId, clanId, etc.
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_jutsus ENABLE ROW LEVEL SECURITY;

-- Usuário só pode ver/editar seu próprio personagem
CREATE POLICY "Own character only"
  ON characters FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Own stats only"
  ON character_stats FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

CREATE POLICY "Own appearance only"
  ON character_appearance FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

-- Tabelas públicas (leitura)
CREATE POLICY "Public read villages" ON villages FOR SELECT USING (true);
CREATE POLICY "Public read clans" ON clans FOR SELECT USING (true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read jutsus" ON jutsus FOR SELECT USING (true);
CREATE POLICY "Public read missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Public read equipment" ON equipment FOR SELECT USING (true);
CREATE POLICY "Public read shop_items" ON shop_items FOR SELECT USING (true);
CREATE POLICY "Public read chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Public read character_online_status" ON character_online_status FOR SELECT USING (true);

-- Índices para performance
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_village ON characters(village_id);
CREATE INDEX idx_character_stats_character ON character_stats(character_id);
CREATE INDEX idx_chat_messages_location ON chat_messages(location_id, channel, created_at DESC);
CREATE INDEX idx_travel_logs_character ON travel_logs(character_id, status);
CREATE INDEX idx_stamina_sessions_character ON stamina_sessions(character_id, went_offline_at DESC);
