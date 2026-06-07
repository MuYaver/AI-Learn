import { getUserFromRequest, refillHearts } from '@/lib/auth';
import { queryAll, queryOne } from '@/lib/db';

export async function GET(request) {
  try {
    let user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    user = await refillHearts(user);

    const completedLessons = await queryAll(
      `SELECT l.id, l.title, l.unit_id, u.title as unit_title, ulp.score, ulp.xp_earned, ulp.completed_at
       FROM user_lesson_progress ulp
       JOIN lessons l ON ulp.lesson_id = l.id
       JOIN units u ON l.unit_id = u.id
       WHERE ulp.user_id = ? AND ulp.completed = 1
       ORDER BY ulp.completed_at DESC
       LIMIT 20`,
      [user.id]
    );

    const totalLessons = await queryOne('SELECT COUNT(*) as count FROM lessons');
    const totalCompleted = await queryOne(
      'SELECT COUNT(*) as count FROM user_lesson_progress WHERE user_id = ? AND completed = 1',
      [user.id]
    );

    const achievements = await queryAll(
      `SELECT a.* FROM achievements a
       JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       ORDER BY ua.unlocked_at DESC`,
      [user.id]
    );

    const totalAchievements = await queryOne('SELECT COUNT(*) as count FROM achievements');

    const progressPct = totalLessons.count > 0
      ? Math.round((totalCompleted.count / totalLessons.count) * 100)
      : 0;

    const { password_hash, ...safeUser } = user;
    return Response.json({
      user: safeUser,
      completedLessons,
      totalLessons: totalLessons.count,
      totalCompleted: totalCompleted.count,
      totalAchievements: totalAchievements.count,
      progressPct,
      achievements,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
