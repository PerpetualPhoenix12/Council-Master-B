const { Command } = require('discord.js-commando');
const Enchantment = require('../../structures/enchantment.js');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class enchant extends Command {
  constructor(client) {
    super(client, {
      name: 'enchant',
      aliases: ['en'],
      memberName: 'enchant',
      group: 'jobs',
      description: 'Enchant an item.',
      args: [
        {
          key: 'item_id',
          prompt: 'Enter ID of the item you want to enchant.',
          type: 'integer',
          default: 0,
        },
        {
          key: 'enchantment_id',
          prompt: 'Enter the ID of the enchantment you want to use.',
          type: 'string',
          default: 0,
        },
      ],
    });
  }
  run(msg, { item_id, enchantment_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (item_id && enchantment_id) {
        if (user.hasItemEquipped(item_id)) {
          const enchantment = new Enchantment(enchantment_id);
          const enchantment_data = enchantment.get();
          if (enchantment_data && user.hasLearnedEnchantment(enchantment_id)) {
            if (user.canUseEnchantment(enchantment_id)) {
              const enchantment_requirements = enchantment.getEnchantmentRequirements();

              let completed;
              for (const requirement in enchantment_requirements) {
                const cur_requirement = enchantment_requirements[requirement];

                if (user.existsInInventory(cur_requirement.item_id)) {
                  const cur_item = user.getFromInventory(cur_requirement.item_id);
                  if (cur_item.count >= cur_requirement.count) {
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
                const item = new Item(item_id);
                const item_data = item.get();
                const cur_item_enchantment_id = user.getItemEnchantment(item_id);
                const enchantment_type = enchantment_data.type;
                if (cur_item_enchantment_id) {
                  const cur_item_enchantment = new Enchantment(cur_item_enchantment_id);
                  const cur_enchantment_data = cur_item_enchantment.get();
                  const cur_enchantment_type = cur_enchantment_data.type;
                  if (cur_enchantment_type[0] !== 'T') {
                    const stats = {
                      A: 'agility',
                      S: 'strength',
                      VE: 'vital_essence',
                      I: 'intelligence',
                    };
                    const stat = stats[cur_enchantment_type];
                    const stat_increase = (cur_enchantment_data.value / 100) * item_data[stat];
                    user.removeFromStat(stat, stat_increase);
                  }
                  user.removeEnchantment(item_id);
                  msg.channel.send('Removing current enchantment...');
                }
                if (!enchantment_type[0] === 'T') {
                  const stats = {
                    A: 'agility',
                    S: 'strength',
                    VE: 'vital_essence',
                    I: 'intelligence',
                  };
                  const stat = stats[enchantment_type];
                  const stat_increase = (enchantment_data.value / 100) * item_data[stat];
                  user.addToStat(stat, stat_increase);
                }

                enchantment_requirements.forEach((requirement) =>
                  user.removeFromInventory(requirement.item_id, requirement.count),
                );
                user.addEnchantment(item_id, enchantment_id);
                user.addJobXp(10, 'AM');
                msg.channel.send(
                  `Added enchantment \`${enchantment_data.name}\` to item \`${item_data.item_name}\`.\nGained 10 Array Master xp`,
                );
              } else {
                msg.channel.send('You lack the materials to use this enchantment.');
              }
            } else {
              msg.channel.send('You lack the skill to use this enchantment.');
            }
          } else {
            msg.channel.send("You haven't learned to use this enchantment yet.");
          }
        } else {
          msg.channel.send('You must equip an item before enchanting it.');
        }
      } else {
        const enchantments = user.getUseableEnchantments();
        let craftable_string = '';
        enchantments.forEach((enchantment_obj) => {
          const enchantment = new Enchantment(enchantment_obj.enchantment_id);
          const enchantment_data = enchantment.get();
          craftable_string += `\`\`\`Enchantment Name (ID): ${enchantment_data.name} (${enchantment_data.enchantment_id})\nGrade: ${enchantment_data.grade}\nDescription: ${enchantment_data.description} (${enchantment_data.value}%)`;
          craftable_string += '\nMaterials Needed: ';
          const enchantment_requirements = enchantment.getEnchantmentRequirements();
          enchantment_requirements.forEach((requirement) => {
            const material_name = new Item(requirement.item_id).getItemName();
            craftable_string += `\n- ${requirement.count}x ${material_name}`;
          });
          craftable_string += '```';
        });
        msg.channel.send(`Enchantments you can use:\n${craftable_string}`);
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
