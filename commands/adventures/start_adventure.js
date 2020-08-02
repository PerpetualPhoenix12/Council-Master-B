const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const Adventure = require('../../structures/adventure.js');
const Enchantment = require('../../structures/enchantment.js');
const Helper = require('../../structures/helper.js');
const Item = require('../../structures/item.js');
const User = require('../../structures/user.js');

module.exports = class start_adventure extends Command {
  constructor(client) {
    super(client, {
      name: 'start_adventure',
      aliases: ['sa'],
      memberName: 'start_adventure',
      group: 'user',
      description: 'Start an adventure.',
    });
  }
  run(msg) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);

      // Check if user is on an adventure
      // if he is, display appropriate message
      // roll for adventure rarity
      // 80% common, 15% rare, 5% epic
      // roll 3 times
      // fetch 3 dungeons from database with those rarities
      // roll for item drop rarity
      // fetch random item plan of that rarity
      // display data of 3 dungeons to the user
      // wait for user input on what adventure ID they want to go on
      // add adventure data to active_adventures
      // display start message

      if (!user.isOnAdventure()) {
        const adventures = [];
        for (let i = 0; i < 3; i++) {
          // Roll for adventure rarity
          // get rand num
          // check against defined vals above
          // fetch a random adventure of that rarity
          // push it to adventures
          const rand_num = Math.random() * 100;
          let rarity;
          if (rand_num <= 80) rarity = 'Common';
          else if (rand_num > 80 && rand_num <= 95) rarity = 'Rare';
          else rarity = 'Epic';

          const adventure_data = Adventure.getAdventureFromRarity(rarity);
          // Const adventure = new Adventure(adventure_data.adventure_id);

          // const plan_rarity = adventure.getPlanDropRarity();
          const item = Item.getRandomPlanFromRarityAndGrade('Mortal', 'Qi Gathering');
          adventure_data.reward = item;
          adventures.push(adventure_data);
        }
        let adventure_string = '';
        for (let i = 0; i < 3; i++) {
          const adventure = adventures[i];

          // Calc duration from enchantments
          const enchantments = user.getEquippedEnchantments();
          let total_reduction = 0;
          enchantments.forEach((enchantment_id_object) => {
            const enchantment = new Enchantment(enchantment_id_object.enchantment_id);
            const enchantment_data = enchantment.get();
            if (enchantment_data.type === 'TA') {
              total_reduction += enchantment_data.value;
            }
          });
          let duration;
          if (total_reduction > 0) {
            const duration_reduction = adventure.duration * (total_reduction / 100);
            duration = adventure.duration - duration_reduction;
          } else {
            // Set default dungeon duration
            duration = adventure.duration;
          }
          adventures[i].duration = duration;
          // Finish calc duration

          const duration_format = Helper.secondsToMinutesAndSeconds(duration);
          const duration_format_minutes = duration_format[0];
          const duration_format_seconds = duration_format[1];

          const format_seconds = ` second${duration_format_seconds > 1 || duration_format_seconds === 0 ? 's' : ''}`;
          const duration_string = `${duration_format_minutes} minute${
            duration_format_minutes > 1 || duration_format_minutes === 0 ? 's' : ''
          } ${duration_format_seconds > 0 ? `and ${duration_format_seconds}${format_seconds}` : ''}`;
          adventure_string += `\`\`\`Adventure Name (ID): ${adventure.name} (${i})\nDescription: ${adventure.description}\nRarity: ${adventure.rarity}\nDuration: ${duration_string}\n\nReward: ${adventure.reward.plan_name}\`\`\`\n`;
        }
        msg.channel.send(adventure_string);

        const collector = new Discord.MessageCollector(msg.channel, (m) => m.author.id === msg.author.id, {
          time: 10000,
          max: 1,
        });
        collector.on('collect', (message) => {
          if ([0, 1, 2].includes(parseInt(message))) {
            const adventure = adventures[parseInt(message)];
            msg.channel.send(`You've started the adventure: ${adventure.name}`);
            const duration = adventure.duration;

            user.startAdventure(adventure.adventure_id, adventure.reward.plan_id, duration);
          } else if (message.content.toLowerCase() === 'cancel') {
            msg.channel.send('Adventure cancelled.');
          } else {
            msg.channel.send('Invalid adventure ID.');
          }
        });
      } else {
        msg.channel.send("You're already on an adventure.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
