const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class equip extends Command {
  constructor(client) {
    super(client, {
      name: 'equip',
      aliases: ['eq'],
      memberName: 'equip',
      group: 'user',
      description: 'Equip an item from your inventory.',
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
      if (user.existsInInventory(item_id)) {
        const item = new Item(item_id);
        if (item.isEquippable()) {
          const item_data = item.get();
          const cur_item_slot = user.getItemFromSlot(item_data.type);
          const column_ids = {
            Strength: 'strength',
            Agility: 'agility',
            'Vital Essence': 'vital_essence',
            Intelligence: 'intelligence',
          };

          if (cur_item_slot) {
            const equipped_item = new Item(cur_item_slot);
            user.unequipItem(cur_item_slot);
            const equipped_item_data = equipped_item.get();
            const equipped_item_stats = equipped_item.getItemStats();
            equipped_item_stats.forEach((stat) => {
              user.removeFromStat(column_ids[stat[0]], stat[1]);
            });
            user.addToInventory(cur_item_slot, 1);
            msg.channel.send(`Unequipped the \`${equipped_item_data.item_name}\``);
          }

          const item_stats = item.getItemStats();
          item_stats.forEach((stat) => {
            user.addToStat(column_ids[stat[0]], stat[1]);
          });
          user.equipItem(item_id, item_data.type);
          user.removeFromInventory(item_id, 1);
          msg.channel.send(`You equipped the \`${item_data.item_name}\`.`);
        } else {
          msg.channel.send("You can't equip this item.");
        }
      } else {
        msg.channel.send("This item isn't in your inventory.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
