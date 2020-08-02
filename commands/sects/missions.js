const { Command } = require('discord.js-commando');
const Mission = require('../../structures/mission.js');
const Sect = require('../../structures/sect.js');
const User = require('../../structures/user.js');

module.exports = class missions extends Command {
  constructor(client) {
    super(client, {
      name: 'missions',
      aliases: ['ms'],
      memberName: 'missions',
      group: 'sects',
      description: 'List all available missions in your sect.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (!user.isOnMission()) {
        const sect_id = user.get().sect_id;
        const sect = new Sect(sect_id);
        const missions = sect.getAvailableMissions();
        if (missions) {
          let mission_string = '';
          for (const mission in missions) {
            const curMission = missions[mission];
            const mission_rewards_data = new Mission(curMission.mission_id).getRewards();
            let rewards = '';
            for (const reward in mission_rewards_data) {
              const curReward = mission_rewards_data[reward];
              rewards += `${curReward.count}x ${curReward.item_name} `;
            }
            const message = `\`\`\`Mission (ID): ${curMission.name} (${curMission.mission_id})\nDescription: ${curMission.description}\nRewards: ${rewards}\n\`\`\`\n`;
            mission_string += message;
          }
          msg.channel.send(`Available missions: \n${mission_string}`);
        } else {
          msg.channel.send('No missions currently available.');
        }
      } else {
        msg.channel.send("You're already on a mission.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
