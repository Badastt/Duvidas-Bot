// Discord API
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./data/config');

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    partials: [
        'CHANNEL',
    ]
});
const token = config.token;

const db = require('./external/database.js');
const {argumentParser} = require('./utils/argumentParser.js');
const {checkCommand} = require('./utils/checkCommand.js');
const {checkArgs} = require('./utils/checkArgs.js');
const errors = require('./data/errors.js');

// Comandos
const prefixes = config.prefixes;
Client.commands = new Discord.Collection();

const usageCooldowns = new Discord.Collection();

var botchannel;
Client.guilds.fetch().then(guilds => guilds.forEach(guild => {
    guild.fetch().then(async guild => {
        let result = await db.makeQuery(`SELECT channel FROM botchannel`);
        if (result.rowCount >= 1) {
            guild.channels.fetch(result.rows[0].channel).then(channel => {
                botchannel = channel;
            })
        }
    })
}))

const {ping} = require('./commands/ping.js');
const periodic_function = async () => {
    ping(botchannel, true);
    setTimeout(periodic_function, 60 * 1000);
};


// Gera os comandos - créditos para Marcus Vinicius Natrielli Garcia
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
    if (command.command)
        log.addToList(command.name, command.command);
}

// Inicialização
Client.on("ready", () => {
	console.log("Bot online");
    db.connectDB();
});

// Mensagens
Client.on("message", msg => {
	if (msg.author === Client.user)
		return;
    
    let prefix = "";
    for (let i = 0; i < prefixes.length; i++)
        if (msg.content.startsWith(prefixes[i])) {
            prefix = prefixes[i];
            break;
        }
    
    if (prefix === "")
        return;

    if (msg.content.length > 2000) {
        msg.reply(errors.mensagem_longa);
        return;
    }

    let [args, quoted_list] = argumentParser(msg.content.substring(prefix.length));
    if (args.length == 0)
        return;

    console.log(args);
    // Comando
    const { commands } = msg.client;
    let found = false;
    commands.forEach(async (command) => {
        if (found || !checkCommand(command, args))
            return;
        
        found = true;
        if (!checkArgs(command, args, quoted_list, msg))
            return;

        command.execute(args.slice(1), msg, quoted_list, Client);
    })

    if (found)
        return;

    msg.reply(errors.comando_inexistente);
});


Client.on("messageReactionAdd", (reaction, user) => {
    if (user === Client.user || reaction.message.author != Client.user)
        return;
    
    const { commands } = reaction.message.client;
    commands.forEach(async (command) => {
        if (command.reaction)
            command.reaction(reaction, user);
    });
})

Client.login(token);

setTimeout(periodic_function, 10 * 1000);