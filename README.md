# MentoriaBolsa-Eng-BD-
Alusivo ao ano 3. Criação de projectos  como requisitos das disciplinas BD+EngSoftware

Como rodar?

no pasta do projeto 

cria um arquivo .env (att.: nao pode ir ao banco de dados)

codigo do .env

 PORTA=3000
URL_BANCO=postgresql://postgres:senha_banco_dados@localhost:5432/bolsas_estudo
SEGREDO_JWT=c929cc750b63a5a506ff6003f728c7529bcd633aae622cd814c97561d5cdd397
ORIGEM_FRONTEND=http://localhost:5173
AMBIENTE=desenvolvimento

no terminal: 

na pasta onde esta o backend: 
1) npm install
2) npm run desenvolvimento 
3) criar a base de dados no postgres :

 create database bolsas-estudo;


e rodar o codigo do "codigoSql.sql"
e rodar: insert into "utilizadores" ( "nomeCompleto","email" ,"palavraPasseHash","tipo" )values('admin','admin@admin.com','$2b$12$N9Dl1/KaxIccVoaLTv9lNOJH.2QajEPOpUgnFwCN0fr5h8rDbujQq', 'administrador');



No pasta do front:

1) npm install
2) npm run dev 
3) no navegador: http://localhost:5173/ e testar com 

User: admin@admin.com
senha: teste1234567