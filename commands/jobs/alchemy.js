const { Command } = require('discord.js-commando');
const Helper = require('../../structures/helper.js');
const User = require('../../structures/user.js');

module.exports = class alchemy extends Command {
  constructor(client) {
    super(client, {
      name: 'alchemy',
      aliases: ['al'],
      memberName: 'alchemy',
      group: 'jobs',
      description: 'Displays your current alchemist status.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const alchemy_xp = user.getJobXp('A');
      const alchemy_level = Helper.calcJobLevel(alchemy_xp);
      const next_level_at = Helper.calcXpNextJobLevel(alchemy_xp);
      msg.channel.send(
        `Alchemist Level: ${alchemy_level}\nAlchemist XP: ${alchemy_xp}\nNext level in: ${next_level_at} XP`,
      );
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
