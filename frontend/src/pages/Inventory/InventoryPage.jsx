import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Backpack, Sword, Shield, Shirt, FlaskConical } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const TYPE_ICONS = {
  weapon: Sword,
  armor: Shield,
  accessory: Shirt,
  consumable: FlaskConical
};

const TYPE_LABELS = {
  weapon: 'Armas',
  armor: 'Armaduras',
  accessory: 'Acessórios',
  consumable: 'Consumíveis'
};

const RARITY_COLORS = {
  common: '#94a3b8',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7'
};

export default function InventoryPage() {
  const { user, character, loadCharacter } = useAuthStore();
  const { showModal } = useUIStore();
  
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(false);

  const fetchInventory = async () => {
    if (!character?.id) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/character/inventory/${character.id}`);
      const data = await res.json();
      setInventory(data.inventory || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [character]);

  const handleEquip = async (item) => {
    setProcessing(true);
    const equip = !item.equipped; // toggle
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/character/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id, inventoryId: item.id, equip }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Update local state without full refetch for better UX
      setInventory(prev => prev.map(invItem => {
        // If we equipped an item, unequip other items of the same type
        if (equip && invItem.equipment.type === item.equipment.type) {
          if (invItem.id === item.id) return { ...invItem, equipped: true };
          return { ...invItem, equipped: false };
        }
        // If we unequipped this item
        if (!equip && invItem.id === item.id) {
          return { ...invItem, equipped: false };
        }
        return invItem;
      }));
      
      // Reload character to get updated stats on profile if needed
      await loadCharacter(user.id);
    } catch (err) {
      showModal('Erro', err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = filter === 'all' 
    ? inventory 
    : inventory.filter(i => i.equipment?.type === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Backpack size={24} color="var(--accent)" />
          Mochila
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Equipe seus itens para ganhar vantagens em batalha.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
          style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 20 }}
        >
          Todos
        </button>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button 
            key={type}
            onClick={() => setFilter(type)}
            className={`btn ${filter === type ? 'btn-primary' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 20, whiteSpace: 'nowrap' }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando mochila...</div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: 'center', borderRadius: 'var(--radius)' }}>
          Você não possui itens {filter !== 'all' ? 'desse tipo ' : ''}na sua mochila.
        </div>
      ) : (
        <div className="grid-layout">
          {filtered.map(item => {
            const eq = item.equipment;
            const Icon = TYPE_ICONS[eq.type] || Backpack;
            const rarityColor = RARITY_COLORS[eq.rarity] || RARITY_COLORS.common;
            
            // Format stats (e.g., {"strength": 3})
            const stats = eq.stats ? Object.entries(eq.stats).map(([k,v]) => `+${v} ${k}`).join(', ') : '';

            return (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass ${item.equipped ? 'glow' : ''}`} 
                style={{ 
                  borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column',
                  border: item.equipped ? `1px solid var(--accent-border)` : '1px solid var(--border)'
                }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10,
                    border: `1px solid ${rarityColor}55`, color: rarityColor
                  }}>
                    <Icon size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: rarityColor }}>{eq.name} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>x{item.quantity}</span></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{TYPE_LABELS[eq.type]}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12, flex: 1, lineHeight: 1.4 }}>
                  {eq.description}
                </div>
                
                {stats && (
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginBottom: 16, padding: '6px 10px', background: 'rgba(16,185,129,0.1)', borderRadius: 6 }}>
                    {stats}
                  </div>
                )}

                <button 
                  className={`btn ${item.equipped ? '' : 'btn-primary'}`} 
                  style={{ width: '100%', opacity: processing ? 0.5 : 1 }}
                  disabled={processing}
                  onClick={() => handleEquip(item)}
                >
                  {item.equipped ? 'Desequipar' : 'Equipar'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
