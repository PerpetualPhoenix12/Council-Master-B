const Database = require('./db.js');
const Helper = require('./helper.js');

class User {
  constructor(user_id) {
    this.user_id = user_id;
    this.load();
  }

  static add(user_id) {
    try {
      const db = new Database();
      db.conn.prepare('BEGIN');
      db.conn.prepare('INSERT INTO users(user_id, last_checked) VALUES (:uid, :time)').run({
        uid: user_id,
        time: Date.now(),
      });
      const jobs = ['A', 'B', 'AM'];
      jobs.forEach((job) => {
        db.conn.prepare('INSERT INTO user_jobs (job_id, user_id) VALUES (:jid, :uid)').run({
          jid: job,
          uid: user_id,
        });
      });
      db.conn.prepare('COMMIT');
      db.close();
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  static exists(user_id) {
    const db = new Database();
    const user = db.conn.prepare('SELECT * FROM users WHERE user_id = ?').get(user_id);
    db.close();
    return user ? 1 : 0;
  }

  load() {
    const db = new Database();
    const user = db.conn.prepare('SELECT * FROM users WHERE user_id = ?').get(this.user_id);
    db.close();

    if (user) this.user = user;
    else return -1;
  }

  get() {
    return this.user;
  }

  addCultivation(amount) {
    const db = new Database();
    const newCultivationVal = this.user.cultivationVal + amount;

    db.conn.prepare('UPDATE users SET cultivationVal = :new, last_checked = :now WHERE user_id = :uid').run({
      new: newCultivationVal,
      now: Date.now(),
      uid: this.user_id,
    });
    db.close();
  }

  increaseStats(increase) {
    const db = new Database();
    db.conn
      .prepare(
        'UPDATE users SET strength = strength + :increase, vital_essence = vital_essence + :increase, agility = agility + :increase, intelligence = intelligence + :increase WHERE user_id = :uid',
      )
      .run({
        increase: increase,
        uid: this.user_id,
      });
    db.close();
  }

  updateCultivation() {
    const db = new Database();
    const last_checked = db.conn.prepare('SELECT last_checked FROM users WHERE user_id = ?').get(this.user_id)
      .last_checked;
    const minutesPassed = Math.floor((Date.now() - last_checked) / 60000);
    if (minutesPassed > 1) {
      // Calculate gained cultivation
      const perception = this.user.intelligence / 10;
      const gainedCultivation = Math.floor(
        (Math.random() * (perception + 3 - (perception - 1)) + (perception - 1)) * minutesPassed,
      );

      // Get old realm data for comparison
      const old_realm_data = this.getCurrentRealmData();

      // Increase cultivation and load new data
      this.addCultivation(gainedCultivation);
      this.load();

      // Get new realm data after loading new cultivation
      const new_realm_data = this.getCurrentRealmData();

      // Get no. subrealms increased & multiply by subrealm stat increase
      // if level > 10, then they need a tribulation to enter the next major realm
      // so only subrealm increase up to level 10 is counted
      const difference =
        new_realm_data.level > 10 ? 10 - old_realm_data.level : new_realm_data.level - old_realm_data.level;
      if (difference > 0) {
        // Threshold * 0.6 * 0.4 * 0.25 / 9
        const stats_gained = Math.floor(difference * (new_realm_data.stats_threshold * (0.06 / 9)));
        this.increaseStats(stats_gained);
        return stats_gained;
      }
    }
    db.close();
  }

  startMission(mission_id) {
    const db = new Database();
    db.conn.prepare('INSERT INTO active_missions VALUES (:mid, :uid)').run({
      mid: mission_id,
      uid: this.user_id,
    });
    db.close();
  }

  finishMission() {
    const db = new Database();
    db.conn.prepare('DELETE from active_missions WHERE user_id = ?').run(this.user_id);
    db.close();
  }

  isOnMission() {
    const db = new Database();
    const curMission = db.conn.prepare('SELECT * FROM active_missions WHERE user_id = ?').get(this.user_id);
    db.close();
    return curMission ? 1 : 0;
  }
  getCurrentMissionId() {
    const db = new Database();
    const curMission = db.conn.prepare('SELECT mission_id FROM active_missions WHERE user_id = ?').get(this.user_id);
    db.close();
    return curMission.mission_id;
  }

  startDungeon(dungeon_id, duration) {
    const db = new Database();
    db.conn.prepare('INSERT INTO active_dungeons VALUES (:did, :uid, :started, :duration)').run({
      did: dungeon_id,
      uid: this.user_id,
      started: Date.now(),
      duration: duration,
    });
    db.close();
  }

  isOnDungeon() {
    const db = new Database();
    const curDungeon = db.conn.prepare('SELECT * FROM active_dungeons WHERE user_id = ?').get(this.user_id);
    db.close();
    return curDungeon ? 1 : 0;
  }

  getAvailableDungeons() {
    const db = new Database();
    const cur_realm = Helper.calcRealm(this.user.cultivationVal, this.user.tribulations_passed).name;
    let next_realm = Helper.calcNextRealm(this.user.cultivationVal);
    next_realm = next_realm ? next_realm.name : cur_realm;
    const dungeons = db.conn.prepare('SELECT * FROM dungeons WHERE grade = :curRealm OR grade = :nextRealm').all({
      curRealm: cur_realm,
      nextRealm: next_realm,
    });
    db.close();
    return dungeons;
  }

  getCurrentDungeonData() {
    const db = new Database();
    const curDungeon = db.conn
      .prepare('SELECT dungeon_id, started, duration FROM active_dungeons WHERE user_id = ?')
      .get(this.user_id);
    db.close();
    return curDungeon;
  }

  finishDungeon() {
    const db = new Database();
    db.conn.prepare('DELETE FROM active_dungeons WHERE user_id = ?').run(this.user_id);
    db.close();
  }

  addToInventory(item_id, count) {
    const db = new Database();
    if (this.existsInInventory(item_id)) {
      db.conn.prepare('UPDATE inventory SET count = count + :count WHERE user_id = :uid AND item_id = :id').run({
        count: count,
        uid: this.user_id,
        id: item_id,
      });
    } else {
      db.conn.prepare('INSERT INTO inventory VALUES (:id, :uid, :count)').run({
        id: item_id,
        uid: this.user_id,
        count: count,
      });
    }
    db.close();
  }

  removeFromInventory(item_id, countToRemove) {
    const db = new Database();
    const countInInventory = this.getFromInventory(item_id).count;
    if (countToRemove === countInInventory) {
      db.conn.prepare('DELETE FROM inventory WHERE user_id = :uid AND item_id = :id').run({
        uid: this.user_id,
        id: item_id,
      });
    } else {
      db.conn.prepare('UPDATE inventory SET count = count - :count WHERE user_id = :uid AND item_id = :id').run({
        count: countToRemove,
        uid: this.user_id,
        id: item_id,
      });
    }
    db.close();
  }

  existsInInventory(item_id) {
    const db = new Database();
    const exists = db.conn.prepare('SELECT * FROM inventory WHERE item_id = :id AND user_id = :uid').get({
      id: item_id,
      uid: this.user_id,
    });
    db.close();
    return exists ? 1 : 0;
  }

  getFromInventory(item_id) {
    const db = new Database();
    const item = db.conn.prepare('SELECT * FROM inventory where user_id = :uid AND item_id = :id').get({
      uid: this.user_id,
      id: item_id,
    });
    db.close();
    return item;
  }

  getInventory() {
    const db = new Database();
    const inventory = db.conn.prepare('SELECT * FROM inventory WHERE user_id = ?').all(this.user_id);
    db.close();
    return inventory;
  }

  canCreateItem(item_data, job_id) {
    const db = new Database();
    const can_create = db.conn.prepare('SELECT item_id FROM user_craft WHERE job_id = :jid AND user_id = :uid').get({
      jid: job_id,
      uid: this.user_id,
    });
    if (!can_create) return 0;

    const job_xp = db.conn.prepare('SELECT job_xp FROM user_jobs WHERE user_id = :uid AND job_id = :jid').get({
      uid: this.user_id,
      jid: job_id,
    }).job_xp;
    const user_job_level = Helper.calcJobLevel(job_xp);
    const levels = db.conn.prepare('SELECT name FROM realms ORDER BY threshold ASC').all();
    const grade_index = levels.findIndex((level) => level.name === item_data.grade);
    return user_job_level - 1 >= grade_index ? 1 : 0;
  }

  canUseEnchantment(enchantment_data) {
    const db = new Database();
    const job_xp = db.conn.prepare("SELECT job_xp FROM user_jobs WHERE user_id = ? AND job_id = 'AM'").get(this.user_id)
      .job_xp;
    const user_job_level = Helper.calcJobLevel(job_xp);
    const levels = db.conn.prepare('SELECT name FROM realms ORDER BY threshold ASC').all();
    const grade_index = levels.findIndex((level) => level.name === enchantment_data.grade);
    return user_job_level - 1 >= grade_index ? 1 : 0;
  }

  getCraftableItems(job_id) {
    const db = new Database();
    const items = db.conn.prepare('SELECT item_id FROM user_craft WHERE job_id = :jid AND user_id = :uid').all({
      jid: job_id,
      uid: this.user_id,
    });
    db.close();
    return items;
  }

  addJobXp(amount, job) {
    const db = new Database();
    db.conn.prepare('UPDATE user_jobs SET job_xp = job_xp + :amount WHERE user_id = :uid AND job_id = :jid').run({
      amount: amount,
      uid: this.user_id,
      jid: job,
    });
    db.close();
  }

  getTotalStats() {
    const user = this.user;
    const total_stats = user.strength + user.vital_essence + user.agility + user.intelligence;
    return total_stats;
  }

  /* IsHodor() {
        const db = new Database();
        const hodor = db.conn.prepare("SELECT hodor_start FROM users WHERE user_id = ?").get(this.user_id).hodor_start;
        db.close();
        return hodor ? 1 : 0
    }

    startHodor() {
        const db = new Database();
        db.conn.prepare("UPDATE users SET hodor_start = :now WHERE user_id = :uid").run({
            now: Date.now(),
            uid: this.user_id
        });
        db.close();
    }

    finishHodor() {
        const db = new Database();
        db.conn.prepare("UPDATE users SET hodor_start = 0 WHERE user_id = ?").run(this.user_id);
        db.close();
    }*/

  addContribution(amount) {
    const db = new Database();
    db.conn.prepare('UPDATE users SET contribution = contribution + :amount WHERE user_id = :uid').run({
      amount: amount,
      uid: this.user_id,
    });
    db.close();
  }

  removeContribution(amount) {
    const db = new Database();
    db.conn.prepare('UPDATE users SET contribution = contribution - :amount WHERE user_id = :uid').run({
      amount: amount,
      uid: this.user_id,
    });
    db.close();
  }

  isOnAdventure() {
    const db = new Database();
    const adventure = db.conn.prepare('SELECT * FROM active_adventures WHERE user_id = ?').get(this.user_id);
    db.close();
    return adventure ? 1 : 0;
  }

  startAdventure(adventure_id, reward_id, duration) {
    const db = new Database();
    db.conn.prepare('INSERT INTO active_adventures VALUES (:aid, :uid, :started, :duration)').run({
      aid: adventure_id,
      uid: this.user_id,
      started: Date.now(),
      duration: duration,
    });
    db.conn.prepare('INSERT INTO adventure_rewards VALUES (:aid, :uid, :iid, 1)').run({
      aid: adventure_id,
      uid: this.user_id,
      iid: reward_id,
    });
    db.close();
  }

  getCurrentAdventureData() {
    const db = new Database();
    const adventure = db.conn
      .prepare('SELECT adventure_id, started, duration FROM active_adventures WHERE user_id = ?')
      .get(this.user_id);
    db.close();
    return adventure;
  }

  finishAdventure() {
    const db = new Database();
    db.conn.prepare('DELETE FROM active_adventures WHERE user_id = ?').run(this.user_id);
    db.conn.prepare('DELETE FROM adventure_rewards WHERE user_id = ?').run(this.user_id);
    db.close();
  }

  getItemFromSlot(slot_id) {
    try {
      const db = new Database();
      const item_id = db.conn.prepare('SELECT item_id FROM user_slots WHERE user_id = :uid AND slot_id = :sid').get({
        uid: this.user_id,
        sid: slot_id,
      }).item_id;
      db.close();
      return item_id;
    } catch (e) {
      return 0;
    }
  }

  addToStat(stat, amount) {
    const db = new Database();
    if (stat === 'strength') {
      db.conn.prepare('UPDATE users SET strength = strength + :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else if (stat === 'agility') {
      db.conn.prepare('UPDATE users SET agility = agility + :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else if (stat === 'vital_essence') {
      db.conn.prepare('UPDATE users SET vital_essence = vital_essence + :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else {
      db.conn.prepare('UPDATE users SET intelligence = intelligence + :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    }
    db.close();
  }

  removeFromStat(stat, amount) {
    const db = new Database();
    if (stat === 'strength') {
      db.conn.prepare('UPDATE users SET strength = strength - :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else if (stat === 'agility') {
      db.conn.prepare('UPDATE users SET agility = agility - :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else if (stat === 'vital_essence') {
      db.conn.prepare('UPDATE users SET vital_essence = vital_essence - :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    } else {
      db.conn.prepare('UPDATE users SET intelligence = intelligence - :amount WHERE user_id = :uid').run({
        amount: amount,
        uid: this.user_id,
      });
    }
    db.close();
  }

  equipItem(item_id, slot_id) {
    const db = new Database();
    db.conn.prepare('INSERT INTO user_slots VALUES (:uid, :iid, :sid)').run({
      uid: this.user_id,
      iid: item_id,
      sid: slot_id,
    });
    db.close();
  }

  unequipItem(item_id) {
    const db = new Database();
    db.conn.prepare('DELETE FROM user_slots WHERE item_id = :iid AND user_id = :uid').run({
      iid: item_id,
      uid: this.user_id,
    });
    db.close();
  }

  hasItemEquipped(item_id) {
    const db = new Database();
    const item = db.conn.prepare('SELECT * FROM user_slots WHERE item_id = :iid AND user_id = :uid').get({
      iid: item_id,
      uid: this.user_id,
    });
    db.close();
    return item ? 1 : 0;
  }

  getEquippedItemIds() {
    const db = new Database();
    const items = db.conn
      .prepare(
        `SELECT us.item_id, s.name FROM user_slots AS us
        INNER JOIN slots AS s
        ON s.slot_id = us.slot_id
        WHERE us.user_id = ?`,
      )
      .all(this.user_id);
    db.close();
    return items;
  }

  getJobXp(job_id) {
    const db = new Database();
    const job_xp = db.conn.prepare('SELECT job_xp FROM user_jobs WHERE job_id = :jid AND user_id = :uid').get({
      jid: job_id,
      uid: this.user_id,
    }).job_xp;
    db.close();
    return job_xp;
  }

  addEnchantment(item_id, enchantment_id) {
    const db = new Database();
    db.conn.prepare('INSERT INTO active_enchantments VALUES (:uid, :iid, :eid)').run({
      uid: this.user_id,
      iid: item_id,
      eid: enchantment_id,
    });
    db.close();
  }

  removeEnchantment(item_id) {
    const db = new Database();
    db.conn.prepare('DELETE FROM active_enchantments WHERE user_id = :uid AND item_id = :iid').run({
      uid: this.user_id,
      iid: item_id,
    });
    db.close();
  }

  getItemEnchantment(item_id) {
    const db = new Database();
    const item_enchantment = db.conn
      .prepare('SELECT enchantment_id FROM active_enchantments WHERE user_id = :uid AND item_id = :iid')
      .get({
        uid: this.user_id,
        iid: item_id,
      });
    db.close();
    return item_enchantment ? item_enchantment.enchantment_id : 0;
  }

  getEquippedEnchantments() {
    const db = new Database();
    const enchantments = db.conn
      .prepare('SELECT enchantment_id FROM active_enchantments WHERE user_id = ?')
      .all(this.user_id);
    db.close();
    return enchantments;
  }

  hasLearnedEnchantment(enchantment_id) {
    const db = new Database();
    const enchantment = db.conn
      .prepare('SELECT * FROM user_enchantments WHERE user_id = :uid AND enchantment_id = :eid')
      .get({
        uid: this.user_id,
        eid: enchantment_id,
      });
    db.close();
    return enchantment ? 1 : 0;
  }

  getUseableEnchantments() {
    const db = new Database();
    const enchantments = db.conn
      .prepare('SELECT enchantment_id FROM user_enchantments WHERE user_id = ?')
      .all(this.user_id);
    db.close();
    return enchantments;
  }

  getCurrentRealmData() {
    const passed = this.user.tribulations_passed + 1;
    const db = new Database();
    const data = db.conn.prepare('SELECT * FROM realms WHERE realm_id = ?').get(passed.toString());
    data.level = Math.floor((this.user.cultivationVal - data.threshold) / data.increment) + 1;
    db.close();
    return data;
  }

  getNextRealmData() {
    const db = new Database();
    const passed = this.user.tribulations_passed + 1;
    const data = db.conn
      .prepare('SELECT * FROM realms WHERE realm_id > ? ORDER BY realm_id ASC LIMIT 1')
      .get(passed.toString());
    db.close();
    return data;
  }

  tribulationCheck(threshold) {
    const chance = this.getTribulationPassChance(threshold);
    const rand_num = Math.random() * 100;
    return rand_num >= 100 - chance;
  }

  getTribulationPassChance(threshold) {
    const total_stats = this.getTotalStats();
    if (total_stats >= threshold) return 100;
    let chance = 100;

    const percent_of_threshold = Math.round((total_stats / threshold) * 100);
    const percent_below_threshold = 100 - percent_of_threshold;
    const levels_below_threshold = Math.floor(percent_below_threshold / 10);
    const initial_reduction = ((2 ** (2 - (levels_below_threshold + 1)) * 25) / 10) * (percent_below_threshold % 10);

    chance -= initial_reduction;

    if (levels_below_threshold > 0) {
      for (let n = levels_below_threshold; n > 0; n--) {
        const cur_reduction = 2 ** (2 - n) * 25;
        chance -= cur_reduction;
      }
    }
    return chance;
  }

  passedTribulation() {
    const db = new Database();
    db.conn
      .prepare('UPDATE users SET tribulations_passed = tribulations_passed + 1 WHERE user_id = ?')
      .run(this.user_id);
    db.close();
  }

  getLearntPlans() {
    const db = new Database();
    const plans = db.conn.prepare('SELECT * FROM user_craft WHERE user_id = ?').all(this.user_id);
    db.close();
    return plans;
  }

  learnPlan(plan_data) {
    const db = new Database();
    db.conn.prepare('INSERT INTO user_craft VALUES (:iid, :uid, :jid)').run({
      iid: plan_data.item_id,
      uid: this.user_id,
      jid: plan_data.job_id,
    });
    db.close();
  }
}

module.exports = User;
