import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Scroll, ShoppingBag, User, LogOut, Swords } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useGameStore } from '../../store/gameStore';
import StatBar from '../../components/ui/StatBar';

export default function Dashboard() {
  const { character, signOut } = useAuthStore();
  const { restedBonus, clearRestedBonus } = useGameStore();

  const stats = character?.character_stats;
  const village = character?.villages;

  const navItems = [
    { to: '/map',      icon: Map,         label: 'Mapa' },
    { to: '/missions', icon: Scroll,       label: 'Missões' },
    { to: '/shop',     icon: ShoppingBag,  label: 'Loja' },
    { to: '/profile',  icon: User,         label: 'Perfil' },
  ];

  return (
    <div data-village={village?.slug} style={{ minHeight: '100vh', background: 'var(--bg-900)', display: 'flex', flexDirection: 'column' }}>

      {/* Rested Bonus Banner */}
      {restedBonus && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(251,191,36,0.15))',
            border: '1px solid rgba(245,158,11,0.3)',
            padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.88rem', color: '#fbbf24' }}>💤 Bônus de Bem Descansado ativo! +20% XP por 2h</span>
          <button onClick={clearRestedBonus} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: 18 }}>×</button>
        </motion.div>
      )}

      {/* Top Bar */}
      <header style={{
        padding: '12px 20px',
        background: 'rgba(10,12,20,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{village?.symbol}</span>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 600 }}>{character?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{character?.rank?.toUpperCase()} • {village?.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>💰 {character?.ryo}</span>
          <button onClick={signOut} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 640, margin: '0 auto', width: '100%' }}>

        {/* Level + XP */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass" style={{ borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', fontWeight: 700 }}>Nível {character?.level}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{character?.xp} XP</span>
          </div>
          <StatBar label="XP" value={character?.xp % 100} max={100} type="xp" icon="✨" />
        </motion.div>

        {/* Stat Bars */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass" style={{ borderRadius: 'var(--radius)', padding: '20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StatBar label="HP" value={stats?.hp || 0} max={stats?.max_hp || 100} type="hp" icon="❤️" />
          <StatBar label="Chakra" value={stats?.chakra || 0} max={stats?.max_chakra || 50} type="chakra" icon="🔵" />
          <StatBar label="Stamina" value={stats?.stamina || 0} max={stats?.max_stamina || 20} type="stamina" icon="⚡" />
        </motion.div>

        {/* Location */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass" style={{ borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Localização Atual</div>
            <div style={{ fontWeight: 600 }}>📍 {character?.locations?.name || 'Desconhecida'}</div>
          </div>
          <Link to="/map" style={{ fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver Mapa →</Link>
        </motion.div>

        {/* Quick Nav */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', cursor: 'pointer' }}>
                <Icon size={20} color="var(--accent)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </main>

      {/* Bottom Nav (mobile) */}
      <nav style={{
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0', paddingBottom: 'env(safe-area-inset-bottom, 10px)',
        background: 'rgba(10,12,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        position: 'sticky', bottom: 0,
      }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.65rem', padding: '4px 12px' }}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
