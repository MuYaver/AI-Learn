import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { queryOne, runSql } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'duolingo-clone-secret-key-change-in-production'
);

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId) {
  return new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const userId = await verifyToken(token);
  if (!userId) return null;

  return queryOne('SELECT * FROM users WHERE id = ?', [userId]);
}

export function requireAuth(request) {
  return getUserFromRequest(request);
}

export function updateStreak(user) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (user.last_active_date === today) {
    return user;
  }

  let newStreak = user.streak;

  if (user.last_active_date === yesterday) {
    newStreak += 1;
  } else if (user.last_active_date && user.last_active_date !== yesterday) {
    newStreak = 1;
  } else if (!user.last_active_date) {
    newStreak = 1;
  }

  runSql(
    'UPDATE users SET streak = ?, last_active_date = ? WHERE id = ?',
    [newStreak, today, user.id]
  );

  return { ...user, streak: newStreak, last_active_date: today };
}

export function refillHearts(user) {
  if (user.hearts >= 5) return user;
  if (!user.hearts_refill_at) return user;

  const refillTime = new Date(user.hearts_refill_at).getTime();
  if (Date.now() < refillTime) return user;

  const elapsed = Date.now() - refillTime;
  const hoursElapsed = Math.floor(elapsed / (1000 * 60 * 60));
  const heartsToRefill = Math.min(hoursElapsed, 5 - user.hearts);
  const newHearts = Math.min(user.hearts + heartsToRefill, 5);
  const nextRefill = newHearts >= 5
    ? null
    : new Date(refillTime + (heartsToRefill + 1) * 1 * 60 * 60 * 1000).toISOString();

  runSql(
    'UPDATE users SET hearts = ?, hearts_refill_at = ? WHERE id = ?',
    [newHearts, nextRefill, user.id]
  );

  return { ...user, hearts: newHearts, hearts_refill_at: nextRefill };
}
