const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class forge extends Command {
  constructor(client) {
    super(client, {
      name: 'forge',
      aliases: ['f'],
      memberName: 'forge',
      group: 'jobs',
      description: 'Forge an item.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter ID of the item you want to forge.',
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
        if (item_data && item.isCraftable('B')) {
          if (user.canCreateItem(item_data, 'B')) {
            const materials_needed = item.getMaterials();

            let completed;
            for (const material in materials_needed) {
              const cur_material = materials_needed[material];

              if (user.existsInInventory(cur_material.material_id)) {
                const cur_item = user.getFromInventory(cur_material.material_id);
                if (cur_item.count >= cur_material.count) {
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
              materials_needed.forEach((material) => user.removeFromInventory(material.material_id, material.count));
              user.addToInventory(item_id, 1);
              user.addJobXp(10, 'B');
              msg.channel.send(`Added 1x ${item_data.item_name} to inventory.`);
              msg.channel.send('Gained 10 Blacksmith xp');
            } else {
              msg.channel.send('You lack the ingredients to forge this item.');
            }
          } else {
            msg.channel.send('You lack the skill to be able to make this item.');
          }
        } else {
          msg.channel.send('Invalid item ID.');
        }
      } else {
        const can_craft = user.getCraftableItems('B');
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
        msg.channel.send(`You can currently forge:\n${craftable_string}`);
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
