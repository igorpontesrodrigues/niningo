import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function MissionsPage() {
  const { character } = useAuthStore();
  const { showModal } = useUIStore();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!character?.current_location_id) return;
    supabase.from('missions').select('*')
      .eq('location_id', character.current_location_id)
      .then(({ data }) => { setMissions(data || []); setLoading(false); });
  }, [character]);

  const startMission = async (mission) => {
    const stats = character?.character_stats;
    if (!stats || stats.stamina < mission.stamina_cost) { showModal('Aviso', 'Stamina insuficiente!', 'error'); return; }
    // TODO: call mission API
    showModal('Sucesso', `Missão "${mission.name}" iniciada!`, 'success');
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg-900)', padding: '20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem' }}>Missões</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{character?.locations?.name}</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Carregando missões...</p>
        ) : missions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Nenhuma missão disponível aqui.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missions.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="glass" style={{ borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{m.name}</span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 100,
                    background: 'rgba(0,210,200,0.15)', color: 'var(--accent)', border: '1px solid rgba(0,210,200,0.3)' }}>
                    Rank {m.rank.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{m.description}</p>
                <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={12} /> {m.stamina_cost} Stamina
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {m.duration_minutes}min
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} /> {m.xp_reward} XP
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>💰 {m.ryo_reward} Ryō</span>
                </div>
                <button onClick={() => startMission(m)} className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
                  Iniciar Missão
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
