import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NNO_CITIES, PlayerData } from '@/data/mockData';
import { loginWithPassword, isNicknameTaken, addPlayer, nextPlayerId } from '@/data/authStore';

const EMOJI_OPTIONS = ['🎾','⚡','🏆','⭐','🔥','💪','🎯','🦁','🐯','🦅','🌟','🌊','🚀','🏅','👑'];

type Mode = 'choose' | 'login' | 'register-player' | 'register-organizer';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('choose');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login
  const [password, setPassword] = useState('');

  // Register player
  const [form, setForm] = useState({
    firstName: '', lastName: '', nickname: '', emoji: '🎾',
    birthDate: '', city: NNO_CITIES[0], coach: '',
    hand: 'right' as 'right' | 'left',
    gender: 'male' as 'male' | 'female',
    password: '', confirmPassword: '',
  });
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'taken' | 'ok'>('idle');

  const handleLogin = () => {
    setError('');
    const user = loginWithPassword(password);
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'organizer') navigate('/organizer');
      else navigate('/profile');
    } else {
      setError('Неверный пароль');
    }
  };

  const checkNickname = (nick: string) => {
    setForm(f => ({ ...f, nickname: nick }));
    if (!nick) { setNicknameStatus('idle'); return; }
    setNicknameStatus(isNicknameTaken(nick) ? 'taken' : 'ok');
  };

  const handleRegisterPlayer = () => {
    setError('');
    if (!form.firstName || !form.lastName || !form.nickname || !form.birthDate || !form.coach || !form.password) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }
    if (isNicknameTaken(form.nickname)) {
      setError('Этот никнейм уже занят');
      return;
    }
    const today = new Date();
    const birth = new Date(form.birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 10 || age > 16) {
      setError('Возраст должен быть от 10 до 16 лет');
      return;
    }

    const newPlayer: PlayerData = {
      id: nextPlayerId(),
      firstName: form.firstName,
      lastName: form.lastName,
      nickname: form.nickname,
      emoji: form.emoji,
      birthDate: form.birthDate,
      city: form.city,
      coach: form.coach,
      hand: form.hand,
      gender: form.gender,
      rating: 0,
      tournaments: 0,
      rank: 0,
      rankChange: 0,
      rankHistory: [],
      password: form.password,
      role: 'player',
    };
    addPlayer(newPlayer);
    loginWithPassword(form.password);
    setSuccess('Профиль создан!');
    setTimeout(() => navigate('/profile'), 1000);
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tennis-green-dark via-tennis-green to-tennis-green-light flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎾</div>
            <h1 className="font-oswald text-3xl font-bold text-white mb-1">ЛДТТНН</h1>
            <p className="text-white/60 text-sm">Детский теннисный тур Нижнего Новгорода</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-3">
            <button onClick={() => setMode('login')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-tennis-green hover:bg-tennis-green/5 transition-all group">
              <div className="w-10 h-10 bg-tennis-green/10 rounded-xl flex items-center justify-center group-hover:bg-tennis-green/20 transition-colors">
                <Icon name="LogIn" size={20} className="text-tennis-green" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Войти в профиль</div>
                <div className="text-xs text-muted-foreground">Введите пароль от существующего аккаунта</div>
              </div>
              <Icon name="ChevronRight" size={18} className="ml-auto text-muted-foreground" />
            </button>

            <button onClick={() => setMode('register-player')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-tennis-yellow hover:bg-tennis-yellow/5 transition-all group">
              <div className="w-10 h-10 bg-tennis-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-tennis-yellow/30 transition-colors">
                <span className="text-lg">🎾</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Создать аккаунт игрока</div>
                <div className="text-xs text-muted-foreground">Для участия в турнирах, возраст 10–16 лет</div>
              </div>
              <Icon name="ChevronRight" size={18} className="ml-auto text-muted-foreground" />
            </button>

            <button onClick={() => setMode('register-organizer')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-lg">🎯</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Создать аккаунт организатора</div>
                <div className="text-xs text-muted-foreground">Для проведения турниров</div>
              </div>
              <Icon name="ChevronRight" size={18} className="ml-auto text-muted-foreground" />
            </button>
          </div>

          <button onClick={() => navigate('/')} className="w-full text-center text-white/50 hover:text-white/80 text-sm mt-6 transition-colors">
            ← Вернуться на сайт
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tennis-green-dark via-tennis-green to-tennis-green-light flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button onClick={() => setMode('choose')} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <Icon name="ChevronLeft" size={16} /> Назад
          </button>
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="font-oswald text-2xl font-bold text-tennis-green mb-1">Войти</h2>
            <p className="text-muted-foreground text-sm mb-6">Введите пароль от вашего профиля</p>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Пароль</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Введите пароль" />
              </div>
              <Button onClick={handleLogin} className="w-full bg-tennis-green hover:bg-tennis-green-light text-white font-bold py-3">
                Войти
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'register-organizer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tennis-green-dark via-tennis-green to-tennis-green-light flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button onClick={() => setMode('choose')} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <Icon name="ChevronLeft" size={16} /> Назад
          </button>
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="font-oswald text-2xl font-bold text-tennis-green mb-1">Стать организатором</h2>
            <p className="text-muted-foreground text-sm mb-6">Для проведения турниров нужно одобрение администратора</p>
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mb-4">
              <div className="font-bold mb-1">Как это работает:</div>
              <div>1. Вы заполняете заявку</div>
              <div>2. Администратор проверяет и выдаёт доступ</div>
              <div>3. Вы получаете пароль в профиле организатора</div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
              Отправить заявку
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Register player
  return (
    <div className="min-h-screen bg-gradient-to-br from-tennis-green-dark via-tennis-green to-tennis-green-light flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <button onClick={() => setMode('choose')} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <Icon name="ChevronLeft" size={16} /> Назад
        </button>
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="font-oswald text-2xl font-bold text-tennis-green mb-1">Создать профиль игрока</h2>
          <p className="text-muted-foreground text-sm mb-6">Все поля обязательны</p>

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2"><Icon name="CheckCircle" size={16} />{success}</div>}

          <div className="space-y-4">
            {/* Emoji picker */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Аватар-эмодзи</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className={`text-xl w-10 h-10 rounded-xl transition-all ${form.emoji === e ? 'bg-tennis-green ring-2 ring-tennis-green ring-offset-2' : 'bg-muted hover:bg-muted/80'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Имя *</label>
                <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Александр" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Фамилия *</label>
                <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Громов" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Никнейм * <span className="text-muted-foreground font-normal">(уникальный)</span></label>
              <div className="relative">
                <Input value={form.nickname} onChange={e => checkNickname(e.target.value)} placeholder="Гром" />
                {nicknameStatus === 'taken' && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Icon name="X" size={16} /></div>}
                {nicknameStatus === 'ok' && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"><Icon name="Check" size={16} /></div>}
              </div>
              {nicknameStatus === 'taken' && <p className="text-xs text-red-500 mt-1">Никнейм уже занят</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Дата рождения *</label>
                <Input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Пол *</label>
                <div className="flex gap-1 h-10 bg-muted rounded-lg p-1">
                  <button onClick={() => setForm(f => ({ ...f, gender: 'male' }))}
                    className={`flex-1 rounded-md text-sm font-medium transition-all ${form.gender === 'male' ? 'bg-white text-tennis-green shadow-sm' : 'text-muted-foreground'}`}>
                    ♂ Муж.
                  </button>
                  <button onClick={() => setForm(f => ({ ...f, gender: 'female' }))}
                    className={`flex-1 rounded-md text-sm font-medium transition-all ${form.gender === 'female' ? 'bg-white text-tennis-green shadow-sm' : 'text-muted-foreground'}`}>
                    ♀ Жен.
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Город *</label>
              <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
                {NNO_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Тренер * <span className="text-muted-foreground font-normal">(ФИО)</span></label>
              <Input value={form.coach} onChange={e => setForm(f => ({ ...f, coach: e.target.value }))} placeholder="Петров Иван Васильевич" />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Ведущая рука *</label>
              <div className="flex gap-2">
                {[['right', '✋ Правша'], ['left', '🤚 Левша']].map(([val, lbl]) => (
                  <button key={val} onClick={() => setForm(f => ({ ...f, hand: val as 'right' | 'left' }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.hand === val ? 'border-tennis-green bg-tennis-green/10 text-tennis-green font-bold' : 'border-border text-muted-foreground hover:border-tennis-green/40'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3">Придумайте пароль — он нужен для входа в профиль. Запомните его!</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Пароль *</label>
                  <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Минимум 4 символа" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Повторите *</label>
                  <Input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Повторите пароль" />
                </div>
              </div>
            </div>

            <Button onClick={handleRegisterPlayer}
              className="w-full bg-tennis-green hover:bg-tennis-green-light text-white font-bold py-3 mt-2">
              Создать профиль
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
