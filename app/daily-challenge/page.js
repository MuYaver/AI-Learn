'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';

export default function DailyChallengePage() {
  const { user, loading, refreshUser } = useUser();
  const [challenge, setChallenge] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetch('/api/daily-challenge', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((d) => {
          setChallenge(d.challenge);
          setProgress(d.progress || 0);
        })
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/daily-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ challengeId: challenge.id }),
      });
      const data = await res.json();
      if (data.success) {
        setChallenge((prev) => ({ ...prev, completed: true }));
        await refreshUser();
      }
    } catch {
    } finally {
      setClaiming(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">🎯</div>
      </div>
    );
  }

  if (!user) return null;

  const completed = challenge?.completed || false;
  const targetType = challenge?.target_type;
  const targetValue = challenge?.target_value || 0;
  const pct = targetValue > 0 ? Math.min(100, Math.round((progress / targetValue) * 100)) : 0;

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-duo-text">Daily Challenge</h1>
          <p className="text-duo-text-secondary mt-1">Complete today&apos;s challenge for bonus rewards!</p>
        </div>

        {challenge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl shadow-lg border p-8 max-w-md mx-auto text-center ${
              completed ? 'border-duo-yellow/50' : 'border-duo-border'
            }`}
          >
            <div className="text-5xl mb-4">
              {completed ? '🏆' : targetType === 'lessons_today' ? '📚' : targetType === 'xp_today' ? '⚡' : '💯'}
            </div>
            <h2 className="text-xl font-bold text-duo-text mb-2">{challenge.title}</h2>
            <p className="text-duo-text-secondary mb-6">{challenge.description}</p>

            {!completed && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-duo-text-secondary">Progress</span>
                  <span className="font-bold text-duo-green">{progress}/{targetValue}</span>
                </div>
                <div className="h-3 bg-duo-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-duo-yellow rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-1 text-duo-blue font-bold">
                <span>⚡</span> +{challenge.reward_xp} XP
              </div>
              <div className="flex items-center gap-1 text-duo-blue font-bold">
                <span>💎</span> +{challenge.reward_gems} Gems
              </div>
            </div>

            {completed ? (
              <div className="bg-duo-yellow/10 rounded-xl p-4">
                <p className="text-duo-green font-bold text-lg">✅ Completed!</p>
                <p className="text-duo-text-secondary text-sm mt-1">Come back tomorrow for a new challenge</p>
              </div>
            ) : pct >= 100 ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-3.5 rounded-xl bg-duo-yellow text-white font-bold text-lg
                           hover:bg-duo-yellow/90 transition-all shadow-lg shadow-duo-yellow/30
                           disabled:opacity-50 animate-pulse-glow"
              >
                {claiming ? 'Claiming...' : 'Claim Reward! 🎉'}
              </button>
            ) : (
              <button
                onClick={() => router.push('/')}
                className="w-full py-3.5 rounded-xl bg-duo-green text-white font-bold text-lg
                           hover:bg-duo-green-dark transition-all shadow-lg shadow-duo-green/30"
              >
                Start a Lesson
              </button>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-duo-text-secondary">No daily challenge available right now.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
