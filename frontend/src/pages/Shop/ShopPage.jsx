import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function ShopPage() {
  const { user, character, loadCharacter } = useAuthStore();
  const { showModal } = useUIStore();
  const [items, setItems] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!character?.village_id) return;
    supabase.from('shop_items').select('*, equipment(*)')
      .eq('village_id', character.village_id)
      .then(({ data }) => setItems(data || []));
  }, [character]);

  const handleBuy = async (item) => {
    if (character.ryo < item.price) return;
    setProcessing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/shop/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, shopItemId: item.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showModal('Compra Realizada', `Você comprou ${item.equipment?.name} com sucesso!`, 'success');
      await loadCharacter(user.id);
    } catch (err) {
      showModal('Erro na Compra', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={24} color="var(--accent)" />
          Loja da Vila
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Você tem <strong style={{ color: '#f59e0b' }}>{character?.ryo} Ryō</strong> disponível.</p>
      </div>

      <div className="grid-layout">
        {items.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass" style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>{item.equipment?.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, flex: 1, lineHeight: 1.4 }}>{item.equipment?.description}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>💰 {item.price} Ryō</div>
              <button className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '7px 14px' }}
                disabled={character?.ryo < item.price || processing}
                onClick={() => handleBuy(item)}>
                {processing ? '...' : 'Comprar'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
