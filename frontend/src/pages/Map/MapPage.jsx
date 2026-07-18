import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Wind, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const TRAVEL_MODES = [
  { id: 'safe',   label: 'Segura',  icon: Shield, desc: '10 min • 0% PvP', color: '#22c55e' },
  { id: 'normal', label: 'Normal',  icon: Wind,   desc: '7 min • 15% PvP', color: '#f59e0b' },
  { id: 'fast',   label: 'Rápida',  icon: Zap,    desc: '4 min • 40% PvP', color: '#ef4444' },
];

function formatTime(ms) {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MapPage() {
  const { user, character, loadCharacter } = useAuthStore();
  const { showModal } = useUIStore();
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [travelMode, setTravelMode] = useState('normal');
  const [activeTravel, setActiveTravel] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fetch all locations to display
    supabase.from('locations').select('*')
      .order('name')
      .then(({ data }) => setLocations(data || []));

    // Fetch active travel
    if (character?.id) {
      fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/status/${character.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.travel) setActiveTravel(data.travel);
        })
        .catch(err => console.error(err));
    }
  }, [character]);

  useEffect(() => {
    if (!activeTravel || activeTravel.status !== 'traveling') return;
    const interval = setInterval(() => {
      const remaining = new Date(activeTravel.arrives_at).getTime() - Date.now();
      setTimeLeft(Math.max(0, remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTravel]);

  const handleTravel = async () => {
    if (!selected || selected.id === character?.current_location_id) return;
    setProcessing(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, destinationId: selected.id, mode: travelMode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Fetch status again to get the joined location names
      const statusRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/status/${character.id}`);
      const statusData = await statusRes.json();
      
      setActiveTravel(statusData.travel);
      showModal('Viagem Iniciada', 'Sua jornada começou! Fique atento a emboscadas no caminho.', 'info');
      setSelected(null);
    } catch (err) {
      showModal('Erro', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleArrive = async () => {
    if (!activeTravel) return;
    setProcessing(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/arrive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, travelId: activeTravel.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showModal('Destino Alcançado!', `Você chegou em ${activeTravel.to_location.name}.`, 'success');
      setActiveTravel(null);
      await loadCharacter(user.id);
    } catch (err) {
      showModal('Erro', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg-900)', padding: '20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem' }}>Mapa do Mundo</h1>
        </div>

        {activeTravel && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass glow" style={{ borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 8, color: 'var(--accent)' }}>
              Viagem em Andamento
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Destino: <strong>{activeTravel.to_location?.name}</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
              <button 
                className="btn btn-primary"
                disabled={timeLeft > 0 || processing}
                onClick={handleArrive}
                style={{ padding: '10px 20px', opacity: (timeLeft > 0 || processing) ? 0.5 : 1 }}
              >
                {timeLeft > 0 ? 'Viajando...' : (processing ? 'Aguarde...' : 'Desembarcar')}
              </button>
            </div>
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {locations.map((loc) => {
            const isCurrent = loc.id === character?.current_location_id;
            const isSelected = selected?.id === loc.id;
            return (
              <motion.button key={loc.id}
                whileTap={{ scale: 0.98 }}
                disabled={isCurrent || !!activeTravel}
                onClick={() => !isCurrent && setSelected(loc)}
                style={{
                  padding: '16px', borderRadius: 12, textAlign: 'left', 
                  cursor: (isCurrent || !!activeTravel) ? 'default' : 'pointer',
                  background: isCurrent ? 'rgba(0,210,200,0.1)' : isSelected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isCurrent ? 'rgba(0,210,200,0.4)' : isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  width: '100%', color: 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                  opacity: (activeTravel && !isCurrent) ? 0.4 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontFamily: 'Cinzel, serif', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color={isCurrent ? "var(--accent)" : "var(--text-muted)"} />
                    {loc.name}
                  </span>
                  {isCurrent && <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>● Sua Posição</span>}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginLeft: 20 }}>{loc.description}</div>
              </motion.button>
            );
          })}
        </div>

        {selected && selected.id !== character?.current_location_id && !activeTravel && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass" style={{ borderRadius: 14, padding: 20 }}>
            <div style={{ marginBottom: 14, fontFamily: 'Cinzel, serif', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Navigation size={16} /> Viajar para {selected.name}
            </div>
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
            <button onClick={handleTravel} disabled={processing}
              className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: processing ? 0.6 : 1 }}>
              {processing ? 'Iniciando viagem...' : '🗺️ Partir Agora'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
