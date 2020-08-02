const { Command } = require('discord.js-commando');
const Helper = require('../../structures/helper.js');
const User = require('../../structures/user.js');

module.exports = class cultivation extends Command {
  constructor(client) {
    super(client, {
      name: 'cultivation',
      aliases: ['cb'],
      memberName: 'cultivation',
      group: 'user',
      description: 'Check your cultivation!',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const stats_gained = user.updateCultivation();

      const userData = user.get();
      const realmData = user.getCurrentRealmData();
      const realmName = realmData.name;
      const realmLevel = realmData.level > 10 ? 'X' : Helper.romanize(realmData.level);
      const perception = userData.intelligence / 10;
      const cultivation = userData.cultivationVal;
      const cultivation_for_next_realm = Helper.calcCultivationForNextRealm(cultivation, userData.tribulations_passed);

      const next_realm_data = user.getNextRealmData();
      const pass_chance = user.getTribulationPassChance(next_realm_data.stats_threshold);
      const tribulation_msg_available = 'Tribulation available!';
      const stats_increased_msg = `+${stats_gained} to all stats from subrealm(s) increase.`;

      msg.channel.send(
        `\`\`\`Realm: ${realmName} ${realmLevel}\nCultivation base: ${cultivation} (${perception}cb / min)\nNext realm in: ${cultivation_for_next_realm}cb${
          realmData.level > 10
            ? `\n\n${tribulation_msg_available}\nYou have a ${pass_chance.toFixed(2)}% chance of overcoming it.`
            : ''
        }${stats_gained ? `\n\n${stats_increased_msg}` : ''}\`\`\``,
      );
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
