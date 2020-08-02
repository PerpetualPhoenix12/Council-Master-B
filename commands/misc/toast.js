/* eslint-disable */

const { Command } = require('discord.js-commando');

module.exports = class toast extends Command {
  constructor(client) {
    super(client, {
      name: 'toast',
      aliases: [],
      memberName: 'toast',
      group: 'misc',
      description: 'toast',
      ownerOnly: true
    });
  }
  async run(message) {
    
    // toast it

  }
};
