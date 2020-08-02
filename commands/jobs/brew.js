const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class brew extends Command {
  constructor(client) {
    super(client, {
      name: 'brew',
      aliases: ['br'],
      memberName: 'brew',
      group: 'jobs',
      description: 'Brew a potion.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter ID of the potion you want to brew.',
          type: 'integer',
          default: 0,
        },
      ],
    });
  }
  run(msg, { item_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (item_id) {
        const item = new Item(item_id);
        const item_data = item.get();
        if (item_data && item.isCraftable('A')) {
          if (user.canCreateItem(item_data.grade, 'A')) {
            const ingredients_needed = item.getMaterials();

            let completed;
            for (const ingredient in ingredients_needed) {
              const cur_ingredient = ingredients_needed[ingredient];

              if (user.existsInInventory(cur_ingredient.material_id)) {
                const cur_item = user.getFromInventory(cur_ingredient.material_id);
                if (cur_item.count >= cur_ingredient.count) {
                  completed = true;
                } else {
                  completed = false;
                  break;
                }
              } else {
                completed = false;
                break;
              }
            }

            if (completed) {
              ingredients_needed.forEach((ingredient) =>
                user.removeFromInventory(ingredient.material_id, ingredient.count),
              );
              user.addToInventory(item_id, 1);
              user.addJobXp(10, 'A');
              msg.channel.send(`Added 1x ${item_data.item_name} to inventory.`);
              msg.channel.send('Gained 10 Alchemy xp');
            } else {
              msg.channel.send('You lack the ingredients to brew this potion.');
            }
          } else {
            msg.channel.send('You lack the skill to be able to make this item.');
          }
        } else {
          msg.channel.send('Invalid item ID.');
        }
      } else {
        const can_craft = user.getCraftableItems('A');
        let craftable_string = '';
        can_craft.forEach((craftable) => {
          const item = new Item(craftable.item_id);
          const item_data = item.get();
          const item_stats = item.getItemStats();
          craftable_string += `\`\`\`Item Name (ID): ${item_data.item_name} (${item_data.item_id})\nGrade: ${item_data.grade}\nRarity: ${item_data.rarity}`;
          item_stats.forEach((stat) => {
            craftable_string += `\n${stat[0]}: ${stat[1]}`;
          });
          craftable_string += `\nDescription: ${item_data.description}`;
          craftable_string += '\nMaterials Needed: ';
          const craft_requirements = item.getMaterials();
          craft_requirements.forEach((requirement) => {
            const material_name = new Item(requirement.material_id).getItemName();
            craftable_string += `\n- ${requirement.count}x ${material_name}`;
          });
          craftable_string += '```';
        });
        msg.channel.send(`You can currently brew:\n${craftable_string}`);
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
