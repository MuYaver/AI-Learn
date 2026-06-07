import { getUserFromRequest } from '@/lib/auth';
import { queryAll } from '@/lib/db';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const inventory = await queryAll(
      'SELECT * FROM user_inventory WHERE user_id = ?',
      [user.id]
    );

    return Response.json({ inventory });
  } catch (error) {
    console.error('Shop inventory error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
