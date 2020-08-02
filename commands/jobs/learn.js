const { Command } = require('discord.js-commando');
const Item = require('../../structures/item.js');
const Plan = require('../../structures/plan.js');
const User = require('../../structures/user.js');

module.exports = class learn extends Command {
  constructor(client) {
    super(client, {
      name: 'learn',
      aliases: ['ln'],
      memberName: 'learn',
      group: 'jobs',
      description: 'Learn to create what is detailed on a plan.',
      args: [
        {
          key: 'plan_id',
          prompt: 'Enter ID of the plan.',
          type: 'integer',
          default: 0,
        },
      ],
    });
  }
  run(msg, { plan_id }) {
    if (User.exists(msg.author.id)) {
      const user = new User(msg.author.id);
      if (user.existsInInventory(plan_id)) {
        const plan = new Plan(plan_id);
        const plan_data = plan.get();
        if (plan_data) {
          const user_learnt_plans = user.getLearntPlans();
          const has_learnt_plan = user_learnt_plans.filter((item) => item.item_id === plan_data.item_id).length > 0;
          if (!has_learnt_plan) {
            user.learnPlan(plan_data);
            user.removeFromInventory(plan_id, 1);

            const item_learnt = new Item(plan_data.item_id);
            const item_data = item_learnt.get();
            msg.channel.send(`You have successfully learnt how to create: \`${item_data.item_name}\``);
          } else {
            msg.channel.send('You have already learnt how to make the item from this plan.');
          }
        } else {
          msg.channel.send('Inputted item is not a plan.');
        }
      } else {
        msg.channel.send("This plan isn't in your inventory.");
      }
    } else {
      msg.channel.send('You must start your adventure with `s!start`');
    }
  }
};
