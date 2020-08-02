const fs = require('fs');
const path = require('path');
const SQLITE = require('better-sqlite3');

class Database {
  constructor() {
    try {
      this.conn = new SQLITE(path.resolve(`${__dirname}/../data/db/bot.db`));
    } catch (e) {
      console.log(e.message);
      this.conn = false;
    }

    if (!this.conn) {
      console.log('[ERROR] COULD NOT CONNECT TO DB');
      process.exit(1);
    }
  }

  init() {
    const install_path = path.resolve(`${__dirname}/../data/setup`);
    const installs = [
      'users',
      'sects',
      'inventory',
      'items',
      'realms',
      'slots',
      'user_slots',
      'missions',
      'mission_rewards',
      'available_missions',
      'active_missions',
      'dungeons',
      'active_dungeons',
      'insert_realms',
      'insert_slots',
      'insert_default_sect',
      'dungeon_rewards',
      'mission_requirements',
      'jobs',
      'user_jobs',
      'item_requirements',
      'job_grades',
      'item_types',
      'insert_item_types',
      'insert_jobs',
    ];

    this.conn.prepare('BEGIN');
    for (let i = 0; i < installs.length; i++) {
      this.conn.prepare(fs.readFileSync(`${install_path}/${installs[i]}.sql`, 'utf-8')).run();
    }
    this.conn.prepare('COMMIT');
  }

  close() {
    this.conn.close();
  }
}

module.exports = Database;
