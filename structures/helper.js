const Database = require('./db.js');

class Helper {
  static romanize(num) {
    if (isNaN(num)) {
      return NaN;
    }
    const digits = String(+num).split(''),
      key = [
        '',
        'C',
        'CC',
        'CCC',
        'CD',
        'D',
        'DC',
        'DCC',
        'DCCC',
        'CM',
        '',
        'X',
        'XX',
        'XXX',
        'XL',
        'L',
        'LX',
        'LXX',
        'LXXX',
        'XC',
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
      ];
    let roman = '',
      i = 3;
    while (i--) {
      roman = (key[+digits.pop() + i * 10] || '') + roman;
    }
    return Array(+digits.join('') + 1).join('M') + roman;
  }

  static calcRealm(cultivationVal, tribulations_passed) {
    const passed = tribulations_passed + 1;
    const db = new Database();
    const data = db.conn.prepare('SELECT * FROM realms WHERE realm_id = ?').get(passed.toString());
    data.level = Math.floor((cultivationVal - data.threshold) / data.increment) + 1;
    return data;
  }

  static calcNextRealm(cultivationVal) {
    const db = new Database();
    const data = db.conn
      .prepare('SELECT * FROM realms WHERE threshold > ? ORDER BY threshold ASC LIMIT 1')
      .get(cultivationVal);
    return data;
  }

  static calcCultivationForNextRealm(cultivationVal, tribulations_passed) {
    const db = new Database();
    const passed = tribulations_passed + 1;
    const data = db.conn.prepare('SELECT increment, threshold FROM realms WHERE realm_id = ?').get(passed.toString());
    const level = Math.floor((cultivationVal - data.threshold) / data.increment) + 1;
    const next_level_required = data.threshold + data.increment * level;
    return next_level_required - cultivationVal;
  }

  static millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return [minutes, seconds];
  }

  static millisToSeconds(millis) {
    const seconds = Math.floor(millis / 1000);
    return seconds;
  }

  static secondsToMinutesAndSeconds(original_seconds) {
    const minutes = Math.floor(original_seconds / 60);
    const seconds = Math.floor(original_seconds % 60);
    return [minutes, seconds];
  }

  static calcJobLevel(job_xp) {
    return Math.floor(job_xp / 200) + 1;
  }

  static calcXpNextJobLevel(job_xp) {
    return Helper.calcJobLevel(job_xp) * 200 - job_xp;
  }

  static enchantmentExists(enchantment_id) {
    const db = new Database();
    const enchantment = db.conn
      .prepare('SELECT * FROM enchantments WHERE enchantment_id = ?')
      .get(enchantment_id.toString());
    db.close();
    return enchantment ? 1 : 0;
  }
}

module.exports = Helper;
