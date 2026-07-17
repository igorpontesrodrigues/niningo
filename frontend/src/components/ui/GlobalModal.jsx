import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export default function GlobalModal() {
  const { modal, closeModal } = useUIStore();

  if (!modal.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass glow"
          style={{
            maxWidth: 400, width: '100%',
            padding: '24px',
            borderRadius: '16px',
            background: 'var(--bg-800)',
            border: `1px solid ${modal.type === 'error' ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', marginBottom: 12, color: modal.type === 'error' ? '#ef4444' : 'var(--text-primary)' }}>
            {modal.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 24 }}>
            {modal.message}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => {
                if (modal.onConfirm) modal.onConfirm();
                closeModal();
              }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--accent), #0098b8)',
                border: 'none',
                borderRadius: '8px',
                color: '#070912',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Ok
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
