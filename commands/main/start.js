const { Command } = require('discord.js-commando');
const User = require('../../structures/user.js');

module.exports = class start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      aliases: ['begin'],
      memberName: 'start',
      group: 'main',
      description: 'Start your cultivation adventure!',
    });
  }
  run(msg) {
    const guard = User.add(msg.author.id);
    if (guard === -1) {
      msg.channel.send("Oi! You've already started. Cheeky bugger.");
    } else {
      msg.channel.send(
        "I'll have two number 9s, one number 10, a couple extra number 7s... oh. Didn't see you there, pal. So, err, you're supposed to be a cultivator or something now... Well done. I guess? \nGo away.\n\nStart your chad journey [:white_check_mark:]\nFill your harem [:x:]",
      );
    }
  }
};
