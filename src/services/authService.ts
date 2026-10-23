import { Address, User } from '../types';

import { api } from './apiClient';

const AUTH_USER_KEY = 'atv:v1:auth_user';
const AUTH_TOKEN_KEY = 'atv:v1:auth_token';
const USERS_DB_KEY = 'atv:v1:users_db';

interface StoredUserRecord extends User {
  passwordHash: string;
}

function getStoredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUserRecord[]): void {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buffer = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash)}`;
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    // Attempt live API authentication first
    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password });
      if (res && res.accessToken && res.user) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
        const userObj: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          savedAddresses: res.user.addresses || [],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
        return userObj;
      }
    } catch {
      // Backend offline or user not in remote DB; proceed to local fallback
    }

    await new Promise((r) => setTimeout(r, 80));
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    const inputHash = await hashPassword(password);
    const isValid = existing && (existing.passwordHash === inputHash || existing.passwordHash === password);

    if (!existing || !isValid) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (existing.passwordHash === password && existing.passwordHash !== inputHash) {
      existing.passwordHash = inputHash;
      saveStoredUsers(users);
    }

    const { passwordHash: _, ...user } = existing;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, password: string, phone?: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    // Attempt live API registration first
    try {
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone?.trim(),
      });
      if (res && res.accessToken && res.user) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
        const userObj: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          savedAddresses: [],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
        return userObj;
      }
    } catch {
      // Fallback to local storage
    }

    await new Promise((r) => setTimeout(r, 80));
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const passwordHash = await hashPassword(password);

    const newUser: StoredUserRecord = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim(),
      savedAddresses: [],
      passwordHash,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { passwordHash: _, ...user } = newUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  },

  async updateProfile(name: string, phone?: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 60));
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    current.name = name;
    current.phone = phone;

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
    // Update DB
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...current };
      saveStoredUsers(users);
    }

    return current;
  },

  async saveAddress(address: Address): Promise<Address[]> {
    await new Promise((r) => setTimeout(r, 60));
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    const addrId = address.id || `addr-${Date.now()}`;
    const newAddr = { ...address, id: addrId };

    if (address.isDefault) {
      current.savedAddresses.forEach((a) => (a.isDefault = false));
    } else if (current.savedAddresses.length === 0) {
      newAddr.isDefault = true;
    }

    const existingIdx = current.savedAddresses.findIndex((a) => a.id === addrId);
    if (existingIdx !== -1) {
      current.savedAddresses[existingIdx] = newAddr;
    } else {
      current.savedAddresses.push(newAddr);
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
    return current.savedAddresses;
  },

  async deleteAddress(addressId: string): Promise<Address[]> {
    await new Promise((r) => setTimeout(r, 60));
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    current.savedAddresses = current.savedAddresses.filter((a) => a.id !== addressId);
    if (current.savedAddresses.length > 0 && !current.savedAddresses.some((a) => a.isDefault)) {
      current.savedAddresses[0].isDefault = true;
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
    return current.savedAddresses;
  },

  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
