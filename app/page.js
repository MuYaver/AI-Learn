'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';

export default function HomePage() {
  const { user, loading, refreshUser } = useUser();
  const [units, setUnits] = useState([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetch('/api/lessons/units', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((d) => setUnits(d.units || []))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">🦉</div>
          <p className="text-duo-text-secondary">Loading your path...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalLessons = units.reduce((sum, u) => sum + u.lessons.length, 0);
  const completedCount = units.reduce((sum, u) => sum + u.lessons.filter((l) => l.completed).length, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-duo-text">Hi, {user.username}! 👋</h1>
            <p className="text-duo-text-secondary mt-1">Continue your AI learning journey</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E5E5" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="#58CC02" strokeWidth="6"
                strokeDasharray={`${overallPct * 1.76} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-duo-green">{overallPct}%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link
            href="/daily-challenge"
            className="flex-1 bg-duo-yellow/10 border border-duo-yellow/30 rounded-2xl p-4
                       hover:bg-duo-yellow/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-duo-text">Daily Challenge</span>
            </div>
            <p className="text-xs text-duo-text-secondary">Earn bonus XP and gems!</p>
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 bg-duo-purple/10 border border-duo-purple/30 rounded-2xl p-4
                       hover:bg-duo-purple/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏅</span>
              <span className="font-bold text-duo-text">Leaderboard</span>
            </div>
            <p className="text-xs text-duo-text-secondary">See how you rank!</p>
          </Link>
        </div>

        <div className="space-y-4">
          {units.map((unit, idx) => {
            const prevComplete = idx === 0 || (units[idx - 1] && units[idx - 1].completed);
            const isLocked = !prevComplete && idx > 0;

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl shadow-sm border transition-all ${
                  isLocked ? 'border-duo-border opacity-50' : unit.completed ? 'border-duo-green/30' : 'border-duo-border hover:border-duo-green/50'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                      ${unit.completed ? 'bg-duo-green text-white' : isLocked ? 'bg-duo-snow text-duo-text-secondary' : 'bg-duo-blue/10 text-duo-blue'}`}>
                      {unit.completed ? '✓' : isLocked ? '🔒' : unit.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-duo-text">{unit.title}</h3>
                      <p className="text-sm text-duo-text-secondary">{unit.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      {unit.completed ? (
                        <span className="text-duo-green font-bold text-sm">Done!</span>
                      ) : isLocked ? null : (
                        <span className="text-xs text-duo-text-secondary">
                          {unit.lessons.filter((l) => l.completed).length}/{unit.lessons.length}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {unit.lessons.map((lesson) => {
                      const isAvailable = !isLocked && (
                        lesson.completed ||
                        unit.lessons.filter((l) => l.order < lesson.order).every((l) => l.completed)
                      );

                      return (
                        <Link
                          key={lesson.id}
                          href={isAvailable ? `/lesson/${lesson.id}` : '#'}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${lesson.completed
                              ? 'bg-duo-green/10 text-duo-green'
                              : isAvailable
                                ? 'bg-duo-surface text-duo-text hover:bg-duo-green/10 hover:text-duo-green'
                                : 'bg-duo-snow text-duo-text-secondary cursor-not-allowed'
                            }`}
                          onClick={(e) => !isAvailable && e.preventDefault()}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                            ${lesson.completed ? 'bg-duo-green text-white' : 'border-2 border-current'}`}>
                            {lesson.completed ? '✓' : lesson.order}
                          </span>
                          <span className="max-w-[120px] truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
