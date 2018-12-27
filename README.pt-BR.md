# MinID.APP

[_English_](README.md)

## Introdução


Para obter o servidor Node funcionando localmente:

- Clone este repositório
```bash
- npm install (para instalar todas as Dependências)
```
- Instalar MongoDB ([instruções](https://docs.mongodb.com/manual/installation/#tutorials)) para executa-lo digitar `mongod`
```bash
- npm run dev (para iniciar o servidor local)
```

## Requerimentos
- NodeJs >= 6.x
- mongoDB



# Visão geral do app

## Dependências

- [async](https://github.com/caolan/async) - funções para trabalhar com async JavaScript. 
- [body-parser](https://github.com/expressjs/body-parser) - Node.js middleware para ajudar com os valores de POST request
- [cloudinary](https://cloudinary.com/) - Para upload de imagens
- [connect-flash](https://github.com/jaredhanson/connect-flash) - Para mensagens de aviso
- [expressjs](https://github.com/expressjs/express) - Servidor para lidar com rotas e HTTP requests
- [ejs](https://github.com/tj/ejs) - JavaScript templates para node
- [moment](https://github.com/moment/moment) - Lidar com formatos e validação de datas e horários.
- [mongoose](https://github.com/Automattic/mongoose) - Para criar modelos do mongoDB para JS
- [multer](https://github.com/expressjs/multer) - Upload de arquivos.
- [nodemailer](https://github.com/nodemailer/nodemailer) - Enviar emails para recuperar senha.
- [passport](https://github.com/jaredhanson/passport) - Lidar com autenticação de usuários

## Estrutura do app

- `app.js` - O ponto de entrada para o nosso aplicativo. Este arquivo define nosso servidor express e o conecta ao MongoDB usando mongoose. Também requere as rotas e modelos que usaremos no aplicativo.
- `middleware/` - Esta pasta contém middlewares usados nas rotas.
- `models/` - Esta pasta contém as definições de esquema para os modelos do Mongoose..
- `public/` - Esta pasta contém todo o css e parte do js usado no front-end.
- `routes/` - Esta pasta contém as definições de rota para o APP.
- `views/` - Esta pasta contém todos os modelos de views (ejs), incorporados para o aplicativo.



NOTA: Não se esqueça de definir as variáveis env.
- DATABASEURL (mongoDB url)
- ISADMIN  (configurar admin)
- CLOUDINARY_API_KEY (imagem upload)
- CLOUDINARY_API_SECRET (imagem upload)
- GMAILPW (remetente recuperar senha)


Em ambiente de desenvolvimento, não é seguro manter os ids e segredos em um arquivo, portanto, é necessário configurá-lo via linha de comando. Se você estiver usando o heroku, verifique como as variáveis de ambiente (.env) são definidas.
