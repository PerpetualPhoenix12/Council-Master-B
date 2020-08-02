const path = require('path');
const Commando = require('discord.js-commando');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const { token } = require('./config.json');

const Database = require('./structures/db.js');
// eslint-disable-next-line no-warning-comments
// TODO: Add an event handler
// Const EventHandler = require('./structures/events.js');

const client = new Commando.Client({
  owner: ['182148584412676096'],
  commandPrefix: 's!',
  disableEveryone: true,
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ activity: { name: 'the sound of my voice', type: 2 }, status: 'dnd' });

  const db = new Database();
  db.init();
});

client.registry
  .registerGroups([
    ['admin', 'Admin Commands'],
    ['sects', 'Sect commands'],
    ['fun', 'Fun commands'],
    ['user', 'User commands'],
    ['utils', 'Utility commands'],
    ['misc', 'Miscellaneous commands'],
    ['main', 'Main commands'],
    ['jobs', 'Job Commands'],
  ])
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    eval: false,
    // CommandState: false,
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client
  .setProvider(
    sqlite
      .open({ filename: path.join(__dirname, '/data/db/settings.db'), driver: sqlite3.Database })
      .then((db) => new Commando.SQLiteProvider(db)),
  )
  .catch(console.error);

client.login(token);
