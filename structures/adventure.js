const Database = require('./db.js');

class Adventure {
  constructor(adventure_id) {
    this.adventure_id = adventure_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.adventure = db.conn.prepare('SELECT * FROM adventures WHERE adventure_id = ?').get(this.adventure_id);
    db.close();
  }

  get() {
    return this.adventure;
  }

  static getAdventureFromRarity(rarity) {
    const db = new Database();
    const adventure = db.conn
      .prepare('SELECT * FROM adventures WHERE rarity = ? ORDER BY RANDOM() LIMIT 1')
      .get(rarity);
    db.close();
    return adventure;
  }

  getReward(user_id) {
    const db = new Database();
    const reward = db.conn
      .prepare('SELECT item_id, count FROM adventure_rewards WHERE user_id = ?')
      .all(user_id.toString())[0];
    db.close();
    return reward;
  }

  getPlanDropRarity() {
    const drop_rates = {
      Common: [90, 97, 99, 99.99],
      Rare: [80, 94, 98, 99.9],
      Epic: [45, 83, 95, 99.8],
    };
    const rarity_array = ['Mortal', 'Earth', 'Heaven', 'Mystic'];
    const rand_num = Math.random() * 100;

    const rarity_index = drop_rates[this.adventure.rarity].findIndex((val) => val > rand_num);
    const plan_rarity = rarity_index === -1 ? 'Divine' : rarity_array[rarity_index];
    return plan_rarity;
  }
}

module.exports = Adventure;
