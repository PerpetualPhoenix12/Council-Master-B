const { Command } = require('discord.js-commando');
const Dungeon = require('../../structures/dungeon.js');
const Helper = require('../../structures/helper.js');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class dungeon extends Command {
  constructor(client) {
    super(client, {
      name: 'dungeon',
      aliases: ['d'],
      memberName: 'dungeon',
      group: 'user',
      description: 'Displays your current dungeon status.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (user.isOnDungeon()) {
        const cur_dungeon = user.getCurrentDungeonData();
        const dungeon = new Dungeon(cur_dungeon.dungeon_id);
        const dungeon_data = dungeon.get();
        // Total seconds elapsed since start
        const total_seconds_elapsed = Helper.millisToSeconds(Date.now() - cur_dungeon.started);

        const time_elapsed = Helper.millisToMinutesAndSeconds(Date.now() - cur_dungeon.started);
        // Minutes + seconds elapsed since start
        const minutes_passed = time_elapsed[0];
        const seconds_passed = time_elapsed[1];

        const dungeon_threshold = dungeon_data.threshold;

        const duration = cur_dungeon.duration;
        const duration_format = Helper.secondsToMinutesAndSeconds(duration);
        const duration_format_minutes = duration_format[0];
        const duration_format_seconds = duration_format[1];

        // eslint-disable-next-line no-self-compare
        if (total_seconds_elapsed >= duration || 1 === 1) {
          user.finishDungeon();
          const user_total_stats = user.getTotalStats();
          const stats_threshold_ratio = user_total_stats / dungeon_threshold;
          if (user_total_stats >= dungeon_threshold || Math.random() <= stats_threshold_ratio) {
            const drop_rarity = dungeon.getItemDropRarity(stats_threshold_ratio);
            const colours = {
              Mortal: ':brown_circle:',
              Earth: ':green_circle:',
              Heaven: ':blue_circle:',
              Mystic: ':purple_circle:',
              Divine: ':orange_circle:',
            };
            const item = Item.getRandomItemFromRarityAndGrade(drop_rarity, dungeon_data.grade);
            const drop_count = item.type === 'M' ? Math.ceil(Math.random() * 5) : 1;

            const extra_item_chance = dungeon.getExtraItem(stats_threshold_ratio);
            let extra_item_string = '';
            if (extra_item_chance) {
              const extra_drop_rarity = dungeon.getItemDropRarity(stats_threshold_ratio);
              const extra_item = Item.getRandomItemFromRarityAndGrade(extra_drop_rarity, dungeon_data.grade);
              const extra_drop_count = extra_item.type === 'M' ? Math.ceil(Math.random() * 5) : 1;
              user.addToInventory(extra_item.item_id, extra_drop_count);
              extra_item_string += `\nAdded ${extra_drop_count}x ${extra_item.item_name} (${extra_item.rarity} ${colours[extra_drop_rarity]}) to inventory!`;
            }

            user.addToInventory(item.item_id, drop_count);
            msg.channel.send(
              `Dungeon successfully cleared.\nAdded ${drop_count}x ${item.item_name} (${item.rarity} ${colours[drop_rarity]}) to inventory!${extra_item_string}`,
            );
          } else {
            msg.channel.send('You failed the dungeon and did not receive any rewards.');
          }
        } else {
          msg.channel.send(
            `\`\`\`Dungeon Name (ID): ${dungeon_data.name} (${dungeon_data.dungeon_id})\nDescription: ${
              dungeon_data.description
            }\nGrade: ${dungeon_data.grade}\nTier: ${
              dungeon_data.tier[0].toUpperCase() + dungeon_data.tier.slice(1)
            }\nDuration: ${duration_format_minutes} minute${
              duration_format_minutes > 1 ? 's' : ''
            } and ${duration_format_seconds} second${
              duration_format_seconds > 1 ? 's' : ''
            }\nTime Elapsed: ${minutes_passed} minute${
              minutes_passed > 1 || minutes_passed === 0 ? 's' : ''
            } and ${seconds_passed} second${seconds_passed > 1 || seconds_passed === 0 ? 's' : ''}\`\`\``,
          );
        }
      } else {
        msg.channel.send("You're not currently in a dungeon.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
