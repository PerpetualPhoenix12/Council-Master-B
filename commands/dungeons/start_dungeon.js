const { Command } = require('discord.js-commando');
const Dungeon = require('../../structures/dungeon.js');
const Enchantment = require('../../structures/enchantment.js');
const User = require('../../structures/user.js');

module.exports = class start_dungeon extends Command {
  constructor(client) {
    super(client, {
      name: 'start_dungeon',
      aliases: ['sd'],
      memberName: 'start_dungeon',
      group: 'user',
      description: 'Start a dungeon.',
      args: [
        {
          key: 'dungeon_id',
          prompt: 'Enter the ID of the dungeon you want to enter.',
          type: 'integer',
        },
      ],
    });
  }
  run(msg, { dungeon_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (!user.isOnDungeon()) {
        const dungeon = new Dungeon(dungeon_id);
        if (dungeon.exists()) {
          const dungeon_data = dungeon.get();
          const enchantments = user.getEquippedEnchantments().map((enchant) => enchant.enchantment_id);
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
            const duration_reduction = dungeon_data.duration * (total_reduction / 100);
            duration = dungeon_data.duration - duration_reduction;
          } else {
            // Set default dungeon duration
            duration = dungeon_data.duration;
          }

          user.startDungeon(dungeon_id, duration);
          msg.channel.send("You've entered the dungeon. Check your status with `s!dungeon`.");
        } else {
          msg.channel.send('That dungeon is not available Try a different ID.');
        }
      } else {
        msg.channel.send("You're already in a dungeon.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
