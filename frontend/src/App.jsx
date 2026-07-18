import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/Auth/LandingPage';
import AuthCallback from './pages/Auth/AuthCallback';
import CharacterCreate from './pages/CharacterCreate/CharacterCreate';
import Dashboard from './pages/Dashboard/Dashboard';
import MapPage from './pages/Map/MapPage';
import MissionsPage from './pages/Missions/MissionsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ShopPage from './pages/Shop/ShopPage';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/ui/ProtectedRoute';
import GlobalModal from './components/ui/GlobalModal';
import MainLayout from './components/layout/MainLayout';

export default function App() {
  const { user, loading, setUser, setLoading, loadCharacter } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadCharacter(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadCharacter(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <GlobalModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/create-character" element={
          <ProtectedRoute>
            <CharacterCreate />
          </ProtectedRoute>
        } />

        {/* Main App Routes with Global Layout */}
        <Route element={
          <ProtectedRoute requireCharacter>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
