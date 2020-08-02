const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const Sect = require('../../structures/sect.js');
const User = require('../../structures/user.js');

module.exports = class sect_buy extends Command {
  constructor(client) {
    super(client, {
      name: 'sect_buy',
      aliases: ['sb'],
      memberName: 'sect_buy',
      group: 'sects',
      description: 'Buy an item from your sect exchange.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter the ID of the item you want to buy:',
          type: 'integer',
        },
      ],
    });
  }
  run(msg, { item_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const user_data = user.get();
      const sect = new Sect(user_data.sect_id);
      const item = sect.getFromExchange(item_id);
      const item_data = new Item(item_id).get();
      if (item) {
        if (user_data.contribution >= item.price) {
          user.addToInventory(item_id, 1);
          user.removeContribution(item.price);
          msg.channel.send(`Successfully bought: ${item_data.item_name}`);
        } else {
          msg.channel.send("You can't afford that item.");
        }
      } else {
        msg.channel.send("You can't buy that from your sect.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
