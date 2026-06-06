import { getUserFromRequest } from '@/lib/auth';
import { queryAll } from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const all = queryAll('SELECT * FROM achievements ORDER BY id');
    const unlockedIds = new Set(
      queryAll('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [user.id])
        .map((r) => r.achievement_id)
    );

    const achievements = all.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
    }));

    return Response.json({ achievements });
  } catch (error) {
    console.error('Achievements error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
