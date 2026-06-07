import { Client } from '@neondatabase/serverless';

let client;

function getClient() {
  if (!client) {
    client = new Client(process.env.DATABASE_URL);
    return client.connect().then(() => createTables()).then(() => client);
  }
  return Promise.resolve(client);
}

function toPostgresParams(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export async function queryAll(sql, params = []) {
  const c = await getClient();
  const result = await c.query(toPostgresParams(sql), params);
  return result.rows;
}

export async function queryOne(sql, params = []) {
  const c = await getClient();
  const result = await c.query(toPostgresParams(sql), params);
  return result.rows[0] || null;
}

export async function runSql(sql, params = []) {
  const c = await getClient();
  const result = await c.query(toPostgresParams(sql), params);
  return result;
}

async function createTables() {
  const c = client;
  await c.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      xp INTEGER DEFAULT 0,
      gems INTEGER DEFAULT 0,
      hearts INTEGER DEFAULT 5,
      hearts_refill_at TEXT DEFAULT NULL,
      streak INTEGER DEFAULT 0,
      last_active_date TEXT DEFAULT NULL,
      league TEXT DEFAULT 'bronze',
      league_xp INTEGER DEFAULT 0,
      avatar TEXT DEFAULT NULL,
      created_at TEXT DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      "order" INTEGER NOT NULL
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      unit_id INTEGER NOT NULL REFERENCES units(id),
      title TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id),
      type TEXT NOT NULL CHECK(type IN ('multiple_choice','fill_blank','true_false','match')),
      question TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      "order" INTEGER NOT NULL
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      lesson_id INTEGER NOT NULL REFERENCES lessons(id),
      completed INTEGER DEFAULT 0,
      score INTEGER,
      xp_earned INTEGER DEFAULT 0,
      gems_earned INTEGER DEFAULT 0,
      hearts_lost INTEGER DEFAULT 0,
      completed_at TEXT,
      UNIQUE(user_id, lesson_id)
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS shop_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('streak_freeze','hearts_refill','xp_boost','cosmetic')),
      cost_gems INTEGER NOT NULL,
      effect_data TEXT
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS user_inventory (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      item_id INTEGER NOT NULL REFERENCES shop_items(id),
      quantity INTEGER DEFAULT 1,
      expires_at TEXT DEFAULT NULL
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      criteria_type TEXT NOT NULL,
      criteria_value INTEGER NOT NULL,
      reward_xp INTEGER DEFAULT 0,
      reward_gems INTEGER DEFAULT 0
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      achievement_id INTEGER NOT NULL REFERENCES achievements(id),
      unlocked_at TEXT DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS'),
      UNIQUE(user_id, achievement_id)
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id SERIAL PRIMARY KEY,
      challenge_date TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_value INTEGER NOT NULL,
      reward_xp INTEGER DEFAULT 50,
      reward_gems INTEGER DEFAULT 10
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS user_daily_challenges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      challenge_id INTEGER NOT NULL REFERENCES daily_challenges(id),
      progress INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      completed_at TEXT DEFAULT NULL,
      UNIQUE(user_id, challenge_id)
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      weekly_xp INTEGER DEFAULT 0,
      league TEXT DEFAULT 'bronze',
      rank INTEGER DEFAULT 0,
      week_start TEXT NOT NULL
    )
  `);

  await c.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id),
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      "order" INTEGER NOT NULL
    )
  `);
}
