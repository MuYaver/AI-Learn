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

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-duo-text">Achievements</h1>
            <p className="text-duo-text-secondary text-sm">{unlocked}/{achievements.length} unlocked</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E5E5" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="#CE82FF" strokeWidth="6"
                strokeDasharray={`${achievements.length > 0 ? (unlocked / achievements.length) * 176 : 0} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-duo-purple">{achievements.length > 0 ? Math.round((unlocked / achievements.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl p-4 text-center border-2 transition-all ${
                ach.unlocked
                  ? 'border-duo-green/40 shadow-sm'
                  : 'border-duo-border opacity-60'
              }`}
            >
              <div className={`text-4xl mb-2 ${ach.unlocked ? '' : 'grayscale'}`}>{ach.icon}</div>
              <h3 className="font-bold text-duo-text text-sm">{ach.name}</h3>
              <p className="text-xs text-duo-text-secondary mt-1">{ach.description}</p>
              {ach.unlocked && (
                <div className="mt-2 inline-block bg-duo-green/10 text-duo-green px-2 py-0.5 rounded-full text-xs font-bold">
                  Earned
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
