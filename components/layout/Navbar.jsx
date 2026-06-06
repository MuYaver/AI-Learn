'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function TopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

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
              <div className="flex items-center gap-1.5 bg-duo-orange/10 px-3 py-1.5 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-duo-orange text-sm">{user.streak || 0}</span>
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
