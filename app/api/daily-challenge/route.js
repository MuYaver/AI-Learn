import { getUserFromRequest } from '@/lib/auth';
import { queryOne, queryAll, runSql } from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];
    const challenge = await queryOne('SELECT * FROM daily_challenges WHERE challenge_date = ?', [today]);

    if (!challenge) {
      return Response.json({ challenge: null, progress: 0 });
    }

    const userChallenge = await queryOne(
      'SELECT * FROM user_daily_challenges WHERE user_id = ? AND challenge_id = ?',
      [user.id, challenge.id]
    );

    let progress = 0;
    if (challenge.target_type === 'lessons_today') {
      const count = await queryOne(
        `SELECT COUNT(*) as count FROM user_lesson_progress
         WHERE user_id = ? AND completed = 1 AND completed_at::date = ?`,
        [user.id, today]
      );
      progress = count.count;
    } else if (challenge.target_type === 'xp_today') {
      const xpSum = await queryOne(
        `SELECT COALESCE(SUM(xp_earned), 0) as total FROM user_lesson_progress
         WHERE user_id = ? AND completed = 1 AND completed_at::date = ?`,
        [user.id, today]
      );
      progress = xpSum.total;
    } else if (challenge.target_type === 'perfect_lesson') {
      const perfect = await queryOne(
        `SELECT COUNT(*) as count FROM user_lesson_progress
         WHERE user_id = ? AND completed = 1 AND score = 100 AND completed_at::date = ?`,
        [user.id, today]
      );
      progress = perfect.count;
    }

    if (userChallenge && progress > 0) {
      await runSql(
        'UPDATE user_daily_challenges SET progress = ? WHERE id = ?',
        [progress, userChallenge.id]
      );
    } else if (!userChallenge && progress > 0) {
      await runSql(
        'INSERT INTO user_daily_challenges (user_id, challenge_id, progress) VALUES (?, ?, ?)',
        [user.id, challenge.id, progress]
      );
    }

    return Response.json({
      challenge,
      progress,
      completed: userChallenge?.completed === 1,
    });
  } catch (error) {
    console.error('Daily challenge error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { challengeId } = await request.json();
    const challenge = await queryOne('SELECT * FROM daily_challenges WHERE id = ?', [challengeId]);
    if (!challenge) {
      return Response.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const existing = await queryOne(
      'SELECT * FROM user_daily_challenges WHERE user_id = ? AND challenge_id = ?',
      [user.id, challengeId]
    );

    if (existing?.completed) {
      return Response.json({ error: 'Already claimed' }, { status: 400 });
    }

    if (!existing || existing.progress < challenge.target_value) {
      return Response.json({ error: 'Challenge not complete yet' }, { status: 400 });
    }

    await runSql(
      'UPDATE user_daily_challenges SET completed = 1, completed_at = NOW() WHERE id = ?',
      [existing.id]
    );

    await runSql(
      'UPDATE users SET xp = xp + ?, gems = gems + ? WHERE id = ?',
      [challenge.reward_xp, challenge.reward_gems, user.id]
    );

    return Response.json({ success: true, xpReward: challenge.reward_xp, gemsReward: challenge.reward_gems });
  } catch (error) {
    console.error('Daily challenge claim error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
