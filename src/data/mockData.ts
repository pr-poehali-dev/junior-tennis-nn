// ── Города Нижегородской области с теннисными кортами ──
export const NNO_CITIES = [
  'Нижний Новгород', 'Дзержинск', 'Арзамас', 'Бор', 'Саров',
  'Кстово', 'Балахна', 'Городец', 'Павлово', 'Выкса',
  'Богородск', 'Семёнов', 'Лысково', 'Заволжье', 'Навашино',
];

export const VENUES = [
  { id: 1, name: 'Теннисный клуб «Старт»', city: 'Нижний Новгород', address: 'ул. Белинского, 61', type: 'indoor' as const, courts: 4, status: 'open' },
  { id: 2, name: 'Парк Швейцария', city: 'Нижний Новгород', address: 'Верхне-Волжская набережная, 3', type: 'outdoor' as const, courts: 6, status: 'open' },
  { id: 3, name: 'СК «Нагорный»', city: 'Нижний Новгород', address: 'ул. Ванеева, 203', type: 'indoor' as const, courts: 3, status: 'open' },
  { id: 4, name: 'Теннисный корт «Авангард»', city: 'Дзержинск', address: 'ул. Дачная, 12', type: 'outdoor' as const, courts: 4, status: 'open' },
  { id: 5, name: 'СК «Волна»', city: 'Бор', address: 'Советская ул., 34', type: 'indoor' as const, courts: 2, status: 'closed' },
];

// Реальные игроки (пока 1 зарегистрированный)
export const PLAYERS: PlayerData[] = [
  {
    id: 1,
    firstName: 'Александр',
    lastName: 'Громов',
    nickname: 'Гром',
    emoji: '⚡',
    birthDate: '2012-05-13',
    city: 'Нижний Новгород',
    coach: 'Петров И.В.',
    hand: 'right' as const,
    gender: 'male' as const,
    rating: 8,
    tournaments: 1,
    rank: 1,
    rankChange: 0,
    rankHistory: [{ date: '2026-04-13', change: +8, reason: '1 место в турнире «Крытый корт»' }],
    password: '****',
    role: 'player' as const,
  },
];

export type PlayerData = {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string;
  emoji: string;
  birthDate: string;
  city: string;
  coach: string;
  hand: 'right' | 'left';
  gender: 'male' | 'female';
  rating: number;
  tournaments: number;
  rank: number;
  rankChange: number;
  rankHistory: { date: string; change: number; reason: string }[];
  password: string;
  role: 'player' | 'organizer' | 'admin';
};

export type TournamentData = {
  id: number;
  name: string;
  city: string;
  venueId: number;
  venueName: string;
  address: string;
  venueType: 'indoor' | 'outdoor';
  dateStart: string;
  dateEnd: string;
  registrationDeadline: string;
  ageGroup: string;
  category: string;
  maxPlayers: number;
  currentPlayers: number;
  status: 'registration' | 'upcoming' | 'ongoing' | 'completed' | 'pending_approval';
  description: string;
  autoConfirm: boolean;
  genderRestriction: 'male' | 'female' | 'mixed' | null;
  format: 'singles' | 'doubles' | 'mixed_doubles';
  contact: string;
  organizerId: number | null;
  photos: GalleryPhoto[];
  rating?: number; // organizer rating
};

export type GalleryPhoto = {
  id: number;
  url: string;
  caption: string;
  tournamentId: number;
  tournamentName: string;
  date: string;
};

