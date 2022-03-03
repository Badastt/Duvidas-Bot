const timeFormatter = require('../utils/timeFormatter').timeFormatter;
const Discord = require('discord.js');
const {asyncCollectionForEach} = require('../utils/asyncForEach');

helpFormatting = (command) => {
    let embedResponse = new Discord.MessageEmbed()
	.setColor(0x1d51cc)
	.setAuthor("Bot")
	.setTitle(`Detalhes do comando '${command.name}'`)
	.addField(`Nome:`, `\`\`\`${command.name}\`\`\``, true);
    //.setThumbnail(`https://cdn.discordapp.com/attachments/690872764072067074/905221825078902875/logo_bracajour.png`);

    if (command.nicknames != null)
	    embedResponse = embedResponse.addField(`Apelidos:`, `\`\`\`${command.nicknames.join(", ")}\`\`\``, true);

    if (command.cooldown != null)
        embedResponse = embedResponse.addField(`Cooldown:`, `\`\`\`${timeFormatter(command.cooldown)}\`\`\``, true);

    if (command.description != null)
	    embedResponse = embedResponse.addField(`Descrição:`, `\`\`\`${command.description}\`\`\``, false);

    if (command.examples != null)
	    embedResponse = embedResponse.addField(`Exemplos de uso:`, `\`\`\`${command.examples.join("\n")}\`\`\``, false);

    if (command.details != null)
	    embedResponse = embedResponse.addField(`Detalhes de uso:`, `\`\`\`${command.details.join("\n")}\`\`\``, false);

	return embedResponse;
};

completeList = (command_list) => {
    let lists = {};
    for (let category in command_list) {
        let list = "";
        for (let command in command_list[category])
            list += command_list[category][command] + "\n";
        lists[category] = list;
    }

    let embed = new Discord.MessageEmbed()
    .setColor(0x1d51cc)
    .setAuthor("Bot")
	.setTitle(`Ajuda`)
    .setDescription(`Para mais detalhes sobre um comando específico, digite \`#ajuda <nome-do-comando>\`.`);

    for (let category in command_list) {
        embed.addField(`**${category.toUpperCase()}:**`, `${lists[category]}`, false);
    }

    return embed;
}

var name = "ajuda";

// Exports
module.exports = {
    name: name,
    nicknames: ['help'],
    category: "Geral",
    description: "Providencia uma lista de todos os comandos disponíveis ou detalhes de um comando específico.", 
    examples: ["#ajuda: Providencia uma lista de todos os comandos disponíveis.", 
    "#ajuda ping: providencia detalhes do comando 'ping'."],
    min: 0, max: 1, cooldown: 1,
    execute: async (com_args, msg) => {
        let commandList = {"Geral":[]};
        let requested_command = null;
        const { commands } = msg.client;

        console.log(typeof commands);
        await asyncCollectionForEach(commands, async (command) => {
            if (!(await command.permission(msg)))
                return;

            if (com_args[0] == command.name && requested_command === null)
                requested_command = command;
            
            if (command.category) {
                if (!Object.keys(commandList).includes(command.category))
                    commandList[command.category] = [];
                commandList[command.category].push("**" + command.name + "**: `" + command.description + "`");
            }
        });

        if (requested_command === null)
            msg.reply({embeds: [completeList(commandList)] });
        else
            msg.reply({embeds: [helpFormatting(requested_command)] });
    }, 
    permission:  async (msg) => true,
    helpFormatting: helpFormatting
};