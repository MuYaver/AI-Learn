'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';

export default function LeaderboardPage() {
  const { user, loading } = useUser();
  const [rankings, setRankings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const league = user?.league || 'bronze';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      fetch('/api/leaderboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((d) => {
          setRankings(d.rankings || []);
        })
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">🏅</div>
      </div>
    );
  }

  if (!user) return null;

  const leagueEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎', obsidian: '🖤' };
  const leagueColors = { bronze: 'from-amber-700 to-amber-800', silver: 'from-gray-400 to-gray-500', gold: 'from-yellow-400 to-yellow-500', diamond: 'from-blue-400 to-blue-500', obsidian: 'from-purple-700 to-purple-900' };

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className={`inline-block bg-gradient-to-r ${leagueColors[league] || leagueColors.bronze} text-white rounded-2xl px-6 py-4 mb-4`}>
            <p className="text-sm opacity-80">Your League</p>
            <h1 className="text-2xl font-bold capitalize">{league} League {leagueEmoji[league]}</h1>
          </div>
          <p className="text-duo-text-secondary text-sm">Weekly XP leaderboard — resets every Sunday</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-duo-border overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-duo-surface text-xs font-bold text-duo-text-secondary uppercase">
            <span className="col-span-2">Rank</span>
            <span className="col-span-7">Player</span>
            <span className="col-span-3 text-right">Weekly XP</span>
          </div>

          {rankings.map((entry, idx) => {
            const isMe = entry.user_id === user.id;
            let rankColor = '';
            if (idx === 0) rankColor = 'text-yellow-500';
            else if (idx === 1) rankColor = 'text-gray-400';
            else if (idx === 2) rankColor = 'text-amber-700';

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`grid grid-cols-12 gap-2 px-4 py-3.5 border-t border-duo-border items-center
                  ${isMe ? 'bg-duo-green/5' : ''}`}
              >
                <span className={`col-span-2 font-bold text-lg ${rankColor}`}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </span>
                <div className="col-span-7 flex items-center gap-2">
                  <span className="font-medium">{entry.username}</span>
                  {isMe && (
                    <span className="text-xs bg-duo-green/20 text-duo-green px-2 py-0.5 rounded-full font-bold">YOU</span>
                  )}
                </div>
                <span className="col-span-3 text-right font-bold text-duo-blue">{entry.weekly_xp} XP</span>
              </motion.div>
            );
          })}

          {rankings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🏅</p>
              <p className="text-duo-text-secondary">No rankings yet. Start learning to appear on the board!</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-duo-border p-5">
          <h3 className="font-bold text-duo-text mb-2">How it works</h3>
          <ul className="text-sm text-duo-text-secondary space-y-2">
            <li>• Earn XP by completing lessons each week</li>
            <li>• Top 7 promote to the next league</li>
            <li>• Bottom 5 demote to the previous league</li>
            <li>• Leagues reset every Sunday at midnight</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
