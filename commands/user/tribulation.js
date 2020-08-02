const { Command } = require('discord.js-commando');
const User = require('../../structures/user.js');

module.exports = class tribulation extends Command {
  constructor(client) {
    super(client, {
      name: 'tribulation',
      aliases: ['t', 'tr'],
      memberName: 'tribulation',
      group: 'user',
      description: 'Pass your tribulation.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const user_data = user.get();
      const next_realm_data = user.getNextRealmData();
      if (!next_realm_data) return msg.channel.send("Oh. You've reached the peak. Welcome... I guess?");
      if (user_data.cultivationVal >= next_realm_data.threshold) {
        const passed = user.tribulationCheck(next_realm_data.stats_threshold);
        if (passed) {
          // Update stats
          const stats_increase = (next_realm_data.stats_threshold * 0.36) / 4;
          user.increaseStats(stats_increase);
          user.passedTribulation();
          msg.channel.send(`Successfully passed tribulation!\nRewards: +${stats_increase} to all stats.`);
        } else {
          msg.channel.send('You failed the tribulation.');
        }
      } else {
        msg.channel.send("The Heavens don't deem you strong enough to send down a tribulation.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
