import { create } from 'zustand';

export const useUIStore = create((set) => ({
  modal: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'error', 'success'
    onConfirm: null,
  },
  showModal: (title, message, type = 'info', onConfirm = null) => 
    set({ modal: { isOpen: true, title, message, type, onConfirm } }),
  closeModal: () => 
    set((state) => ({ modal: { ...state.modal, isOpen: false } })),
}));
