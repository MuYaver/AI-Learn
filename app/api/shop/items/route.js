import { queryAll } from '@/lib/db';

export async function GET() {
  try {
    const items = await queryAll('SELECT * FROM shop_items ORDER BY cost_gems');
    return Response.json({ items });
  } catch (error) {
    console.error('Shop items error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
