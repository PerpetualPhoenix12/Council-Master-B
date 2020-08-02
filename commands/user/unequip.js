const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class unequip extends Command {
  constructor(client) {
    super(client, {
      name: 'unequip',
      aliases: ['ueq'],
      memberName: 'unequip',
      group: 'user',
      description: 'Unequip an item you have equipped.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter the ID of the item in your inventory that you want to equip.',
          type: 'integer',
        },
      ],
    });
  }
  run(msg, { item_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);

      if (user.hasItemEquipped(item_id)) {
        const column_ids = {
          Strength: 'strength',
          Agility: 'agility',
          'Vital Essence': 'vital_essence',
          Intelligence: 'intelligence',
        };
        const item = new Item(item_id);

        user.unequipItem(item_id);

        const item_data = item.get();
        const item_stats = item.getItemStats();

        item_stats.forEach((stat) => {
          user.removeFromStat(column_ids[stat[0]], stat[1]);
        });

        user.addToInventory(item_id, 1);

        msg.channel.send(`Unequipped the \`${item_data.item_name}\``);
      } else {
        msg.channel.send("This item isn't in your inventory.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
