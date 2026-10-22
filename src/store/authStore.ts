import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address, User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  updateProfile: (name: string, phone?: string) => Promise<User>;
  saveAddress: (address: Address) => Promise<Address[]>;
  deleteAddress: (addressId: string) => Promise<Address[]>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: authService.getCurrentUser(),
      isAuthenticated: Boolean(authService.getCurrentUser()),

      login: async (email, password) => {
        const user = await authService.login(email, password);
        set({ user, isAuthenticated: true });
        return user;
      },

      signup: async (name, email, password, phone) => {
        const user = await authService.signup(name, email, password, phone);
        set({ user, isAuthenticated: true });
        return user;
      },

      updateProfile: async (name, phone) => {
        const updated = await authService.updateProfile(name, phone);
        set({ user: { ...updated } });
        return updated;
      },

      saveAddress: async (address) => {
        const addresses = await authService.saveAddress(address);
        const current = get().user;
        if (current) {
          set({ user: { ...current, savedAddresses: addresses } });
        }
        return addresses;
      },

      deleteAddress: async (addressId) => {
        const addresses = await authService.deleteAddress(addressId);
        const current = get().user;
        if (current) {
          set({ user: { ...current, savedAddresses: addresses } });
        }
        return addresses;
      },

      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'atv:v1:auth_session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
