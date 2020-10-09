require('dotenv').config();

const startup = require('./scripts/startup');
const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000

statesLookup = null;
API_KEY = process.env.API_KEY;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.frezw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
mongoclient = new MongoClient(uri, { useNewUrlParser: true });
mongoclient.connect(err => {
    if (err) {
        mongoclient.close();
    }
});


fetch = require('node-fetch');


require('./scripts/routes')(app);

app.listen(PORT, startup.startup);