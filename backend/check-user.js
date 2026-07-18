import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkUser() {
  const { data: missions } = await supabase.from('missions').select('*').eq('location_id', '33333333-0000-0000-0000-000000000007');
  console.log('Missions for location 7:', missions);
}

checkUser();
