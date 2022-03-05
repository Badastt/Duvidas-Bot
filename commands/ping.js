const db = require('../external/database.js');
const Discord = require('discord.js');

var ping = async (channel, onlyShowNotified = false) => {
    await db.makeQuery(`SELECT id, ra, nome, contato, titulo FROM tb_duvidas WHERE status = 0 ${onlyShowNotified ? 'AND notified = false' : ''}`)
    .then(async (result) => {
        if (result.rowCount == 0) {
            if (!onlyShowNotified)
                channel.send("Não há dúvidas não respondidas no momento.");
            return;
        }

        let embed = new Discord.MessageEmbed()
        .setColor(0x1d51cc)
        .setTitle("Duvidas");

        if (onlyShowNotified)
            db.makeQuery(`UPDATE tb_duvidas SET notified = true`);

        result.rows.forEach(row => {
            embed = embed.addField(row.id, `RA: ${row.ra}\nNome: ${row.nome}\nContato: ${row.contato}\nTítulo: ${row.titulo}`, false);
        })
        
        channel.send({embeds: [embed]});
    });
}

// Exports
module.exports = {
    name: "ping",
    category: "Geral",
    description: "Checa a lista de dúvidas não-respondidas.", 
    min: 0, max: 0, cooldown: 5,
    execute: async (com_args, msg) => {
        ping(msg.channel);
    },
    permission:  async (msg) => true,
    ping: ping
};
