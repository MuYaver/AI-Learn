import { hashPassword, createToken } from '@/lib/auth';
import { queryOne, runSql } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username.length < 3) {
      return Response.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    if (password.length < 4) {
      return Response.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    const existing = await queryOne('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const result = await runSql(
      'INSERT INTO users (username, password_hash) VALUES (?, ?) RETURNING id',
      [username, passwordHash]
    );

    const user = await queryOne('SELECT * FROM users WHERE id = ?', [result.rows[0].id]);
    const token = await createToken(user.id);

    const { password_hash, ...safeUser } = user;
    return Response.json({ user: safeUser, token });
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
