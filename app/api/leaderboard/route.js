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

    user = await refillHearts(user);

    const weekStart = getWeekStart();

    const existing = await queryAll('SELECT * FROM leaderboard WHERE week_start = ? ORDER BY weekly_xp DESC', [weekStart]);

    if (existing.length === 0) {
      const users = await queryAll('SELECT id, username FROM users');
      for (const u of users) {
        await runSql(
          'INSERT INTO leaderboard (user_id, weekly_xp, league, week_start) VALUES (?, 0, ?, ?) ON CONFLICT (user_id) DO NOTHING',
          [u.id, user.league || 'bronze', weekStart]
        );
      }
    }

    const rankings = await queryAll(
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
