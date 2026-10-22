import { Address, User } from '../types';

const AUTH_USER_KEY = 'atv:v1:auth_user';
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
  } catch (err) {
    console.error('Failed saving users to localStorage', err);
  }
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
    await new Promise((r) => setTimeout(r, 80));
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing || existing.passwordHash !== password) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const { passwordHash: _, ...user } = existing;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, password: string, phone?: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 80));
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser: StoredUserRecord = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim(),
      savedAddresses: [],
      passwordHash: password,
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
  },
};
