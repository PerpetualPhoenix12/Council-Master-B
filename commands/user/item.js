const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class item extends Command {
  constructor(client) {
    super(client, {
      name: 'item',
      aliases: ['i'],
      memberName: 'item',
      group: 'user',
      description: 'View detailed information about an item.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter ID of the item you want to see.',
          type: 'integer',
        },
      ],
    });
  }
  run(msg, { item_id }) {
    if (User.exists(msg.author.id)) {
      if (Item.itemExists(item_id)) {
        const item = new Item(item_id);
        const item_data = item.get();
        const item_stats = item.getItemStats();
        const item_type_name = item.getItemTypeName();
        let item_string = `\`\`\`Item Name: ${item_data.item_name}\nType: ${item_type_name}\nGrade: ${
          item_data.grade
        }\nRarity: ${item_data.rarity}\nValue: ${item_data.value} spirit stone${
          item_data.value > 1 || item_data.value === 0 ? 's' : ''
        }\nDescription: ${item_data.description}\n`;
        item_stats.forEach((stat) => {
          item_string += `\n-${stat[0]}: ${stat[1]}`;
        });
        item_string += '```';
        msg.channel.send(item_string);
      } else {
        msg.channel.send("That item doesn't exist.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
