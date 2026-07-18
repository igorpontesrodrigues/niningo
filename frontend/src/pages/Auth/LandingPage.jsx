import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export default function LandingPage() {
  const { user, signInWithDiscord } = useAuthStore();
  const [stats, setStats] = useState({ totalPlayers: 0, onlinePlayers: 0, topPlayers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/public/stats`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,210,200,0.08) 0%, transparent 60%), #070912',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 1200,
        width: '100%',
        padding: '40px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 40,
        alignItems: 'flex-start'
      }}>
        
        {/* Left Column: Info & Stats */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '3rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #e8eaf0, #00d2c8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}>Ninin Go</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              O mundo ninja te aguarda. Junte-se a centenas de shinobis, treine seus jutsus e lute pela sua vila em tempo real.
            </p>
          </motion.div>

          {/* Server Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
              <div style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                {loading ? '...' : stats.totalPlayers}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ninjas Registrados
              </div>
            </div>
            <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
              <div style={{ color: '#22c55e', fontSize: '2rem', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                {loading ? '...' : stats.onlinePlayers}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Online Agora
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass" style={{ padding: 24, borderRadius: 16 }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', marginBottom: 16, color: 'var(--accent)' }}>
              Top Shinobis
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loading ? <div style={{ color: 'var(--text-muted)' }}>Carregando pergaminhos...</div> : stats.topPlayers.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                  border: i === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 28, height: 28, borderRadius: '50%', background: p.villages?.color || '#333',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: i === 0 ? '#fbbf24' : 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.villages?.name || 'Sem Vila'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Nv. {p.level}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>{p.xp} XP</div>
                  </div>
                </div>
              ))}
              {!loading && stats.topPlayers.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhum ninja no ranking ainda.</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Auth Box */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ flex: '1 1 350px', display: 'flex', alignItems: 'center' }}>
          
          <div className="glass glow" style={{
            width: '100%', padding: '48px 36px', borderRadius: 24, textAlign: 'center',
            background: 'rgba(20, 24, 40, 0.6)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', marginBottom: 12 }}>
              {user ? 'Bem-vindo de volta' : 'Inicie sua Jornada'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32, lineHeight: 1.5 }}>
              {user ? 'Seu ninja aguarda comandos. Continue sua jornada.' : 'O teste beta está aberto. Entre usando sua conta do Discord para criar seu ninja e escolher sua vila.'}
            </p>

            {user ? (
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    padding: '16px 24px', background: 'linear-gradient(135deg, var(--accent), #0098b8)', border: 'none',
                    borderRadius: 12, color: '#070912', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Entrar no Jogo →
                </button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={signInWithDiscord}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '16px 24px', background: 'rgba(88,101,242,0.15)', border: '1px solid rgba(88,101,242,0.4)',
                  borderRadius: 12, color: '#5865F2', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.028.018.056.039.073a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Entrar com Discord
              </button>
            )}
            
            <p style={{ marginTop: 24, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Servidor Oficial • Beta 1.0.0
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
