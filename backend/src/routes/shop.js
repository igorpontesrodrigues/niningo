import { supabase } from '../lib/supabase.js';

export default async function shopRoutes(fastify) {
  // List items in village shop
  fastify.get('/:villageId', async (request, reply) => {
    const { villageId } = request.params;

    const { data: items } = await supabase
      .from('shop_items')
      .select('*, equipment(*)')
      .eq('village_id', villageId);

    return { items: items || [] };
  });

  // Buy item
  fastify.post('/buy', async (request, reply) => {
    const { characterId, shopItemId } = request.body;

    const { data: shopItem } = await supabase
      .from('shop_items')
      .select('*, equipment(*)')
      .eq('id', shopItemId)
      .single();

    if (!shopItem) return reply.code(404).send({ error: 'Item not found' });

    const { data: character } = await supabase
      .from('characters')
      .select('ryo')
      .eq('id', characterId)
      .single();

    if (!character || character.ryo < shopItem.price) {
      return reply.code(400).send({ error: 'Not enough Ryo' });
    }

    // Deduct Ryo
    await supabase
      .from('characters')
      .update({ ryo: character.ryo - shopItem.price })
      .eq('id', characterId);

    // Add to inventory
    const { data: existing } = await supabase
      .from('character_inventory')
      .select('id, quantity')
      .eq('character_id', characterId)
      .eq('equipment_id', shopItem.equipment_id)
      .single();

    if (existing) {
      await supabase
        .from('character_inventory')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('character_inventory').insert({
        character_id: characterId,
        equipment_id: shopItem.equipment_id,
        quantity: 1,
        equipped: false,
      });
    }

    return { success: true, newRyo: character.ryo - shopItem.price };
  });
}
