export default async function authRoutes(fastify) {
  // Validate session token from Supabase
  fastify.post('/validate', async (request, reply) => {
    const { token } = request.body;
    if (!token) return reply.code(401).send({ error: 'No token provided' });

    const { supabase } = await import('../lib/supabase.js');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return reply.code(401).send({ error: 'Invalid token' });

    // Check if user has a character
    const { data: character } = await supabase
      .from('characters')
      .select('id, name, village_id')
      .eq('user_id', user.id)
      .single();

    return { user: { id: user.id, email: user.email }, character: character || null };
  });

  // Test Signup (Admin API bypasses rate limit)
  fastify.post('/test-signup', async (request, reply) => {
    const { username } = request.body;
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@test.com`;
    const password = 'testpassword123';
    const { supabase } = await import('../lib/supabase.js');
    
    // Check if user exists (if yes, just return success so frontend can login)
    // Try admin list users (naive approach: just try to create, if error is "already registered", ignore)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error && !error.message.includes('already been registered')) {
      return reply.code(500).send({ error: error.message });
    }

    return { success: true };
  });
}
