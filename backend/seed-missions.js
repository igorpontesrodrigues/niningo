import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedMissions() {
  console.log('Fetching locations...');
  const { data: locations, error: locErr } = await supabase.from('locations').select('id, name');
  if (locErr) {
    console.error('Error fetching locations:', locErr);
    return;
  }

  const missionsToInsert = [];

  for (const loc of locations) {
    missionsToInsert.push({
      name: `Limpar Terreno de Treinamento (${loc.name})`,
      description: 'Uma tarefa simples para iniciantes. Ajude a limpar os campos de treinamento locais.',
      rank: 'd',
      location_id: loc.id,
      stamina_cost: 5,
      duration_minutes: 1, // 1 min for fast testing
      xp_reward: 25,
      ryo_reward: 15
    });

    missionsToInsert.push({
      name: `Escoltar Comerciante Local`,
      description: 'Proteja um comerciante de ameaças pequenas enquanto ele viaja pelos arredores.',
      rank: 'd',
      location_id: loc.id,
      stamina_cost: 8,
      duration_minutes: 3,
      xp_reward: 45,
      ryo_reward: 30
    });

    missionsToInsert.push({
      name: `Rastrear Bandidos de Rank C`,
      description: 'Um grupo de bandidos foi avistado nos arredores. Localize o acampamento deles.',
      rank: 'c',
      location_id: loc.id,
      stamina_cost: 15,
      duration_minutes: 10,
      xp_reward: 120,
      ryo_reward: 80
    });
  }

  console.log('Inserting', missionsToInsert.length, 'missions...');
  const { error: insertErr } = await supabase.from('missions').insert(missionsToInsert);
  
  if (insertErr) {
    console.error('Error inserting missions:', insertErr);
  } else {
    console.log('Missions seeded successfully!');
  }
}

seedMissions();
