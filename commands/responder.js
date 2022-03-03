const db = require('../external/database.js');

// Exports
module.exports = {
    name: "responder", 
    category: "Geral",
    description: "Responde uma dúvida específica.",
    examples: ["responder ORI-DRYy-4239: marca a dúvida com o protocolo ORI-DRYy-4239 como respondida.",
    `responder ORI-DRYy-4239 "comentário exemplo": responde a dúvida com o protocolo ORI-DRYy-4239 com a resposta "comentário exemplo".`],
    details: ["Aspas são obrigatórias nas respostas."],
    min: 1, max: 2, cooldown: 5,
    execute: async (com_args, msg) => {
        
        let query = com_args.length > 0 ? 
        `UPDATE tb_duvidas SET status = 1, monitor = $3, comentario = $2 WHERE id = $1` : 
        `UPDATE tb_duvidas SET status = 1, monitor = $2 WHERE id = $1`;

        let args = com_args.length > 0 ? [com_args[0], com_args[1], msg.member.displayName] : [com_args[0], msg.member.displayName];
        
        let result = await db.makeQuery(query, args);


        if (result.rowCount == 0)
            msg.reply("Não existe uma dúvida com esse ID!")
        else
            msg.reply("Dúvida respondida!")
    }, 
    permission:  async (msg) => true
};
