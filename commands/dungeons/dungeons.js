const { Command } = require('discord.js-commando');
const Enchantment = require('../../structures/enchantment.js');
const Helper = require('../../structures/helper.js');
const User = require('../../structures/user.js');

module.exports = class dungeons extends Command {
  constructor(client) {
    super(client, {
      name: 'dungeons',
      aliases: ['ds'],
      memberName: 'dungeons',
      group: 'user',
      description: 'Lists available dungeons.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (!user.isOnDungeon()) {
        const dungeons = user.getAvailableDungeons();
        const enchantments = user.getEquippedEnchantments().map((enchant) => enchant.enchantment_id);
        if (dungeons.length > 0) {
          let dungeon_string = '';
          for (const dungeon in dungeons) {
            const curDungeon = dungeons[dungeon];

            let total_reduction = 0;
            enchantments.forEach((enchantment_id) => {
              const enchantment = new Enchantment(enchantment_id);
              const enchantment_data = enchantment.get();
              if (enchantment_data.type === 'TD') {
                total_reduction += parseInt(enchantment_data.value);
              }
            });
            let duration;
            if (total_reduction > 0) {
              const duration_reduction = curDungeon.duration * (total_reduction / 100);
              duration = curDungeon.duration - duration_reduction;
            } else {
              // Set default dungeon duration
              duration = curDungeon.duration;
            }

            const duration_format = Helper.secondsToMinutesAndSeconds(duration);
            const duration_format_minutes = duration_format[0];
            const duration_format_seconds = duration_format[1];

            const format_seconds = ` second${duration_format_seconds > 1 || duration_format_seconds === 0 ? 's' : ''}`;
            const duration_string = `${duration_format_minutes} minute${
              duration_format_minutes > 1 || duration_format_minutes === 0 ? 's' : ''
            } ${duration_format_seconds > 0 ? `and ${duration_format_seconds}${format_seconds}` : ''}`;

            dungeon_string += `\`\`\`Dungeon Name (ID): ${curDungeon.name} (${curDungeon.dungeon_id})\nDescription: ${
              curDungeon.description
            }\nGrade: ${curDungeon.grade}\nTier: ${
              curDungeon.tier[0].toUpperCase() + curDungeon.tier.slice(1)
            }\nDuration: ${duration_string}\`\`\``;
          }
          msg.channel.send(dungeon_string);
        } else {
          msg.channel.send('There are no available dungeons for your realm.');
        }
      } else {
        msg.channel.send("You're already in a dungeon.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
