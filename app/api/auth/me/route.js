import { getUserFromRequest, refillHearts } from '@/lib/auth';

export async function GET(request) {
  try {
    let user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    user = await refillHearts(user);

    const { password_hash, ...safeUser } = user;
    return Response.json({ user: safeUser });
  } catch (error) {
    console.error('GetMe error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
