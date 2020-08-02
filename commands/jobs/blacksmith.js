const { Command } = require('discord.js-commando');
const Helper = require('../../structures/helper.js');
const User = require('../../structures/user.js');

module.exports = class blacksmith extends Command {
  constructor(client) {
    super(client, {
      name: 'blacksmith',
      aliases: ['bl'],
      memberName: 'blacksmith',
      group: 'jobs',
      description: 'Displays your current blacksmith status.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const blacksmith_xp = user.getJobXp('B');
      const blacksmith_level = Helper.calcJobLevel(blacksmith_xp);
      const next_level_at = Helper.calcXpNextJobLevel(blacksmith_xp);
      msg.channel.send(
        `Blacksmith Level: ${blacksmith_level}\nBlacksmith XP: ${blacksmith_xp}\nNext level in: ${next_level_at} XP`,
      );
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
