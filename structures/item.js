const Database = require('./db.js');

class Item {
  constructor(item_id) {
    this.item_id = item_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.item_data = db.conn.prepare('SELECT * FROM items WHERE item_id = ?').get(this.item_id);
    db.close();
  }

  static getRandomItemFromRarityAndGrade(rarity, grade) {
    const db = new Database();
    const item = db.conn
      .prepare(
        "SELECT * FROM items WHERE rarity = :rarity AND grade = :grade AND NOT type = 'P' AND NOT type = 'S' ORDER BY RANDOM() LIMIT 1",
      )
      .get({
        rarity: rarity,
        grade: grade,
      });
    db.close();
    return item;
  }

  static getRandomPlanFromRarityAndGrade(rarity, grade) {
    const db = new Database();
    const plan = db.conn
      .prepare(
        `SELECT p.plan_id, p.plan_name FROM plans AS p
        INNER JOIN items AS i
        ON p.item_id = i.item_id
        WHERE i.grade = :grade
        AND i.rarity = :rarity`,
      )
      .get({
        grade: grade,
        rarity: rarity,
      });
    db.close();
    return plan;
  }

  static itemExists(item_id) {
    const db = new Database();
    const item = db.conn.prepare('SELECT * FROM items WHERE item_id = ?').get(item_id);
    db.close();
    return item ? 1 : 0;
  }

  static itemWithSameStatsExists(item_name, strength, agility, vital_essence, intelligence) {
    const db = new Database();
    const item = db.conn
      .prepare(
        'SELECT * FROM items WHERE item_name = :in AND strength = :s AND dexterity = :d AND vital_essence = :ve AND intelligence = :i',
      )
      .get({
        in: item_name,
        s: strength,
        d: agility,
        ve: vital_essence,
        i: intelligence,
      });
    db.close();
    return item ? 1 : 0;
  }

  static createNewItemFromExistingItem(item_id, strength = 0, agility = 0, vital_essence = 0, intelligence = 0) {
    const db = new Database();
    const item_template = db.conn
      .prepare('SELECT item_name, type, grade, rarity, value, description FROM items WHERE item_id = ?')
      .get(item_id);
    const [item_name, type, grade, rarity, value, description] = Object.values(item_template);

    db.conn.prepare('INSERT INTO items VALUES (NULL, :in, :t, :g, :r, :s, :d, :ve, :i, :v, :de)').run({
      in: item_name,
      t: type,
      g: grade,
      r: rarity,
      s: strength,
      d: agility,
      ve: vital_essence,
      i: intelligence,
      v: value,
      de: description,
    });

    db.close();
  }

  get() {
    return this.item_data;
  }

  getItemStats() {
    const stats = [];
    if (this.item_data.strength) stats.push(['Strength', this.item_data.strength]);
    if (this.item_data.dexterity) stats.push(['Agility', this.item_data.dexterity]);
    if (this.item_data.vital_essence) stats.push(['Vital Essence', this.item_data.vital_essence]);
    if (this.item_data.intelligence) stats.push(['Intelligence', this.item_data.intelligence]);
    return stats;
  }

  getItemName() {
    return this.item_data.item_name;
  }

  getItemDescription() {
    return this.item_data.description;
  }

  getMaterials() {
    const db = new Database();
    const materials = db.conn
      .prepare('SELECT material_id, count FROM item_requirements WHERE item_id = ?')
      .all(this.item_id);
    db.close();
    return materials;
  }

  getItemTypeName() {
    const db = new Database();
    const type_name = db.conn.prepare('SELECT name FROM item_types WHERE type_id = ?').get(this.item_data.type).name;
    db.close();
    return type_name;
  }

  isCraftable(job_id) {
    const db = new Database();
    const item = db.conn.prepare('SELECT * FROM user_craft WHERE item_id = :iid AND job_id = :jid').get({
      iid: this.item_id,
      jid: job_id,
    });
    db.close();
    return item ? 1 : 0;
  }

  isEquippable() {
    return ['H', 'B', 'A', 'F', 'MH', 'OH'].includes(this.item_data.type);
  }
}

module.exports = Item;
