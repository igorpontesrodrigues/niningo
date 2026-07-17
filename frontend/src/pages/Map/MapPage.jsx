import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const TRAVEL_MODES = [
  { id: 'safe',   label: 'Segura',  icon: Shield, desc: '0% PvP • Mais lenta', color: '#22c55e' },
  { id: 'normal', label: 'Normal',  icon: Wind,   desc: '15% PvP • Velocidade normal', color: '#f59e0b' },
  { id: 'fast',   label: 'Rápida',  icon: Zap,    desc: '40% PvP • Mais rápida', color: '#ef4444' },
];

export default function MapPage() {
  const { character } = useAuthStore();
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [travelMode, setTravelMode] = useState('normal');
  const [traveling, setTraveling] = useState(false);

  useEffect(() => {
    supabase.from('locations').select('*')
      .eq('village_id', character?.village_id)
      .then(({ data }) => setLocations(data || []));
  }, []);

  const handleTravel = async () => {
    if (!selected || selected.id === character?.current_location_id) return;
    setTraveling(true);
    // TODO: call travel API
    setTimeout(() => setTraveling(false), 1000);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg-900)', padding: '20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem' }}>Mapa da Vila</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {locations.map((loc) => {
            const isCurrent = loc.id === character?.current_location_id;
            const isSelected = selected?.id === loc.id;
            return (
              <motion.button key={loc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isCurrent && setSelected(loc)}
                style={{
                  padding: '16px', borderRadius: 12, textAlign: 'left', cursor: isCurrent ? 'default' : 'pointer',
                  background: isCurrent ? 'rgba(0,210,200,0.1)' : isSelected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isCurrent ? 'rgba(0,210,200,0.4)' : isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  width: '100%', color: 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontFamily: 'Cinzel, serif', fontSize: '0.9rem' }}>{loc.name}</span>
                  {isCurrent && <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>● Aqui</span>}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nv. {loc.level_range_min}–{loc.level_range_max}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{loc.description}</div>
              </motion.button>
            );
          })}
        </div>

        {selected && selected.id !== character?.current_location_id && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass" style={{ borderRadius: 14, padding: 20 }}>
            <div style={{ marginBottom: 14, fontFamily: 'Cinzel, serif', fontSize: '0.9rem' }}>Viajar para {selected.name}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {TRAVEL_MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setTravelMode(m.id)} style={{
                    flex: 1, padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${travelMode === m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                    background: travelMode === m.id ? `${m.color}22` : 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.2s ease',
                  }}>
                    <Icon size={18} color={m.color} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center' }}>{m.desc}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={handleTravel} disabled={traveling}
              className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: traveling ? 0.6 : 1 }}>
              {traveling ? 'Iniciando viagem...' : '🗺️ Partir Agora'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
