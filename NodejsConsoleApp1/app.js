'use strict';


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const mongoClient = require('mongodb').MongoClient;
const port = 27017;
const url = `mongodb://localhost:${port}`;
const express = require('express');
const app = express();
const jsonParser = require('body-parser').json();
const cors = require('cors');


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

        app.use(cors({ origin: '*' }));

        app.get('/listUsers', function (req, res) {
            users.find().toArray((err, items) => {
                if (err) {
                    console.error(err);
                    res.send({
                        'StatusCode': 500,
                        'ErrorMessage': 'An error has occurred.'
                    });
                } else {
                    res.send({
                        'StatusCode': 200,
                        'Data': items
                    });
                }
                res.end();
            });
        });
        app.post('/user', jsonParser, function (req, res) {
            users.insertOne(req.body, (err, result) => {
                if (err) {
                    console.error(err);
                    res.send({
                        'StatusCode': 500,
                        'ErrorMessage': 'An error has occurred.'
                    });
                } else {
                    res.send({
                        'StatusCode': 201,
                        'Message': 'Done.'
                    });
                }
                res.end();
            });
        });
        app.delete('/user/:id', function (req, res) {
            users.remove({ 'id': { $eq: parseInt(req.params.id) } }, false, (err, item) => {
                if (err) {
                    console.error(err);
                    res.send({
                        'StatusCode': 500,
                        'ErrorMessage': 'An error has occurred.'
                    });
                } else {
                    res.send({
                        'StatusCode': 200,
                        'Message': item.result.n == 0 ? `No user with ID ${req.params.id} exists.` : 'Done.'
                    });
                }
                res.end();
            });
        });

        server = app.listen(port, function () {
            console.log(`Listening on port ${port}`);

            rl.on('line', () => {
                rl.close();
                if (server != null) {
                    server.close();
                }
                mongoClient.close();
                process.exit(1);
            });
        });
    }
)