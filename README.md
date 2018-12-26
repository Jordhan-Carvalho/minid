# MinID.APP

[_Português_](README.pt-BR.md)

# Getting started

## Requirements
- NodeJs >= 6.x
- mongoDB

To get the Node server running locally:

- Clone this repo
```bash
- npm install to install all required dependencies
```
- Install MongoDB ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
```bash
- npm run dev to start the local server
```


# Code Overview

## Dependencies

- [async](https://github.com/caolan/async) - Powerful functions for working with asynchronous JavaScript. 
- [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware
- [cloudinary](https://cloudinary.com/) - For image uploading
- [connect-flash](https://github.com/jaredhanson/connect-flash) - Flashing messages
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [ejs](https://github.com/tj/ejs) - Embedded JavaScript templates for node
- [moment](https://github.com/moment/moment) - JS date library for parsing, validating, manipulating, and formatting dates.
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [multer](https://github.com/expressjs/multer) - Image uploading.
- [nodemailer](https://github.com/nodemailer/nodemailer) - Sending recovery password emails.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `middleware/` - This folder contains middlewares for the routes.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `public/` - This folder contains all the css and js used on the front-end.
- `routes/` - This folder contains the route definitions for our API.
- `views/` - This folder contains all the front-end and embedded JS templates (ejs) for the app.



NOTE: Do not forget to set the env variables. 
- DATABASEURL (mongoDB url)
- ISADMIN  (setting admin)
- CLOUDINARY_API_KEY (image upload)
- CLOUDINARY_API_SECRET (image upload)
- GMAILPW (sending recovery email)

In production env, it is not safe to keep the ids and secrets in a file, so you need to set it up via commandline. If you are using heroku checkout how environment variables are set here.

