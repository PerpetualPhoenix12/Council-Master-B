const Database = require('./db.js');

class Plan {
  constructor(plan_id) {
    this.plan_id = plan_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.plan = db.conn.prepare('SELECT * FROM plans WHERE plan_id = ?').get(this.plan_id.toString());
    db.close();
  }

  get() {
    return this.plan;
  }
}

module.exports = Plan;
