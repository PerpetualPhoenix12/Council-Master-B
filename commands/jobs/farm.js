const { Command } = require('discord.js-commando');
const User = require('../../structures/user.js');

module.exports = class farm extends Command {
  constructor(client) {
    super(client, {
      name: 'farm',
      aliases: ['fr'],
      memberName: 'farm',
      group: 'jobs',
      description: 'Farm',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (msg.author.id === 182148584412676096) {
        msg.channel.send(
          'Your incredible farming ability has allowed you to cultivate crops into Immortal Emperors. +10000 contribution.',
        );
        user.addContribution(10000);
      } else {
        msg.channel.send("You don't know how to farm and tried to date a potato. -10 contribution.");
        user.removeContribution(10);
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
