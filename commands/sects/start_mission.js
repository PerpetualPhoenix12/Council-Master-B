const { Command } = require('discord.js-commando');
const Mission = require('../../structures/mission.js');
const User = require('../../structures/user.js');

module.exports = class start_mission extends Command {
  constructor(client) {
    super(client, {
      name: 'start_mission',
      aliases: ['sm'],
      memberName: 'start_mission',
      group: 'sects',
      description: 'Begin a sect mission.',
      args: [
        {
          key: 'mission_id',
          prompt: 'Enter the ID of the mission you want to start.',
          type: 'integer',
        },
      ],
    });
  }
  run(msg, { mission_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (!user.isOnMission()) {
        const sect_id = user.get().sect_id;
        const available = new Mission(mission_id).isAvailable(sect_id);
        if (available) {
          user.startMission(mission_id);
          msg.channel.send("You've started the mission!\nUse `s!mission` to track your progress.");
        } else {
          msg.channel.send("That mission isn't available. Try a different ID.");
        }
      } else {
        msg.channel.send("You're already on a mission.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
