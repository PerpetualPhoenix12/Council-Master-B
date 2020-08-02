const { Command } = require('discord.js-commando');
const Enchantment = require('../../structures/enchantment.js');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class equip extends Command {
  constructor(client) {
    super(client, {
      name: 'equipped',
      aliases: ['eqd'],
      memberName: 'equipped',
      group: 'user',
      description: 'See your equipped items.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      const equipped_items = user.getEquippedItemIds();
      let equipped_string = 'Your equipped items:\n```';
      equipped_items.forEach((equipped_item) => {
        const item = new Item(equipped_item.item_id);
        const item_data = item.get();
        const item_stats = item.getItemStats();
        equipped_string += `\nSlot: ${equipped_item.name}\nItem: ${item_data.item_name} (${item_data.item_id})\nRarity: ${item_data.rarity}`;
        item_stats.forEach((stat) => {
          equipped_string += `\n${stat[0]}: ${stat[1]}`;
        });
        equipped_string += '\n';
        const enchantment_id = user.getItemEnchantment(item_data.item_id);
        if (enchantment_id) {
          const enchantment = new Enchantment(enchantment_id);
          const enchantment_data = enchantment.get();
          equipped_string += `Enchantment: ${enchantment_data.name} (${enchantment_data.value}%)\n`;
        }
      });
      equipped_string += '```';
      msg.channel.send(equipped_string);
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
