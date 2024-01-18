# Restaurant List
A simple web application for tracking daily expense 

![listening page](./image/listening%20page.jpg)

## Features
- login with GOOGLE or register account by email and password both of which are necessary
- each user has own expense list
- Search expense by category
- create / delete / edit a expense


### Getting started

1.Prepare node.js and npm first

2.Make sure in the directory and use local terminal :

```
npm install
```

3.Use Sequelize as ORM to manage MySQL 

```
npx sequelize db:create
```
```
npx sequelize db:migrate
```

4. Setup ENV under .env.example file

```
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET= 
GOOGLE_URL= http://localhost:3000/oauth2/google/callback
```
5.Check environment variable NODE_ENV=development or ignore this step if under MAC/Linux systems

6.Then,
```
npm run seed
```

```
npm run start
```

4.Application is running successfully when you see

```
http://localhost:3000
```

5.Application can be paused by

```
ctrl + c
```

### Development Environment

- [Node.js](https://github.com/nvm-sh/nvm) 18.7.1
- [Express](https://www.npmjs.com/package/express) 4.18.2
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars) 7.1.2
- [MySQL2](https://www.npmjs.com/package/mysql2) 3.2.0
- [Sequelize](https://www.npmjs.com/package/sequelize) 6.30.0
- [Sequelize-cli](https://www.npmjs.com/package/sequelize-cli) 6.6.0
- [Method-override](https://www.npmjs.com/package/method-override) 3.0.0
- [connect-flash](https://www.npmjs.com/package/connect-flash) 0.1.1
- [dotenv](https://www.npmjs.com/package/dotenv) 16.3.1
- [express-session](https://www.npmjs.com/package/express-session) 1.17.3
- [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20) 2.0.0
- [passport-local](https://www.npmjs.com/package/passport-local) 1.0.0
- [passport](https://www.npmjs.com/package/passport) 0.7.0
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) 5.1.1


  
  
  
  
  
  
    