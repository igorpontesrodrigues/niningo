import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children, requireCharacter = false }) {
  const { user, character, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (requireCharacter && !character) return <Navigate to="/create-character" />;

  return children;
}
