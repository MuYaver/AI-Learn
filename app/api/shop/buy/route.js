import { getUserFromRequest } from '@/lib/auth';
import { queryOne, runSql } from '@/lib/db';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { itemId } = await request.json();
    const item = await queryOne('SELECT * FROM shop_items WHERE id = ?', [itemId]);
    if (!item) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    if (user.gems < item.cost_gems) {
      return Response.json({ error: 'Not enough gems' }, { status: 400 });
    }

    await runSql('UPDATE users SET gems = gems - ? WHERE id = ?', [item.cost_gems, user.id]);

    const existing = await queryOne(
      'SELECT * FROM user_inventory WHERE user_id = ? AND item_id = ?',
      [user.id, itemId]
    );

    if (existing) {
      await runSql('UPDATE user_inventory SET quantity = quantity + 1 WHERE id = ?', [existing.id]);
    } else {
      await runSql(
        'INSERT INTO user_inventory (user_id, item_id, quantity) VALUES (?, ?, 1)',
        [user.id, itemId]
      );
    }

    return Response.json({ success: true, item });
  } catch (error) {
    console.error('Shop buy error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
