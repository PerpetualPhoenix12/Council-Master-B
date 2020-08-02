const { Command } = require('discord.js-commando');
const Mission = require('../../structures/mission.js');
const User = require('../../structures/user.js');

module.exports = class submit extends Command {
  constructor(client) {
    super(client, {
      name: 'submit',
      aliases: [],
      memberName: 'submit',
      group: 'sects',
      description: 'Submit items to complete the mission',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (user.isOnMission()) {
        const mission_id = user.getCurrentMissionId();
        const mission = new Mission(mission_id);
        const requirements = mission.getRequirements();
        let completed;
        for (const requirement in requirements) {
          const cur_requirement = requirements[requirement];
          if (user.existsInInventory(cur_requirement.item_id)) {
            const item = user.getFromInventory(cur_requirement.item_id);
            if (item.count >= cur_requirement.count) {
              completed = true;
            } else {
              completed = false;
              break;
            }
          } else {
            completed = false;
            break;
          }
        }

        if (completed) {
          requirements.forEach((requirement) => user.removeFromInventory(requirement.item_id, requirement.count));
          const rewards = mission.getRewards();
          let rewards_string = '';
          rewards.forEach((reward) => {
            user.addToInventory(reward.item_id, reward.count);
            rewards_string += `Added ${reward.count}x ${reward.item_name} to inventory\n`;
          });
          msg.channel.send('Items submitted.');
          msg.channel.send('Mission successfully completed!');
          msg.channel.send(rewards_string);
          user.finishMission();
        } else {
          msg.channel.send('Missing items. Check the mission requirements with `s!mission`.');
        }
      } else {
        msg.channel.send("You're not currently on a mission.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
