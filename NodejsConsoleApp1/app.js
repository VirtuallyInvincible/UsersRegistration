'use strict';


// TODO: Build a separate ReactJS application to create a UI for the APIs.
// TODO: Wait until mongo connects. Then start listening to incoming user inputs.
// TODO: Currently the architecture is monolithic. Increase lose coupling by separating into components.


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const express = require('express');
const app = express();
const jsonParser = require('body-parser').json();


var server = null;


mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            console.error("Verify that you installed MongoDB and ran mongo via the command prompt in administrator mode.");
            return;
        }

        const db = client.db('users_registration');
        const users = db.collection('users');

        app.get('/listUsers', function (req, res) {
            users.find().toArray((err, items) => {
                if (err) {
                    console.error(err);
                }

                res.send(err ? 'An error has occurred.' : JSON.stringify(items, null, '\t'));
                res.end();
            });
        });
        app.post('/user', jsonParser, function (req, res) {
            users.insertOne(req.body, (err, result) => {
                if (err) {
                    console.error(err);
                }

                res.send(err ? 'An error has occurred.' : 'Done.');
                res.end();
            });
        });
        app.delete('/user/:id', function (req, res) {
            users.remove({ "id": { $eq: parseInt(req.params.id) } }, false, (err, item) => {
                if (err) {
                    console.error(err);
                }

                res.send(err ? "An error has occurred." :
                    item.result.n == 0 ? "No user with ID " + req.params.id + " exists." : 'Done.');
                res.end();
            });
        });

        server = app.listen(8081, function () {
            console.log('Listening at localhost:8081');
        });
    }
);

rl.on('line', () => {
    rl.close();
    if (server != null) {
        server.close();
    }
    mongoClient.close();
    process.exit(1);
});