import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

const createCharacterSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(3).max(20),
  villageId: z.string().uuid(),
  clanId: z.string().uuid(),
  chakraNature: z.enum(['fire', 'water', 'wind', 'earth', 'lightning']),
  appearance: z.object({
    hairColor: z.string(),
    eyeColor: z.string(),
    skinTone: z.string(),
    outfitId: z.string(),
  }),
});

export default async function characterRoutes(fastify) {
  // Create character (first login)
  fastify.post('/create', async (request, reply) => {
    const parsed = createCharacterSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const data = parsed.data;

    // Check if user already has a character
    const { data: existing } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', data.userId)
      .single();

    if (existing) {
      return { success: true, character: existing, message: 'Character already exists' };
    }

    // Get clan info (for appearance overrides)
    const { data: clan } = await supabase
      .from('clans')
      .select('visual_override')
      .eq('id', data.clanId)
      .single();

    // Merge clan overrides into appearance
    const finalAppearance = { ...data.appearance, ...(clan?.visual_override || {}) };

    // Get starting location for the village
    const { data: startLocation } = await supabase
      .from('locations')
      .select('id')
      .eq('village_id', data.villageId)
      .eq('is_starting_location', true)
      .single();

    // Create character
    const { data: character, error } = await supabase
      .from('characters')
      .insert({
        user_id: data.userId,
        name: data.name,
        village_id: data.villageId,
        clan_id: data.clanId,
        chakra_nature: data.chakraNature,
        current_location_id: startLocation?.id,
        level: 1,
        xp: 0,
        rank: 'genin',
      })
      .select()
      .single();

    if (error) return reply.code(500).send({ error: error.message });

    // Create character stats
    await supabase.from('character_stats').insert({
      character_id: character.id,
      hp: 100, max_hp: 100,
      chakra: 50, max_chakra: 50,
      stamina: 20, max_stamina: 20,
      strength: 5, defense: 5, speed: 5,
      ninjutsu: 5, taijutsu: 5, genjutsu: 5,
    });

    // Save appearance
    await supabase.from('character_appearance').insert({
      character_id: character.id,
      ...finalAppearance,
    });

    // Give starting jutsus (1 per chakra nature)
    const { data: startingJutsu } = await supabase
      .from('jutsus')
      .select('id')
      .eq('chakra_nature', data.chakraNature)
      .eq('rank_required', 'genin')
      .order('created_at')
      .limit(1)
      .single();

    if (startingJutsu) {
      await supabase.from('character_jutsus').insert({
        character_id: character.id,
        jutsu_id: startingJutsu.id,
      });
    }

    return { success: true, character };
  });

  // Get full character data
  fastify.get('/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    const { data: character, error } = await supabase
      .from('characters')
      .select(`
        *,
        character_stats (*),
        character_appearance (*),
        villages (id, name, slug, color, symbol),
        clans (id, name),
        locations (id, name)
      `)
      .eq('id', characterId)
      .single();

    if (error) return reply.code(404).send({ error: 'Character not found' });
    return character;
  });
}
