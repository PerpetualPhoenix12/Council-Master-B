const { Command } = require('discord.js-commando');
const User = require('../../structures/user.js');

module.exports = class contribution extends Command {
  constructor(client) {
    super(client, {
      name: 'contribution',
      aliases: ['c'],
      memberName: 'contribution',
      group: 'user',
      description: 'Check your sect contribution.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const contribution = user.get().contribution;
      msg.channel.send(`You have ${contribution} sect contribution.`);
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
