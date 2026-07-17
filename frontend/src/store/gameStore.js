import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Travel state
  activeTravel: null,
  setActiveTravel: (travel) => set({ activeTravel: travel }),
  clearTravel: () => set({ activeTravel: null }),

  // Combat state
  activeCombat: null,
  setActiveCombat: (combat) => set({ activeCombat: combat }),
  clearCombat: () => set({ activeCombat: null }),

  // Rested bonus
  restedBonus: null,
  setRestedBonus: (bonus) => set({ restedBonus: bonus }),
  clearRestedBonus: () => set({ restedBonus: null }),

  // Notifications
  notifications: [],
  addNotification: (notif) => set((s) => ({
    notifications: [{ id: Date.now(), ...notif }, ...s.notifications].slice(0, 10),
  })),
  removeNotification: (id) => set((s) => ({
    notifications: s.notifications.filter((n) => n.id !== id),
  })),
}));
