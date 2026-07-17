import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const { signInWithDiscord } = useAuthStore();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,210,200,0.08) 0%, transparent 60%), #070912',
      padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 420, width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '48px 36px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo / Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⚔️</div>
          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e8eaf0, #00d2c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>Ninin Go</h1>
          <p style={{ color: '#8892a4', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Uma segunda vida ninja te aguarda.
          </p>
        </div>

        {/* Discord Login Button */}
        <button
          type="button"
          onClick={signInWithDiscord}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '16px 24px',
            background: 'rgba(88,101,242,0.15)',
            border: '1px solid rgba(88,101,242,0.4)',
            borderRadius: 12,
            color: '#5865F2',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: 20
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.028.018.056.039.073a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Entrar com Discord
        </button>

        <p style={{ marginTop: 24, fontSize: '0.78rem', color: '#3d4a60', lineHeight: 1.7 }}>
          Ao entrar, você concorda com nossos termos.
          <br />Projeto indie — sem fins lucrativos.
        </p>
      </motion.div>
    </div>
  );
}
