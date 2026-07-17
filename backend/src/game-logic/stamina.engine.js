import { supabase } from '../lib/supabase.js';

const STAMINA_REGEN_PER_MINUTE = 1 / (parseInt(process.env.STAMINA_REGEN_INTERVAL_MINUTES) || 5);
const REST_BONUS_HOURS = parseInt(process.env.REST_BONUS_HOURS) || 6;
const REST_BONUS_XP_MULTIPLIER = parseFloat(process.env.REST_BONUS_XP_MULTIPLIER) || 1.2;

/**
 * Called when a character logs in.
 * Calculates stamina regenerated while offline.
 */
export async function processLogin(characterId) {
  // Get last session
  const { data: lastSession } = await supabase
    .from('stamina_sessions')
    .select('*')
    .eq('character_id', characterId)
    .order('went_offline_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastSession?.went_offline_at || lastSession.came_online_at) {
    // First login or already processed
    await recordLogin(characterId);
    return { staminaGained: 0, restedBonus: false };
  }

  const offlineDurationMs = Date.now() - new Date(lastSession.went_offline_at).getTime();
  const offlineMinutes = offlineDurationMs / 1000 / 60;
  const offlineHours = offlineMinutes / 60;

  const staminaGained = Math.floor(offlineMinutes * STAMINA_REGEN_PER_MINUTE);
  const restedBonus = offlineHours >= REST_BONUS_HOURS;

  // Update character stamina
  const { data: stats } = await supabase
    .from('character_stats')
    .select('stamina, max_stamina')
    .eq('character_id', characterId)
    .single();

  if (stats) {
    const newStamina = Math.min(stats.stamina + staminaGained, stats.max_stamina);
    await supabase
      .from('character_stats')
      .update({ stamina: newStamina })
      .eq('character_id', characterId);
  }

  // Mark session as completed
  await supabase
    .from('stamina_sessions')
    .update({
      came_online_at: new Date().toISOString(),
      stamina_recovered: staminaGained,
      rested_bonus: restedBonus,
    })
    .eq('id', lastSession.id);

  // Record new online session start
  await recordLogin(characterId);

  // Update NPC status to online
  await supabase
    .from('character_online_status')
    .upsert({
      character_id: characterId,
      is_online: true,
      last_seen_at: new Date().toISOString(),
      offline_npc_state: null,
    });

  // Apply rested bonus flag to character
  if (restedBonus) {
    await supabase
      .from('characters')
      .update({ rested_bonus_expires_at: new Date(Date.now() + REST_BONUS_XP_MULTIPLIER * 60 * 60 * 1000).toISOString() })
      .eq('id', characterId);
  }

  return { staminaGained, restedBonus, xpMultiplier: restedBonus ? REST_BONUS_XP_MULTIPLIER : 1 };
}

/**
 * Called when a character logs out.
 */
export async function processLogout(characterId) {
  const now = new Date().toISOString();

  // Create offline session record
  await supabase.from('stamina_sessions').insert({
    character_id: characterId,
    went_offline_at: now,
  });

  // Update online status
  await supabase
    .from('character_online_status')
    .upsert({
      character_id: characterId,
      is_online: false,
      last_seen_at: now,
      offline_npc_state: 'sleeping', // will be updated by cron based on server time
    });
}

function recordLogin(characterId) {
  return supabase.from('character_online_status').upsert({
    character_id: characterId,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    offline_npc_state: null,
  });
}

/**
 * Cron: Update NPC states based on server time.
 * Run every hour via a scheduled job.
 */
export async function updateOfflineNpcStates() {
  const hour = new Date().getHours(); // server time
  const npcState = (hour >= 22 || hour < 7) ? 'sleeping' : 'wandering';

  await supabase
    .from('character_online_status')
    .update({ offline_npc_state: npcState })
    .eq('is_online', false);

  console.log(`[NPC Cron] Updated offline NPCs to: ${npcState}`);
}
