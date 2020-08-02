const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const Sect = require('../../structures/sect.js');
const User = require('../../structures/user.js');

module.exports = class sect_exchange extends Command {
  constructor(client) {
    super(client, {
      name: 'sect_exchange',
      aliases: ['se'],
      memberName: 'sect_exchange',
      group: 'sects',
      description: 'Open your sect exchange and purchase items with your contribution.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const user_data = user.get();
      const sect = new Sect(user_data.sect_id);
      const exchange_items = sect.getExchangeItems();
      let items_string = '';
      exchange_items.forEach((exchange_item) => {
        const item = new Item(exchange_item.item_id);
        const item_data = item.get();
        const item_stats = item.getItemStats();
        items_string += `\`\`\`Item Name (ID): ${item_data.item_name} (${item_data.item_id})\nGrade: ${item_data.grade}\nRarity: ${item_data.rarity}`;
        if (item_stats) items_string += '\n';
        item_stats.forEach((stat) => {
          items_string += `\n${stat[0]}: ${stat[1]}`;
        });
        items_string += `\n\nDescription: ${item_data.description}\nPrice: ${exchange_item.price} contribution\`\`\``;
      });
      msg.channel.send(items_string);
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
