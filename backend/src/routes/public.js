import { supabase } from '../lib/supabase.js';

export default async function publicRoutes(fastify) {
  fastify.get('/stats', async (request, reply) => {
    try {
      // Get total characters
      const { count: totalPlayers, error: err1 } = await supabase
        .from('characters')
        .select('*', { count: 'exact', head: true });

      // Get online players
      const { count: onlinePlayers, error: err2 } = await supabase
        .from('character_online_status')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true);

      // Get top 5 players (Level and XP)
      const { data: topPlayers, error: err3 } = await supabase
        .from('characters')
        .select(`
          id,
          name,
          level,
          xp,
          villages (name, color, symbol)
        `)
        .order('level', { ascending: false })
        .order('xp', { ascending: false })
        .limit(5);

      if (err1 || err2 || err3) {
        throw new Error(err1?.message || err2?.message || err3?.message);
      }

      return {
        totalPlayers: totalPlayers || 0,
        onlinePlayers: onlinePlayers || 0,
        topPlayers: topPlayers || []
      };
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch public stats' });
    }
  });
}
