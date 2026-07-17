import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function ShopPage() {
  const { character } = useAuthStore();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!character?.village_id) return;
    supabase.from('shop_items').select('*, equipment(*)')
      .eq('village_id', character.village_id)
      .then(({ data }) => setItems(data || []));
  }, [character]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-900)', padding: '20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowLeft size={20} /></Link>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem' }}>Loja da Vila</h1>
            <p style={{ fontSize: '0.78rem', color: '#f59e0b' }}>💰 {character?.ryo} Ryō disponível</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="glass" style={{ borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{item.equipment?.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>{item.equipment?.description}</div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: 10 }}>💰 {item.price} Ryō</div>
              <button className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '7px 14px' }}
                disabled={character?.ryo < item.price}
                onClick={() => alert(`Comprando ${item.equipment?.name}...`)}>
                Comprar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