// Все турниры (реальный статус — только 1 завершённый, остальные предстоящие)
export const TOURNAMENTS: TournamentData[] = [
  {
    id: 1,
    name: 'Весенний Кубок ЛДТТНН',
    city: 'Нижний Новгород',
    venueId: 2,
    venueName: 'Парк Швейцария',
    address: 'Верхне-Волжская набережная, 3',
    venueType: 'outdoor',
    dateStart: '2026-05-24',
    dateEnd: '2026-05-25',
    registrationDeadline: '2026-05-20',
    ageGroup: '10-14',
    category: 'Любительский',
    maxPlayers: 8,
    currentPlayers: 1,
    status: 'registration',
    description: 'Традиционный весенний турнир на открытых кортах в живописном парке Швейцария.',
    autoConfirm: true,
    genderRestriction: null,
    format: 'singles',
    contact: '+7 (831) 123-45-67',
    organizerId: null,
    photos: [],
  },
  {
    id: 2,
    name: 'Первенство области — Лето 2026',
    city: 'Дзержинск',
    venueId: 4,
    venueName: 'Теннисный корт «Авангард»',
    address: 'ул. Дачная, 12',
    venueType: 'outdoor',
    dateStart: '2026-06-07',
    dateEnd: '2026-06-08',
    registrationDeadline: '2026-06-01',
    ageGroup: '12-16',
    category: 'Первенство',
    maxPlayers: 16,
    currentPlayers: 0,
    status: 'registration',
    description: 'Главный летний турнир для старшей возрастной группы.',
    autoConfirm: false,
    genderRestriction: null,
    format: 'singles',
    contact: '+7 (831) 234-56-78',
    organizerId: null,
    photos: [],
  },
  {
    id: 3,
    name: 'Турнир «Крытый корт»',
    city: 'Нижний Новгород',
    venueId: 1,
    venueName: 'Теннисный клуб «Старт»',
    address: 'ул. Белинского, 61',
    venueType: 'indoor',
    dateStart: '2026-04-12',
    dateEnd: '2026-04-13',
    registrationDeadline: '2026-04-08',
    ageGroup: '10-16',
    category: 'Любительский',
    maxPlayers: 8,
    currentPlayers: 1,
    status: 'completed',
    description: 'Первый турнир сезона на крытых кортах клуба Старт.',
    autoConfirm: true,
    genderRestriction: null,
    format: 'singles',
    contact: '+7 (831) 345-67-89',
    organizerId: null,
    photos: [
      { id: 1, url: '/placeholder.svg', caption: 'Финальный матч', tournamentId: 3, tournamentName: 'Турнир «Крытый корт»', date: '2026-04-13' },
      { id: 2, url: '/placeholder.svg', caption: 'Награждение победителя', tournamentId: 3, tournamentName: 'Турнир «Крытый корт»', date: '2026-04-13' },
    ],
    rating: 8.5,
  },
  {
    id: 4,
    name: 'Кубок Нагорного района',
    city: 'Нижний Новгород',
    venueId: 3,
    venueName: 'СК «Нагорный»',
    address: 'ул. Ванеева, 203',
    venueType: 'indoor',
    dateStart: '2026-07-19',
    dateEnd: '2026-07-20',
    registrationDeadline: '2026-07-14',
    ageGroup: '10-12',
    category: 'Районный',
    maxPlayers: 8,
    currentPlayers: 0,
    status: 'upcoming',
    description: 'Турнир для самых юных участников, возраст 10–12 лет.',
    autoConfirm: true,
    genderRestriction: null,
    format: 'singles',
    contact: '+7 (831) 456-78-90',
    organizerId: null,
    photos: [],
  },
];

// Статистика платформы (реальная)
export const PLATFORM_STATS = {
  players: 1,         // 1 зарегистрированный игрок
  tournaments: 1,     // 1 проведённый турнир
  cities: 1,          // 1 город с активностью
  updatedAt: new Date().toISOString(),
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 1, url: '/placeholder.svg', caption: 'Финальный матч — Турнир «Крытый корт»', tournamentId: 3, tournamentName: 'Турнир «Крытый корт»', date: '2026-04-13' },
  { id: 2, url: '/placeholder.svg', caption: 'Награждение победителя', tournamentId: 3, tournamentName: 'Турнир «Крытый корт»', date: '2026-04-13' },
];

// Контакты (редактируется админом)
export const SITE_CONTACTS = {
  phone: '',
  email: '',
  vk: '',
  telegram: '',
  address: '',
};

export const TOURNAMENT_RESULTS = {
  3: {
    groups: [
      {
        name: 'Группа A',
        players: [PLAYERS[0]],
        results: [] as { p1: number; p2: number; score: string }[],
        standings: [
          { player: PLAYERS[0], w: 3, l: 0, pts: 6 },
        ],
      },
    ],
    playoff: {
      semiFinals: null,
      final: { p1: PLAYERS[0], p2: PLAYERS[0], score: 'W/O', winner: PLAYERS[0] },
      thirdPlace: null as null | { p1: typeof PLAYERS[0]; p2: typeof PLAYERS[0]; score: string; winner: typeof PLAYERS[0] },
    },
    finalStandings: [
      { place: 1, player: PLAYERS[0], points: 8 },
    ],
  },
};

// Сессия авторизации (хранится в памяти)
export type SessionUser = {
  id: number;
  role: 'player' | 'organizer' | 'admin';
  name: string;
  emoji: string;
};
