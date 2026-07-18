import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useGameStore } from '../../store/gameStore';
import StatBar from '../../components/ui/StatBar';

export default function Dashboard() {
  const { character } = useAuthStore();
  const { isOnline } = useGameStore();

  const stats = character?.character_stats;
  const village = character?.villages;

  if (!character) return null;

  const restedBonus = character.rested_bonus_expires_at 
    && new Date(character.rested_bonus_expires_at) > new Date();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Rested Bonus Banner */}
      {restedBonus && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderRadius: 'var(--radius)'
          }}
        >
          <span style={{ fontSize: '0.88rem', color: '#fbbf24' }}>💤 Bônus de Bem Descansado ativo! +20% XP por 2h</span>
        </motion.div>
      )}

      <div>
        <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', marginBottom: 8, fontSize: '1.4rem' }}>Visão Geral</h3>
        <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta ao Ninin Go. Use a navegação lateral ou inferior para explorar o mundo!</p>
      </div>

      <div className="grid-layout">
        {/* Level + XP */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass glow" style={{ borderRadius: 'var(--radius)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nível</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Cinzel, serif', lineHeight: 1 }}>{character.level}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>{character.xp} XP</div>
            </div>
          </div>
          <StatBar value={character.xp % 100} max={100} type="xp" />
        </motion.div>

        {/* Location */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass" style={{ borderRadius: 'var(--radius)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Localização Atual</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>📍 {character?.locations?.name || 'Desconhecida'}</div>
          </div>
          <Link to="/map" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>Ver Mapa →</Link>
        </motion.div>
      </div>

      {/* Stat Bars */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass" style={{ borderRadius: 'var(--radius)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <StatBar label="HP" value={stats?.hp || 0} max={stats?.max_hp || 100} type="hp" icon="❤️" />
        <StatBar label="Chakra" value={stats?.chakra || 0} max={stats?.max_chakra || 50} type="chakra" icon="🔵" />
        <StatBar label="Stamina" value={stats?.stamina || 0} max={stats?.max_stamina || 20} type="stamina" icon="⚡" />
      </motion.div>

    </div>
  );
}
