import { supabase } from '../lib/supabase.js';

const TRAVEL_MODES = {
  safe:   { speed_multiplier: 1.0, pvp_chance: 0 },
  normal: { speed_multiplier: 0.7, pvp_chance: 0.15 },
  fast:   { speed_multiplier: 0.4, pvp_chance: 0.40 },
};

const BASE_TRAVEL_MINUTES = 10;

export default async function travelRoutes(fastify) {
  // Start travel
  fastify.post('/start', async (request, reply) => {
    const { characterId, destinationId, mode } = request.body;

    if (!TRAVEL_MODES[mode]) return reply.code(400).send({ error: 'Invalid travel mode' });

    // Check no active travel
    const { data: activeTravel } = await supabase
      .from('travel_logs')
      .select('id')
      .eq('character_id', characterId)
      .eq('status', 'traveling')
      .single();

    if (activeTravel) return reply.code(400).send({ error: 'Already traveling' });

    // Check no active mission
    const { data: activeMission } = await supabase
      .from('character_missions')
      .select('id')
      .eq('character_id', characterId)
      .eq('status', 'in_progress')
      .single();

    if (activeMission) return reply.code(400).send({ error: 'Você está em uma missão e não pode viajar.' });

    const { data: character } = await supabase
      .from('characters')
      .select('current_location_id')
      .eq('id', characterId)
      .single();

    if (!character) return reply.code(404).send({ error: 'Character not found' });
    if (character.current_location_id === destinationId) return reply.code(400).send({ error: 'Already there' });

    const travelConfig = TRAVEL_MODES[mode];
    const durationMs = BASE_TRAVEL_MINUTES * travelConfig.speed_multiplier * 60 * 1000;
    const arrivesAt = new Date(Date.now() + durationMs);

    const { data: travel, error } = await supabase
      .from('travel_logs')
      .insert({
        character_id: characterId,
        from_location_id: character.current_location_id,
        to_location_id: destinationId,
        mode,
        pvp_chance: travelConfig.pvp_chance,
        victories: 0,
        started_at: new Date().toISOString(),
        arrives_at: arrivesAt.toISOString(),
        status: 'traveling',
      })
      .select()
      .single();

    if (error) return reply.code(500).send({ error: error.message });
    return { success: true, travel };
  });

  // Check travel status
  fastify.get('/status/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    const { data: travel } = await supabase
      .from('travel_logs')
      .select('*, from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)')
      .eq('character_id', characterId)
      .eq('status', 'traveling')
      .single();

    return { travel: travel || null };
  });

  // Complete travel
  fastify.post('/arrive', async (request, reply) => {
    const { characterId, travelId } = request.body;

    const { data: travel } = await supabase
      .from('travel_logs')
      .select('*')
      .eq('id', travelId)
      .eq('character_id', characterId)
      .single();

    if (!travel) return reply.code(404).send({ error: 'Travel not found' });
    if (travel.status !== 'traveling') return reply.code(400).send({ error: 'Travel not in progress' });
    if (new Date() < new Date(travel.arrives_at)) {
      return reply.code(400).send({ error: 'Travel not completed yet' });
    }

    // Update travel status
    await supabase
      .from('travel_logs')
      .update({ status: 'arrived' })
      .eq('id', travelId);

    // Update character location
    await supabase
      .from('characters')
      .update({ current_location_id: travel.to_location_id })
      .eq('id', characterId);

    return { success: true };
  });
}
