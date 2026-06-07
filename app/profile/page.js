'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logoutUser } = useUser();
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetch('/api/progress/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((d) => setStats(d))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">👤</div>
      </div>
    );
  }

  if (!user) return null;

  const leagueEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎', obsidian: '🖤' };

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-duo-green/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
            🦉
          </div>
          <h1 className="text-2xl font-bold text-duo-text">{user.username}</h1>
          <p className="text-duo-text-secondary capitalize">{user.league || 'bronze'} League {leagueEmoji[user.league] || ''}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl p-4 text-center border border-duo-border"
          >
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-2xl font-bold text-duo-blue">{user.xp || 0}</p>
            <p className="text-xs text-duo-text-secondary">Total XP</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 text-center border border-duo-border"
          >
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-2xl font-bold text-duo-orange">{user.streak || 0}</p>
            <p className="text-xs text-duo-text-secondary">Day Streak</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 text-center border border-duo-border"
          >
            <div className="text-2xl mb-1">💎</div>
            <p className="text-2xl font-bold text-duo-blue">{user.gems || 0}</p>
            <p className="text-xs text-duo-text-secondary">Gems</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 text-center border border-duo-border"
          >
            <div className="text-2xl mb-1">📚</div>
            <p className="text-2xl font-bold text-duo-green">{stats?.totalCompleted || 0}</p>
            <p className="text-xs text-duo-text-secondary">Lessons Done</p>
          </motion.div>
        </div>

        {stats && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-duo-border p-5 mb-4"
            >
              <h3 className="font-bold text-duo-text mb-3">Overall Progress</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-duo-text-secondary">{stats.totalCompleted} of {stats.totalLessons} lessons</span>
                <span className="font-bold text-duo-green">{stats.progressPct}%</span>
              </div>
              <div className="h-2.5 bg-duo-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-duo-green rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progressPct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {stats.completedLessons && stats.completedLessons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-duo-border p-5"
              >
                <h3 className="font-bold text-duo-text mb-3">Recent Lessons</h3>
                <div className="space-y-2">
                  {stats.completedLessons.slice(0, 5).map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-duo-border last:border-0">
                      <div>
                        <p className="font-medium text-sm text-duo-text">{lesson.title}</p>
                        <p className="text-xs text-duo-text-secondary">{lesson.unit_title}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-duo-green">{lesson.score}%</span>
                        {lesson.xp_earned > 0 && (
                          <p className="text-xs text-duo-blue">+{lesson.xp_earned} XP</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {stats.achievements && stats.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <Link href="/achievements" className="block bg-white rounded-2xl shadow-sm border border-duo-border p-5 hover:border-duo-purple/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-duo-text">Achievements</h3>
                    <span className="text-sm font-bold text-duo-purple">
                      {stats.achievements.length}/{stats.totalAchievements}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {stats.achievements.slice(0, 3).map((ach) => (
                      <div key={ach.id} className="flex items-center gap-1.5 bg-duo-surface px-3 py-1.5 rounded-full">
                        <span>{ach.icon}</span>
                        <span className="text-xs font-medium text-duo-text">{ach.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-1.5 bg-duo-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-duo-purple rounded-full"
                      style={{ width: `${stats.totalAchievements > 0 ? Math.round((stats.achievements.length / stats.totalAchievements) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-duo-text-secondary mt-2">Tap to view all achievements →</p>
                </Link>
              </motion.div>
            )}
          </>
        )}

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl border-2 border-duo-red/30 text-duo-red font-bold
                       hover:bg-duo-red/5 transition-all"
          >
            Log out
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
