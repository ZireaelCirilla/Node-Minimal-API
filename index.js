// Import all your needs
const express = require('express')
const app = express()

var firebase = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://twittahah.firebaseio.com"
});

const usersRouter = require('./src/users')
const tweetsRouter = require('./src/tweets')

//Use all your middlewares
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/tweets', tweetsRouter)

const PORT = 8080
const HOST = '0.0.0.0'
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`)