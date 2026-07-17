import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  character: null,
  loading: true,

  setUser: (user) => set({ user }),
  setCharacter: (character) => set({ character }),
  setLoading: (loading) => set({ loading }),

  signInWithDiscord: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  },

  signInTest: async (username) => {
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@test.com`;
    const password = 'testpassword123';
    
    // Chama o backend para criar a conta com privilégios de Admin (burla o rate limit do Supabase)
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/test-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao criar conta de teste');
    }

    // Agora faz login normal com a senha
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, character: null });
  },

  loadCharacter: async (userId) => {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        character_stats (*),
        character_appearance (*),
        villages (id, name, slug, color, symbol),
        clans (id, name),
        locations (id, name)
      `)
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      set({ character: data });
      return data;
    }
    return null;
  },
}));
