const { Command } = require('discord.js-commando');
const Adventure = require('../../structures/adventure.js');
const Helper = require('../../structures/helper.js');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class adventure extends Command {
  constructor(client) {
    super(client, {
      name: 'adventure',
      aliases: ['a'],
      memberName: 'adventure',
      group: 'user',
      description: 'Displays your current adventure status.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (user.isOnAdventure()) {
        const cur_adventure = user.getCurrentAdventureData();
        const adventure = new Adventure(cur_adventure.adventure_id);
        const adventure_data = adventure.get();
        // Total seconds elapsed since start
        const total_seconds_elapsed = Helper.millisToSeconds(Date.now() - cur_adventure.started);
        const duration = cur_adventure.duration;

        if (total_seconds_elapsed >= duration) {
          // { item_id: x, count: x }
          const reward_id_count = adventure.getReward(msg.author.id);
          const reward = new Item(reward_id_count.item_id);
          const reward_data = reward.get();

          user.addToInventory(reward_id_count.item_id, reward_id_count.count);
          user.finishAdventure();

          const colours = {
            Mortal: ':brown_circle:',
            Earth: ':green_circle:',
            Heaven: ':yellow_circle:',
            Mystic: ':purple_circle:',
            Divine: ':orange_circle:',
          };
          msg.channel.send(
            `Adventure successfully finished.\nAdded ${reward_id_count.count}x ${reward_data.item_name} (${
              reward_data.rarity
            } ${colours[reward_data.rarity]}) to inventory!`,
          );
        } else {
          const duration_format = Helper.secondsToMinutesAndSeconds(duration);
          const duration_format_minutes = duration_format[0];
          const duration_format_seconds = duration_format[1];
          const format_seconds = `second${duration_format_seconds > 1 || duration_format_seconds === 0 ? 's' : ''}`;
          const duration_string = `${duration_format_minutes} minute${
            duration_format_minutes > 1 || duration_format_minutes === 0 ? 's' : ''
          } ${duration_format_seconds > 0 ? `and ${duration_format_seconds}${format_seconds}` : ''}`;

          const time_elapsed = Helper.millisToMinutesAndSeconds(Date.now() - cur_adventure.started);
          // Minutes + seconds elapsed since start
          const minutes_passed = time_elapsed[0];
          const seconds_passed = time_elapsed[1];

          const reward_id_count = adventure.getReward(msg.author.id);
          const adventure_reward = new Item(reward_id_count.item_id);
          const reward_data = adventure_reward.get();

          msg.channel.send(
            `\`\`\`Adventure Name (ID): ${adventure_data.name} (${adventure_data.adventure_id})\nDescription: ${
              adventure_data.description
            }\nRarity: ${adventure_data.rarity}\nDuration: ${duration_string}\nTime Elapsed: ${minutes_passed} minute${
              minutes_passed > 1 || minutes_passed === 0 ? 's' : ''
            } and ${seconds_passed} second${seconds_passed > 1 || seconds_passed === 0 ? 's' : ''}\n\nReward: ${
              reward_id_count.count
            }x ${reward_data.item_name}\`\`\`\n`,
          );
        }
      } else {
        msg.channel.send("You're not currently on an adventure.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
