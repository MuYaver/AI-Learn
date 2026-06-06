import Database from 'better-sqlite3';
import path from 'path';

let db;

export function getDb() {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'database.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    createTables();
  }
  return db;
}

function createTables() {
  const database = db || getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      "order" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      FOREIGN KEY (unit_id) REFERENCES units(id)
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('multiple_choice','fill_blank','true_false','match')),
      question TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      "order" INTEGER NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      score INTEGER,
      xp_earned INTEGER DEFAULT 0,
      gems_earned INTEGER DEFAULT 0,
      hearts_lost INTEGER DEFAULT 0,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id),
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS shop_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('streak_freeze','hearts_refill','xp_boost','cosmetic')),
      cost_gems INTEGER NOT NULL,
      effect_data TEXT
    );

    CREATE TABLE IF NOT EXISTS user_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      expires_at TEXT DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (item_id) REFERENCES shop_items(id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      criteria_type TEXT NOT NULL,
      criteria_value INTEGER NOT NULL,
      reward_xp INTEGER DEFAULT 0,
      reward_gems INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id INTEGER NOT NULL,
      unlocked_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (achievement_id) REFERENCES achievements(id),
      UNIQUE(user_id, achievement_id)
    );

    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_date TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_value INTEGER NOT NULL,
      reward_xp INTEGER DEFAULT 50,
      reward_gems INTEGER DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS user_daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      challenge_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      completed_at TEXT DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id),
      UNIQUE(user_id, challenge_id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      weekly_xp INTEGER DEFAULT 0,
      league TEXT DEFAULT 'bronze',
      rank INTEGER DEFAULT 0,
      week_start TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    );
  `);

  return database;
}

export function queryAll(sql, params = []) {
  const database = getDb();
  return database.prepare(sql).all(...params);
}

export function queryOne(sql, params = []) {
  const database = getDb();
  return database.prepare(sql).get(...params);
}

export function runSql(sql, params = []) {
  const database = getDb();
  return database.prepare(sql).run(...params);
}
