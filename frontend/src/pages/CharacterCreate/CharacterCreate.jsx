import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const STEPS = ['Vila', 'Clã', 'Nome', 'Aparência', 'Chakra'];
const CHAKRA_NATURES = [
  { id: 'fire',      label: 'Fogo',      emoji: '🔥', color: '#dc2626' },
  { id: 'water',     label: 'Água',      emoji: '🌊', color: '#2563eb' },
  { id: 'wind',      label: 'Vento',     emoji: '🌀', color: '#16a34a' },
  { id: 'earth',     label: 'Terra',     emoji: '🪨', color: '#92400e' },
  { id: 'lightning', label: 'Raio',      emoji: '⚡', color: '#ca8a04' },
];

export default function CharacterCreate() {
  const navigate = useNavigate();
  const { user, loadCharacter } = useAuthStore();
  const { showModal } = useUIStore();

  const [step, setStep] = useState(0);
  const [villages, setVillages] = useState([]);
  const [clans, setClans] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    villageId: '',
    clanId: '',
    name: '',
    hairColor: '#3a1f00',
    eyeColor: '#3b82f6',
    skinTone: '#f5d0a9',
    chakraNature: '',
  });

  useEffect(() => {
    supabase.from('villages').select('*').then(({ data }) => setVillages(data || []));
  }, []);

  useEffect(() => {
    if (form.villageId) {
      supabase.from('clans').select('*').eq('village_id', form.villageId)
        .then(({ data }) => setClans(data || []));
    }
  }, [form.villageId]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canProceed = () => {
    if (step === 0) return !!form.villageId;
    if (step === 1) return !!form.clanId;
    if (step === 2) return form.name.trim().length >= 3;
    if (step === 3) return true;
    if (step === 4) return !!form.chakraNature;
    return false;
  };

  const handleSubmit = async () => {
    if (!canProceed() || saving) return;
    setSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/character/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: form.name.trim(),
          villageId: form.villageId,
          clanId: form.clanId,
          chakraNature: form.chakraNature,
          appearance: {
            hairColor: form.hairColor,
            eyeColor: form.eyeColor,
            skinTone: form.skinTone,
            outfitId: 'default',
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao criar personagem');
      }

      await loadCharacter(user.id);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      showModal('Erro na Criação', 'Falha ao criar personagem: ' + err.message, 'error');
      setSaving(false);
    }
  };

  const selectedVillage = villages.find((v) => v.id === form.villageId);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,210,200,0.06) 0%, transparent 60%), #070912',
      padding: '20px',
    }}
    data-village={selectedVillage?.slug}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 600, width: '100%' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', marginBottom: 8,
            background: 'linear-gradient(135deg, #e8eaf0, #00d2c8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Criar Ninja</h1>
          {/* Steps */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                padding: '4px 12px', borderRadius: 100,
                fontSize: '0.75rem', fontWeight: 600,
                background: i === step ? 'var(--accent-dim)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === step ? 'rgba(0,210,200,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: i === step ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: 20, padding: '32px 28px' }}>
          <AnimatePresence mode="wait">
            {/* STEP 0: Vila */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20 }}>Escolha sua Vila</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {villages.map((v) => (
                    <button key={v.id} onClick={() => set('villageId', v.id)} style={{
                      padding: '16px', borderRadius: 12,
                      border: `2px solid ${form.villageId === v.id ? v.color : 'rgba(255,255,255,0.08)'}`,
                      background: form.villageId === v.id ? `${v.color}22` : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{v.symbol}</div>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', fontWeight: 600 }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>{v.description?.slice(0, 60)}...</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Clã */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20 }}>Escolha seu Clã</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clans.map((c) => (
                    <button key={c.id} onClick={() => set('clanId', c.id)} style={{
                      padding: '14px 16px', borderRadius: 10,
                      border: `2px solid ${form.clanId === c.id ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                      background: form.clanId === c.id ? 'var(--accent-dim)' : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.trait_description}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Nome */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20 }}>Nome do Ninja</h2>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  maxLength={20}
                  placeholder="Digite o nome do seu ninja..."
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: 'var(--text-primary)',
                    fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
                <p style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {form.name.length}/20 caracteres — mínimo 3
                </p>
              </motion.div>
            )}

            {/* STEP 3: Aparência */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20 }}>Aparência</h2>
                {[['Cabelo', 'hairColor', '#3a1f00'], ['Olhos', 'eyeColor', '#3b82f6'], ['Tom de Pele', 'skinTone', '#f5d0a9']].map(([label, key, def]) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type="color" value={form[key]} onChange={(e) => set(key, e.target.value)}
                      style={{ width: 48, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                  </div>
                ))}
                {clans.find(c => c.id === form.clanId)?.visual_override && Object.keys(clans.find(c => c.id === form.clanId)?.visual_override || {}).length > 0 && (
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: 12 }}>
                    ⚠️ Seu clã pode sobrescrever algumas escolhas de cor.
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 4: Chakra */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: 20 }}>Natureza do Chakra</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {CHAKRA_NATURES.map((n) => (
                    <button key={n.id} onClick={() => set('chakraNature', n.id)} style={{
                      padding: '16px', borderRadius: 12,
                      border: `2px solid ${form.chakraNature === n.id ? n.color : 'rgba(255,255,255,0.08)'}`,
                      background: form.chakraNature === n.id ? `${n.color}22` : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)', cursor: 'pointer',
                      transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ fontSize: 28 }}>{n.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{n.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 0 ? (
              <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Voltar</button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.4 }}>
                Próximo →
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={!canProceed() || saving}
                style={{ opacity: canProceed() && !saving ? 1 : 0.4 }}>
                {saving ? 'Criando...' : '🥷 Iniciar Jornada'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
