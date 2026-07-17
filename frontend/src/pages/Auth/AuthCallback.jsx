import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loadCharacter } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return; }

      const character = await loadCharacter(session.user.id);
      navigate(character ? '/dashboard' : '/create-character');
    });
  }, []);

  return <LoadingScreen />;
}
