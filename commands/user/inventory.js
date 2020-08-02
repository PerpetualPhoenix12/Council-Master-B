const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class inventory extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      aliases: ['inv'],
      memberName: 'inventory',
      group: 'user',
      description: 'View items in your inventory',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const user_inventory = user.getInventory();
      let inventory_string = '';
      for (const item in user_inventory) {
        const inv_item = user_inventory[item];
        const curItemObj = new Item(inv_item.item_id);
        const item_data = curItemObj.get();
        inventory_string += `- ${inv_item.count}x ${item_data.item_name} (${item_data.item_id})\n`;
      }
      msg.channel.send(`**__Your inventory__**:\n${inventory_string}`);
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
