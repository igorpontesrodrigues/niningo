export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', gap: '20px',
      background: '#070912',
    }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTop: '3px solid #00d2c8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#8892a4', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        Carregando o mundo ninja...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
