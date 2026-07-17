import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import StatBar from '../../components/ui/StatBar';

const CHAKRA_LABELS = { fire: '🔥 Fogo', water: '🌊 Água', wind: '🌀 Vento', earth: '🪨 Terra', lightning: '⚡ Raio' };
const RANK_LABELS = { genin: '忍 Genin', chunin: '中 Chunin', jonin: '上 Jonin', kage: '影 Kage' };

export default function ProfilePage() {
  const { character } = useAuthStore();
  const stats = character?.character_stats;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-900)', padding: '20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem' }}>Perfil</h1>
        </div>

        {/* Avatar Card */}
        <div className="glass" style={{ borderRadius: 16, padding: '24px 20px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
            background: `linear-gradient(135deg, ${character?.villages?.color || '#00d2c8'}, #070912)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, border: `3px solid ${character?.villages?.color || '#00d2c8'}`,
          }}>
            {character?.villages?.symbol}
          </div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 4 }}>{character?.name}</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {RANK_LABELS[character?.rank]} • {character?.clans?.name} • {CHAKRA_LABELS[character?.chakra_nature]}
          </p>
        </div>

        {/* Stats */}
        <div className="glass" style={{ borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Atributos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Força', stats?.strength], ['Defesa', stats?.defense], ['Velocidade', stats?.speed],
              ['Ninjutsu', stats?.ninjutsu], ['Taijutsu', stats?.taijutsu], ['Genjutsu', stats?.genjutsu]
            ].map(([label, val]) => (
              <div key={label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{val || 0}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="glass" style={{ borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['Nível', character?.level], ['XP Total', character?.xp], ['Ryō', character?.ryo],
              ['Vila', character?.villages?.name], ['Localização', character?.locations?.name]
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
