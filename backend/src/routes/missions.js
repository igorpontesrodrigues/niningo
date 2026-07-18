import { supabase } from '../lib/supabase.js';

export default async function missionRoutes(fastify) {
  // List available missions for current location
  fastify.get('/available/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    const { data: character } = await supabase
      .from('characters')
      .select('current_location_id, rank')
      .eq('id', characterId)
      .single();

    if (!character) return reply.code(404).send({ error: 'Character not found' });

    const rankToMissions = {
      'genin': ['d', 'c'],
      'chunin': ['c', 'b'],
      'jonin': ['b', 'a', 's'],
      'kage': ['a', 's']
    };
    
    const allowedRanks = rankToMissions[character.rank] || ['d'];

    const { data: missions } = await supabase
      .from('missions')
      .select('*')
      .eq('location_id', character.current_location_id)
      .in('rank', allowedRanks);

    // Get active missions for this character
    const { data: activeMissions } = await supabase
      .from('character_missions')
      .select('id, mission_id, status, started_at, completes_at')
      .eq('character_id', characterId)
      .eq('status', 'in_progress');

    return { missions: missions || [], activeMissions: activeMissions || [] };
  });

  // Start a mission
  fastify.post('/start', async (request, reply) => {
    const { characterId, missionId } = request.body;

    // Get mission info
    const { data: mission } = await supabase
      .from('missions')
      .select('*')
      .eq('id', missionId)
      .single();

    if (!mission) return reply.code(404).send({ error: 'Mission not found' });

    // Get character stats for stamina check
    const { data: stats } = await supabase
      .from('character_stats')
      .select('stamina')
      .eq('character_id', characterId)
      .single();

    if (!stats || stats.stamina < mission.stamina_cost) {
      return reply.code(400).send({ error: 'Not enough stamina' });
    }

    // Deduct stamina
    await supabase
      .from('character_stats')
      .update({ stamina: stats.stamina - mission.stamina_cost })
      .eq('character_id', characterId);

    const completesAt = new Date(Date.now() + mission.duration_minutes * 60 * 1000);

    // Create mission record
    const { data: charMission, error } = await supabase
      .from('character_missions')
      .insert({
        character_id: characterId,
        mission_id: missionId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        completes_at: completesAt.toISOString(),
      })
      .select()
      .single();

    if (error) return reply.code(500).send({ error: error.message });
    return { success: true, charMission, completesAt };
  });

  // Complete a mission (claim rewards)
  fastify.post('/complete', async (request, reply) => {
    const { characterId, charMissionId } = request.body;

    const { data: charMission } = await supabase
      .from('character_missions')
      .select('*, missions(*)')
      .eq('id', charMissionId)
      .eq('character_id', characterId)
      .single();

    if (!charMission) return reply.code(404).send({ error: 'Mission not found' });
    if (charMission.status !== 'in_progress') return reply.code(400).send({ error: 'Mission not in progress' });
    if (new Date() < new Date(charMission.completes_at)) {
      return reply.code(400).send({ error: 'Mission not completed yet' });
    }

    const mission = charMission.missions;

    // Update mission status
    await supabase
      .from('character_missions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', charMissionId);

    // Give XP and Ryo to character
    const { data: character } = await supabase
      .from('characters')
      .select('xp, ryo, level')
      .eq('id', characterId)
      .single();

    const newXp = character.xp + mission.xp_reward;
    const newRyo = character.ryo + mission.ryo_reward;

    // Simple level up check (100 XP per level)
    const newLevel = Math.floor(newXp / 100) + 1;

    await supabase
      .from('characters')
      .update({ xp: newXp, ryo: newRyo, level: Math.min(newLevel, 30) })
      .eq('id', characterId);

    return {
      success: true,
      rewards: { xp: mission.xp_reward, ryo: mission.ryo_reward },
      newXp, newLevel,
    };
  });
}
