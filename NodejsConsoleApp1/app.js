'use strict';

var express = require('express');
var bodyParser = require('body-parser')


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


// TODO: Upload the application to GitHub.
// TODO: Interface with MongoDB instead of the local array to make the data persistent.
// TODO: Use ReactJS to create a UI for the APIs.
var users = [];
var app = express();
var jsonParser = bodyParser.json();
app.get('/listUsers', function (req, res) {
    var usersAsString = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        usersAsString += JSON.stringify(user) + "\n";
    }
    res.send(usersAsString);
    res.end();
});
app.post('/user', jsonParser, function (req, res) {
    users.push(req.body);
    res.send('Done.');
    res.end();
});
app.delete('/user/:id', function (req, res) {
    var id = req.params.id;
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.id == id) {
            users.splice(i, 1);
            res.send("Done.");
            res.end();
            return;
        }
    }
    res.send("No user with ID " + id + " exists.");
    res.end();
});

var server = app.listen(8081, function () {
    console.log('Listening at localhost:8081');
});

rl.on('line', () => {
    rl.close();
    server.close();
    process.exit(1);
});