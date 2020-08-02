const Database = require('./db.js');

class Enchantment {
  constructor(enchantment_id) {
    this.enchantment_id = enchantment_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.enchantment = db.conn
      .prepare('SELECT * FROM enchantments WHERE enchantment_id = ?')
      .get(this.enchantment_id.toString());
    db.close();
  }

  get() {
    return this.enchantment;
  }

  getEnchantmentRequirements() {
    const db = new Database();
    const requirements = db.conn
      .prepare('SELECT item_id, count FROM enchantment_requirements WHERE enchantment_id = ?')
      .all(this.enchantment_id);
    db.close();
    return requirements;
  }
}

module.exports = Enchantment;
