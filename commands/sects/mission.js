const { Command } = require('discord.js-commando');
const Mission = require('../../structures/mission.js');
const User = require('../../structures/user.js');

module.exports = class mission extends Command {
  constructor(client) {
    super(client, {
      name: 'mission',
      aliases: ['m'],
      memberName: 'mission',
      group: 'sects',
      description: 'Displays your current mission.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (user.isOnMission()) {
        const mission_id = user.getCurrentMissionId();
        const cur_mission = new Mission(mission_id);
        const requirements = cur_mission.getRequirements();
        const rewards = cur_mission.getRewards();
        const mission_data = cur_mission.getData();

        let mission_string = `\`\`\`Mission Name: ${mission_data.name}\nDescription: ${mission_data.description}\nRewards: `;
        rewards.forEach((reward) => (mission_string += `${reward.count}x ${reward.item_name} `));
        mission_string += '\nRequirements: ';
        requirements.forEach((requirement) => (mission_string += `${requirement.count}x ${requirement.item_name}`));
        msg.channel.send(`${mission_string}\`\`\``);
      } else {
        msg.channel.send("You're not currently on a mission.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
