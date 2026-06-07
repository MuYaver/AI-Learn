import { queryOne, queryAll } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const lesson = await queryOne('SELECT * FROM lessons WHERE id = ?', [id]);
    if (!lesson) {
      return Response.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const exercises = await queryAll(
      'SELECT id, type, question, options, correct_answer, explanation, "order" FROM exercises WHERE lesson_id = ? ORDER BY "order"',
      [id]
    );

    exercises.forEach((ex) => {
      if (ex.options) {
        try {
          ex.options = JSON.parse(ex.options);
        } catch {
          ex.options = [];
        }
      }
    });

    const videos = await queryAll(
      'SELECT id, title, url, "order" FROM videos WHERE lesson_id = ? ORDER BY "order"',
      [id]
    );

    return Response.json({ lesson, exercises, videos });
  } catch (error) {
    console.error('Get lesson error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
