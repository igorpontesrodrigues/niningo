export default function StatBar({ label, value, max, type, icon }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 5 }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {value} / {max}
        </span>
      </div>
      <div className="stat-bar">
        <div className={`stat-bar-fill ${type}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
