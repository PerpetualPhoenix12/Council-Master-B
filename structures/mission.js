const Database = require('./db.js');

class Mission {
  constructor(mission_id) {
    this.mission_id = mission_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.mission_data = db.conn
      .prepare('SELECT name, description FROM missions WHERE mission_id = ?')
      .get(this.mission_id);
    this.mission_rewards = db.conn
      .prepare(
        `SELECT mr.item_id, mr.count, i.item_name
        FROM mission_rewards AS mr
        INNER JOIN items AS i
        ON i.item_id = mr.item_id
        WHERE mr.mission_id = ?`,
      )
      .all(this.mission_id);
    this.mission_requirements = db.conn
      .prepare(
        `SELECT i.item_name, mr.item_id, mr.count 
        FROM mission_requirements as mr
        INNER JOIN items AS i
        ON i.item_id = mr.item_id
        WHERE mr.mission_id = ?`,
      )
      .all(this.mission_id);
    db.close();
  }

  getRewards() {
    return this.mission_rewards;
  }

  getData() {
    return this.mission_data;
  }

  getRequirements() {
    return this.mission_requirements;
  }

  isAvailable(sect_id) {
    const db = new Database();
    const mission = db.conn.prepare('SELECT * FROM available_missions WHERE mission_id = :mid AND sect_id = :sid').get({
      mid: this.mission_id,
      sid: sect_id,
    });
    db.close();
    return mission ? 1 : 0;
  }
}

module.exports = Mission;
