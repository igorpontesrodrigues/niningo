import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

function formatTime(ms) {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MissionsPage() {
  const { user, character, loadCharacter } = useAuthStore();
  const { showModal } = useUIStore();
  const [missions, setMissions] = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchMissions = async () => {
    if (!character?.id) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/missions/available/${character.id}`);
      const data = await res.json();
      setMissions(data.missions || []);
      if (data.activeMissions && data.activeMissions.length > 0) {
        setActiveMission(data.activeMissions[0]);
      } else {
        setActiveMission(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [character]);

  useEffect(() => {
    if (!activeMission || activeMission.status !== 'in_progress') return;
    const interval = setInterval(() => {
      const remaining = new Date(activeMission.completes_at).getTime() - Date.now();
      setTimeLeft(Math.max(0, remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMission]);

  const startMission = async (mission) => {
    const stats = character?.character_stats;
    if (!stats || stats.stamina < mission.stamina_cost) {
      showModal('Aviso', 'Stamina insuficiente!', 'error');
      return;
    }
    if (activeMission) {
      showModal('Aviso', 'Você já tem uma missão em andamento!', 'error');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/missions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, missionId: mission.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setActiveMission(data.charMission);
      await loadCharacter(user.id);
      showModal('Missão Iniciada', `Retorne em ${mission.duration_minutes} minutos para coletar as recompensas!`, 'info');
    } catch (err) {
      showModal('Erro', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  // We keep the manual claim just in case auto-claim takes a few seconds to trigger
  const claimReward = async () => {
    if (!activeMission) return;
    setProcessing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/missions/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, charMissionId: activeMission.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showModal('Missão Concluída!', `Você ganhou ${data.rewards.xp} XP e ${data.rewards.ryo} Ryō.`, 'success');
      setActiveMission(null);
      await loadCharacter(user.id);
    } catch (err) {
      showModal('Erro', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 8 }}>Quadro de Missões</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cumpra missões locais para ganhar experiência e Ryō.</p>
      </div>

      {activeMission && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass glow" style={{ borderRadius: 'var(--radius)', padding: 20, border: '1px solid rgba(168, 85, 247, 0.4)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 8, color: 'var(--accent)' }}>
            Missão em Andamento
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Continue suas tarefas no mundo enquanto aguarda. Você pode resgatar a recompensa quando o tempo acabar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'monospace' }}>
              {formatTime(timeLeft)}
            </div>
            <button 
              className="btn btn-primary"
              disabled={timeLeft > 0 || processing}
              onClick={claimReward}
              style={{ padding: '10px 20px', opacity: (timeLeft > 0 || processing) ? 0.5 : 1 }}
            >
              {timeLeft > 0 ? 'Em Missão...' : (processing ? 'Aguarde...' : 'Resgatar')}
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Buscando missões...</div>
      ) : (
        <>
          {missions.length === 0 ? (
            <div className="glass" style={{ padding: 40, textAlign: 'center', borderRadius: 'var(--radius)' }}>
              Nenhuma missão disponível no seu rank para esta localização.
            </div>
          ) : (
            <div className="grid-layout">
              {missions.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass" style={{ borderRadius: 'var(--radius)', padding: 16, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontFamily: 'Cinzel, serif' }}>{m.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                      Rank {m.rank.toUpperCase()}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, flex: 1 }}>{m.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tempo</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Clock size={12} color="var(--accent)" /> {m.duration_minutes}m
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Custo</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Zap size={12} color="#f59e0b" /> {m.stamina_cost}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a855f7' }}>+{m.xp_reward} XP</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>+{m.ryo_reward} Ryō</div>
                  </div>

                  <button 
                    onClick={() => startMission(m)} 
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '0.85rem' }}
                    disabled={!!activeMission || processing}
                  >
                    {processing ? 'Aguarde...' : 'Aceitar Missão'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
