const db = require('../external/database.js');
const errors = require('../data/errors.js');
const Discord = require('discord.js');

// Exports
module.exports = {
    name: "checar", 
    category: "Geral",
    description: "Checa uma dúvida específica.",
    examples: ["checar ORI-DRYy-4239: checa a dúvida com o protocolo ORI-DRYy-4239."],
    min: 1, max: 1, cooldown: 5,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM tb_duvidas WHERE id = $1`, [com_args[0]]).then(async (result) => {
            if (result.rows.length == 0) {
                msg.reply(errors.duvida_inexistente);
                return;
            }

            let row = result.rows[0];
            let embed = new Discord.MessageEmbed()
            .setColor(0x1d51cc)
            .setTitle(`Duvida ${row.id}`)
            .addField("RA", row.ra, true)
            .addField("Nome", row.nome, true)
            .addField("Contato", row.contato, true)
            .addField("Data", `${row.date}`, true)
            .addField("Titulo", row.titulo, false)
            .addField("Duvida", row.duvida, false);

            msg.reply({embeds: [embed]});
        });
    }, 
    permission:  async (msg) => true
};
