import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CHAKRA_LABELS = { fire: '🔥 Fogo', water: '🌊 Água', wind: '🌀 Vento', earth: '🪨 Terra', lightning: '⚡ Raio' };
const RANK_LABELS = { genin: '忍 Genin', chunin: '中 Chunin', jonin: '上 Jonin', kage: '影 Kage' };

export default function ProfilePage() {
  const { character, signOut } = useAuthStore();
  const stats = character?.character_stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 8 }}>Perfil do Ninja</h1>
        <p style={{ color: 'var(--text-muted)' }}>Sua jornada e seus atributos atuais.</p>
      </div>

      <div className="grid-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar Card */}
          <div className="glass glow" style={{ borderRadius: 16, padding: '30px 20px', textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
              background: `linear-gradient(135deg, ${character?.villages?.color || '#00d2c8'}, #070912)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, border: `4px solid ${character?.villages?.color || '#00d2c8'}`,
            }}>
              {character?.villages?.symbol}
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', marginBottom: 6 }}>{character?.name}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {RANK_LABELS[character?.rank]} • {character?.clans?.name} • {CHAKRA_LABELS[character?.chakra_nature]}
            </p>
          </div>

          {/* Info */}
          <div className="glass" style={{ borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Nível', character?.level], ['XP Total', character?.xp], ['Ryō', character?.ryo],
                ['Vila', character?.villages?.name], ['Localização', character?.locations?.name]
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass" style={{ borderRadius: 14, padding: 24, height: 'fit-content' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20, color: 'var(--text-secondary)' }}>Atributos de Combate</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            {[['Força', stats?.strength], ['Defesa', stats?.defense], ['Velocidade', stats?.speed],
              ['Ninjutsu', stats?.ninjutsu], ['Taijutsu', stats?.taijutsu], ['Genjutsu', stats?.genjutsu]
            ].map(([label, val]) => (
              <div key={label} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{val || 0}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <button onClick={signOut} className="btn-logout" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              <LogOut size={20} /> <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
