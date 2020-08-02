const { Command } = require('discord.js-commando');
const User = require('../../structures/user.js');

module.exports = class stats extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      aliases: ['s', 'st'],
      memberName: 'stats',
      group: 'user',
      description: 'View your stats.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id).get();
      msg.channel.send(
        `**__Your stats:__**\nStrength: ${user.strength}\nVital Essence: ${user.vital_essence}\nAgility: ${user.agility}\nIntelligence: ${user.intelligence}`,
      );
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
