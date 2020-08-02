const Database = require('./db.js');
const Helper = require('./helper.js');

class Dungeon {
  constructor(dungeon_id) {
    this.dungeon_id = dungeon_id;
    this.load();
  }

  load() {
    const db = new Database();
    this.dungeon = db.conn.prepare('SELECT * FROM dungeons WHERE dungeon_id = ?').get(this.dungeon_id);
    db.close();
  }

  get() {
    return this.dungeon;
  }

  exists() {
    return this.dungeon !== null;
  }

  isAvailable(cultivationVal) {
    return (
      this.dungeon.grade === Helper.calcRealm(cultivationVal).name ||
      this.dungeon.grade === Helper.calcNextRealm(cultivationVal).name
    );
  }

  getItemDropRarity(stats_threshold_ratio) {
    const drop_rates = {
      Easy: [
        [90, 97, 99, 99.99],
        [80, 94, 98, 99.9],
        [55, 83, 95, 99.8],
      ],
      Medium: [],
      Hard: [],
    };
    const rarity_array = ['Mortal', 'Earth', 'Heaven', 'Mystic'];
    const rand_num = Math.random() * 100;

    let pool_index;
    if (stats_threshold_ratio <= 0.8) pool_index = 0;
    else if (stats_threshold_ratio > 0.8 && stats_threshold_ratio < 1.5) pool_index = 1;
    else pool_index = 2;

    const rarity_index = drop_rates[this.dungeon.tier][pool_index].findIndex((val) => val > rand_num);
    const item_rarity = rarity_index === -1 ? 'Divine' : rarity_array[rarity_index];
    return item_rarity;
  }

  // eslint-disable-next-line no-unused-vars
  getExtraItem(stats_threshold_ratio) {
    // If (this.dungeon.tier === 'Easy') return 0;
    const drop_chance = Math.random() * 100;
    if (drop_chance > 80) return 1;
  }
}

module.exports = Dungeon;
