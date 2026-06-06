import { queryAll } from '@/lib/db';
import { getUserFromRequest, refillHearts } from '@/lib/auth';

export async function GET(request) {
  try {
    const units = queryAll('SELECT * FROM units ORDER BY "order"');
    const lessons = queryAll('SELECT * FROM lessons ORDER BY unit_id, "order"');

    let completedLessons = new Set();
    const user = await getUserFromRequest(request);
    if (user) {
      const progress = queryAll(
        'SELECT lesson_id FROM user_lesson_progress WHERE user_id = ? AND completed = 1',
        [user.id]
      );
      progress.forEach((p) => completedLessons.add(p.lesson_id));
    }

    const result = units.map((unit) => {
      const unitLessons = lessons
        .filter((l) => l.unit_id === unit.id)
        .map((l) => ({
          id: l.id,
          title: l.title,
          order: l.order,
          completed: completedLessons.has(l.id),
        }));

      const allComplete = unitLessons.length > 0 && unitLessons.every((l) => l.completed);

      return {
        ...unit,
        lessons: unitLessons,
        completed: allComplete,
      };
    });

    return Response.json({ units: result });
  } catch (error) {
    console.error('Get units error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
