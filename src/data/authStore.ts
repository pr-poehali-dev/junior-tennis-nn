import { PLAYERS, PlayerData, SessionUser } from './mockData';

// In-memory store для сессии и данных (сбрасывается при перезагрузке)
let currentSession: SessionUser | null = null;
let playersStore: PlayerData[] = [...PLAYERS];

// Аккаунт организатора (один демо)
export const ORGANIZER_ACCOUNT = {
  id: 100,
  name: 'Организатор',
  emoji: '🎯',
  password: 'org123',
  role: 'organizer' as const,
  tournamentsCreated: 1,
  ratings: [8.5],
  get avgRating() {
    if (!this.ratings.length) return 0;
    return Math.round(this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length * 100) / 100;
  },
};

// Аккаунт админа
export const ADMIN_ACCOUNT = {
  id: 999,
  name: 'Администратор',
  emoji: '🛡️',
  password: 'admin2026',
  role: 'admin' as const,
};

export function getSession(): SessionUser | null {
  return currentSession;
}

export function setSession(user: SessionUser | null) {
  currentSession = user;
}

export function getPlayers(): PlayerData[] {
  return playersStore;
}

export function addPlayer(player: PlayerData) {
  playersStore = [...playersStore, player];
}

export function updatePlayer(id: number, updates: Partial<PlayerData>) {
  playersStore = playersStore.map(p => p.id === id ? { ...p, ...updates } : p);
}

export function isNicknameTaken(nickname: string, excludeId?: number): boolean {
  return playersStore.some(p => p.nickname.toLowerCase() === nickname.toLowerCase() && p.id !== excludeId);
}

export function loginWithPassword(password: string): SessionUser | null {
  // Admin
  if (password === ADMIN_ACCOUNT.password) {
    const session = { id: ADMIN_ACCOUNT.id, role: ADMIN_ACCOUNT.role, name: ADMIN_ACCOUNT.name, emoji: ADMIN_ACCOUNT.emoji };
    setSession(session);
    return session;
  }
  // Organizer
  if (password === ORGANIZER_ACCOUNT.password) {
    const session = { id: ORGANIZER_ACCOUNT.id, role: ORGANIZER_ACCOUNT.role, name: ORGANIZER_ACCOUNT.name, emoji: ORGANIZER_ACCOUNT.emoji };
    setSession(session);
    return session;
  }
  // Player
  const player = playersStore.find(p => p.password === password);
  if (player) {
    const session: SessionUser = {
      id: player.id,
      role: player.role,
      name: `${player.firstName} ${player.lastName}`,
      emoji: player.emoji,
    };
    setSession(session);
    return session;
  }
  return null;
}

export function logout() {
  setSession(null);
}

export function nextPlayerId(): number {
  const ids = playersStore.map(p => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}
