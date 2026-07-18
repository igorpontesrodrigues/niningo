import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Map, Scroll, ShoppingBag, User, LogOut, LayoutDashboard, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function MainLayout({ children }) {
  const { user, character, loadCharacter, signOut } = useAuthStore();
  const { showModal } = useUIStore();
  const location = useLocation();

  const [activeMission, setActiveMission] = useState(null);
  const [activeTravel, setActiveTravel] = useState(null);

  // Auto-claim logic
  useEffect(() => {
    if (!character?.id) return;

    const checkTimers = async () => {
      // Check Mission
      try {
        const resM = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/missions/active/${character.id}`);
        const dataM = await resM.json();
        if (dataM.activeMission) {
          if (new Date() >= new Date(dataM.activeMission.completes_at)) {
            // Auto claim
            const resC = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/missions/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ characterId: character.id, charMissionId: dataM.activeMission.id }),
            });
            const dataC = await resC.json();
            if (!dataC.error) {
              showModal('Missão Concluída!', `Seu ninja retornou com sucesso. Você ganhou ${dataC.rewards.xp} XP e ${dataC.rewards.ryo} Ryō.`, 'success');
              await loadCharacter(user.id);
            }
          } else {
            setActiveMission(dataM.activeMission);
          }
        } else {
          setActiveMission(null);
        }
      } catch (err) {}

      // Check Travel
      try {
        const resT = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/status/${character.id}`);
        const dataT = await resT.json();
        if (dataT.travel) {
          if (new Date() >= new Date(dataT.travel.arrives_at)) {
            // Auto arrive
            const resA = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/travel/arrive`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ characterId: character.id, travelId: dataT.travel.id }),
            });
            const dataA = await resA.json();
            if (!dataA.error) {
              showModal('Viagem Concluída!', `Você desembarcou em ${dataT.travel.to_location.name}.`, 'success');
              await loadCharacter(user.id);
            }
          } else {
            setActiveTravel(dataT.travel);
          }
        } else {
          setActiveTravel(null);
        }
      } catch (err) {}
    };

    checkTimers();
    const interval = setInterval(checkTimers, 5000);
    return () => clearInterval(interval);
  }, [character?.id]);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Início' },
    { to: '/map',       icon: Map,             label: 'Mapa' },
    { to: '/missions',  icon: Scroll,          label: 'Missões' },
    { to: '/shop',      icon: ShoppingBag,     label: 'Loja' },
    { to: '/profile',   icon: User,            label: 'Perfil' },
  ];

  return (
    <div className="main-layout" data-village={character?.villages?.slug}>
      
      {/* SIDEBAR (Desktop) */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="sidebar-logo">⛩️</div>
          <h2 className="sidebar-title">Ninin Go</h2>
          {character && (
            <div className="sidebar-char-info">
              <span className="sidebar-symbol">{character.villages?.symbol}</span>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span className="sidebar-name">{character.name}</span>
                <span className="sidebar-rank">{character.rank?.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {character && (
             <div className="sidebar-ryo">💰 {character.ryo} Ryō</div>
          )}
          <button onClick={signOut} className="btn-logout">
            <LogOut size={18} /> <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="content-area">
        {/* Global Action Banners */}
        <div className="global-banners">
          {activeMission && (
            <Link to="/missions" className="global-banner mission-banner">
               <Clock size={16} /> <span>Missão em andamento...</span>
            </Link>
          )}
          {activeTravel && (
            <Link to="/map" className="global-banner travel-banner">
               <Clock size={16} /> <span>Viajando para {activeTravel.to_location?.name}...</span>
            </Link>
          )}
        </div>
        
        <div className="page-container">
          {children || <Outlet />}
        </div>
      </main>

      {/* BOTTOM BAR (Mobile) */}
      <nav className="bottom-bar glass">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`bottom-link ${isActive ? 'active' : ''}`}>
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
