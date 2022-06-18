# Dúvidas-Bot

Bot de Discord para servir de interface entre os monitores e o banco de dados do site [Dúvidas-IP](https://github.com/yrmeww/Duvidas-IP).

## Como usar
0. Assume-se que você já tem tanto o site quanto o banco de dados preparados. Caso não tenha, prepare-os primeiro.
1. Faça um fork deste repositório. ([Como faço forks?](https://docs.github.com/en/get-started/quickstart/fork-a-repo))
2. Abra o [portal de desenvolvedor do Discord](https://discord.com/developers/applications).
3. Crie uma nova aplicação, e na seção Bot, clique para Adicionar um Bot.
4. Salve o Token da aplicação em algum bloco de notas.
5. Entre na sua conta no [Heroku](https://dashboard.heroku.com/apps).
6. Entre no seu app do banco de dados do site, vá em Resources, clique em Postgres.
7. Vá para a seção Settings, clique em View Credentials, e salve os dados: Host, Database, User e Password.
8. Faça um clone do seu fork. Faremos algumas modificações nele.
9. Dentro da pasta data, no arquivo config.js, mude as configurações para os dados que você salvou (Token, Host, Database, User e Password).
10. Faça push nas modificações.
11. Volte para o dashboard do Heroku e crie um novo app.
12. Configure a seção de deploy para utilizar seu fork deste repositório.
13. Dê deploy.
14. Pronto! Seu bot deve estar configurado, e em instantes, deve ficar de pé.
15. Para adicioná-lo a seu servidor, siga estas [instruções](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).

PS: Talvez você tenha que mudar as permissões do bot ao adicioná-lo para que ele funcione. Preste atenção nas instruções do passo 15.