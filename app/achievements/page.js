'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';

export default function AchievementsPage() {
  const { user, loading } = useUser();
  const [achievements, setAchievements] = useState([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetch('/api/achievements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((d) => setAchievements(d.achievements || []))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">🏆</div>
      </div>
    );
  }

  if (!user) return null;

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-duo-text mb-2">Achievements</h1>
        <p className="text-duo-text-secondary text-sm mb-6">
          {unlocked.length}/{achievements.length} unlocked
        </p>

        {unlocked.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-duo-text-secondary uppercase tracking-wide mb-3">Unlocked</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {unlocked.map((ach, idx) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl p-4 text-center border border-duo-green/30 shadow-sm"
                >
                  <div className="text-4xl mb-2">{ach.icon}</div>
                  <h3 className="font-bold text-duo-text text-sm">{ach.name}</h3>
                  <p className="text-xs text-duo-text-secondary mt-1">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-bold text-duo-text-secondary uppercase tracking-wide mb-3">Locked</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {locked.map((ach, idx) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 text-center border border-duo-border opacity-50"
              >
                <div className="text-4xl mb-2 grayscale">{ach.icon}</div>
                <h3 className="font-bold text-duo-text text-sm">{ach.name}</h3>
                <p className="text-xs text-duo-text-secondary mt-1">{ach.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
