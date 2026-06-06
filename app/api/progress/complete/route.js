import { getUserFromRequest, updateStreak, refillHearts } from '@/lib/auth';
import { queryOne, queryAll, runSql } from '@/lib/db';

function checkAchievements(userId) {
  const user = queryOne('SELECT * FROM users WHERE id = ?', [userId]);
  const lessonsCompleted = queryOne(
    'SELECT COUNT(*) as count FROM user_lesson_progress WHERE user_id = ? AND completed = 1',
    [userId]
  );
  const perfectCount = queryOne(
    'SELECT COUNT(*) as count FROM user_lesson_progress WHERE user_id = ? AND completed = 1 AND score = 100',
    [userId]
  );

  const achievements = queryAll('SELECT * FROM achievements');
  const unlocked = new Set(
    queryAll('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [userId]).map((r) => r.achievement_id)
  );

  const newlyUnlocked = [];

  for (const ach of achievements) {
    if (unlocked.has(ach.id)) continue;
    let meetsCriteria = false;

    switch (ach.criteria_type) {
      case 'lessons_completed':
        meetsCriteria = lessonsCompleted.count >= ach.criteria_value;
        break;
      case 'total_xp':
        meetsCriteria = user.xp >= ach.criteria_value;
        break;
      case 'streak':
        meetsCriteria = user.streak >= ach.criteria_value;
        break;
      case 'perfect_lesson':
        meetsCriteria = perfectCount.count >= ach.criteria_value;
        break;
      case 'gems_collected':
        meetsCriteria = user.gems >= ach.criteria_value;
        break;
    }

    if (meetsCriteria) {
      runSql(
        'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
        [userId, ach.id]
      );
      runSql('UPDATE users SET xp = xp + ?, gems = gems + ? WHERE id = ?', [ach.reward_xp, ach.reward_gems, userId]);
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}

export async function POST(request) {
  try {
    let user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    user = refillHearts(user);

    const { lessonId, score, heartsLost } = await request.json();

    if (!lessonId || score === undefined) {
      return Response.json({ error: 'lessonId and score are required' }, { status: 400 });
    }

    const lesson = queryOne('SELECT * FROM lessons WHERE id = ?', [lessonId]);
    if (!lesson) {
      return Response.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const existing = queryOne(
      'SELECT * FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?',
      [user.id, lessonId]
    );

    let xpGain = score * 2;
    let gemsGain = score >= 80 ? 5 : score >= 60 ? 3 : score >= 40 ? 1 : 0;

    if (existing) {
      if (!existing.completed) {
        runSql(
          `UPDATE user_lesson_progress SET completed = 1, score = ?,
           xp_earned = ?, gems_earned = ?, hearts_lost = ?, completed_at = datetime('now')
           WHERE id = ?`,
          [score, xpGain, gemsGain, heartsLost || 0, existing.id]
        );
      }
    } else {
      runSql(
        `INSERT INTO user_lesson_progress (user_id, lesson_id, completed, score, xp_earned, gems_earned, hearts_lost, completed_at)
         VALUES (?, ?, 1, ?, ?, ?, ?, datetime('now'))`,
        [user.id, lessonId, score, xpGain, gemsGain, heartsLost || 0]
      );
    }

    const heartsToLose = heartsLost || 0;
    const newHearts = Math.max(0, user.hearts - heartsToLose);
    let heartsRefillAt = user.hearts_refill_at;
    if (heartsToLose > 0 && heartsRefillAt === null) {
      heartsRefillAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();
    }

    runSql(
      'UPDATE users SET xp = xp + ?, gems = gems + ?, hearts = ?, hearts_refill_at = ? WHERE id = ?',
      [xpGain, gemsGain, newHearts, heartsRefillAt, user.id]
    );

    user = updateStreak({ ...user, xp: user.xp + xpGain, gems: user.gems + gemsGain, hearts: newHearts, hearts_refill_at: heartsRefillAt });

    const weekStart = (() => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(now.setDate(diff)).toISOString().split('T')[0];
    })();
    runSql(
      'UPDATE leaderboard SET weekly_xp = weekly_xp + ? WHERE user_id = ? AND week_start = ?',
      [xpGain, user.id, weekStart]
    );

    const newAchievements = checkAchievements(user.id);

    const { password_hash, ...safeUser } = queryOne('SELECT * FROM users WHERE id = ?', [user.id]);
    return Response.json({
      user: safeUser,
      xpGain,
      gemsGain,
      newAchievements,
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
