'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';

function HeartTimer({ refillAt }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = new Date(refillAt).getTime() - now;
  if (remaining <= 0) return null;

  const mins = Math.floor(remaining / 60000);
  const hrs = Math.floor(mins / 60);
  const displayMins = mins % 60;

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-duo-red/10 text-duo-red text-sm font-bold whitespace-nowrap">
      <span className="text-xs">⏳</span>
      {hrs > 0 ? `${hrs}h ${displayMins}m` : `${displayMins}m`}
    </div>
  );
}

export default function TopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const heartsFull = (user?.hearts ?? 5) >= 5;
  const showTimer = user && !heartsFull && user.hearts_refill_at;

  return (
    <header className="bg-white border-b border-duo-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦉</span>
          <span className="text-xl font-bold text-duo-green hidden sm:inline">AI Learn</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              {!heartsFull && (
                <>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    (user.streak || 0) > 0
                      ? 'bg-duo-orange/10 text-duo-orange'
                      : 'bg-duo-snow text-duo-text-secondary'
                  }`}>
                    <span className={`text-lg ${(user.streak || 0) > 0 ? '' : 'grayscale opacity-50'}`}>🔥</span>
                    <span className="font-bold text-sm">{user.streak || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-duo-blue/10 px-3 py-1.5 rounded-full">
                    <span className="text-duo-blue font-bold text-sm">{user.xp || 0} XP</span>
                  </div>
                  {showTimer && <HeartTimer refillAt={user.hearts_refill_at} />}
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < (user.hearts ?? 5) ? '' : 'opacity-20'}`}>
                        ❤️
                      </span>
                    ))}
                  </div>
                </>
              )}
              {heartsFull && (
                <>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    (user.streak || 0) > 0
                      ? 'bg-duo-orange/10 text-duo-orange'
                      : 'bg-duo-snow text-duo-text-secondary'
                  }`}>
                    <span className={`text-lg ${(user.streak || 0) > 0 ? '' : 'grayscale opacity-50'}`}>🔥</span>
                    <span className="font-bold text-sm">{user.streak || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-duo-blue/10 px-3 py-1.5 rounded-full">
                    <span className="text-duo-blue font-bold text-sm">{user.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < (user.hearts ?? 5) ? '' : 'opacity-20'}`}>
                        ❤️
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { href: '/', icon: '🏠', label: 'Learn' },
    { href: '/leaderboard', icon: '🏅', label: 'Rank' },
    { href: '/shop', icon: '🛍️', label: 'Shop' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-duo-border z-50 pb-safe">
      <div className="max-w-4xl mx-auto flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-duo-green' : 'text-duo-text-secondary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
