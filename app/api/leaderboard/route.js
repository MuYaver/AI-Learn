import { getUserFromRequest, refillHearts } from '@/lib/auth';
import { queryAll, runSql } from '@/lib/db';

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split('T')[0];
}

export async function GET(request) {
  try {
    let user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    user = refillHearts(user);

    const weekStart = getWeekStart();

    const existing = queryAll('SELECT * FROM leaderboard WHERE week_start = ? ORDER BY weekly_xp DESC', [weekStart]);

    if (existing.length === 0) {
      const users = queryAll('SELECT id, username FROM users');
      for (const u of users) {
        runSql(
          'INSERT OR IGNORE INTO leaderboard (user_id, weekly_xp, league, week_start) VALUES (?, 0, ?, ?)',
          [u.id, user.league || 'bronze', weekStart]
        );
      }
    }

    const rankings = queryAll(
      `SELECT l.weekly_xp, l.league, u.id as user_id, u.username
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       WHERE l.week_start = ?
       ORDER BY l.weekly_xp DESC
       LIMIT 20`,
      [weekStart]
    );

    return Response.json({ rankings, league: user.league });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
