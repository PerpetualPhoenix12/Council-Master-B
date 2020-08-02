const Database = require('./db.js');

class Sect {
  constructor(sect_id) {
    this.sect_id = sect_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.sect = db.conn.prepare('SELECT * FROM sects WHERE sect_id = ?').get(this.sect_id);
    db.close();
  }

  getAvailableMissions() {
    const db = new Database();
    const sect_missions = db.conn
      .prepare(
        `SELECT m.mission_id, m.name, m.description 
        FROM missions AS m 
        INNER JOIN available_missions AS am 
        ON m.mission_id = am.mission_id 
        WHERE am.sect_id = ?`,
      )
      .all(this.sect_id);
    db.close();
    return sect_missions;
  }

  addAvailableMission(mission_id) {
    const db = new Database();
    db.conn.prepare('INSERT INTO available_missions VALUES (:mid, :sid)').run({
      mid: mission_id,
      sid: this.sect_id,
    });
    db.close();
  }

  getExchangeItems() {
    const db = new Database();
    const items = db.conn.prepare('SELECT item_id, price FROM sect_items WHERE sect_id = ?').all(this.sect_id);
    db.close();
    return items;
  }

  getFromExchange(item_id) {
    const db = new Database();
    const item = db.conn.prepare('SELECT * FROM sect_items WHERE item_id = :iid AND sect_id = :sid').get({
      iid: item_id,
      sid: this.sect_id,
    });
    db.close();
    return item;
  }
}

module.exports = Sect;
