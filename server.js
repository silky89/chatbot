// var restify = require('restify');
// var builder = require('botbuilder');
// var inMemoryStorage = new builder.MemoryBotStorage();
//
// // Setup Restify Server
// var server = restify.createServer();
// server.listen(8000 || 8000 || 3978, function() {
// 	console.log('%s listening to %s', server.name, server.url);
// });
// var connector = new builder.ChatConnector({
// 	appId: "",
// 	appPassword: ""
// });
//
// server.post('/api/messages', connector.listen());
//
// var bot = new builder.UniversalBot(connector);
//
// bot.dialog('/', function (session, args) {
//     if (!session.userData.greeting) {
//         session.send("Hello. What is your name?");
//         session.userData.greeting = true;
//     } else if (!session.userData.name) {
//         getName(session);
//     } else if (!session.userData.email) {
//         getEmail(session);
//     } else if (!session.userData.password) {
//         getPassword(session);
//     } else {
//         session.userData = null;
//     }
//     session.endDialog();
// });
//
// function getName(session) {
//     name = session.message.text;
//     session.userData.name = name;
//     session.send("Hello, " + name + ". What is your Email ID?");
// }
//
// function getEmail(session) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     email = session.message.text;
//     if (re.test(email)) {
//         session.userData.email = email;
//         session.send("Thank you, " + session.userData.name + ". Please set a new password.");
//     } else {
//         session.send("Please type a valid email address. For example: test@hotmail.com");
//     }
// }
//
// function getPassword(session) {
//     var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
//     password = session.message.text;
//     if (re.test(password)) {
//         session.userData.password = password;
//         var data = session.userData;
//         // sendData(data, function (msg) {
//             session.send("Thank You "+session.userData.name+" You are now signed up");
//             // session.userData = null;
//         // });
//     } else {
//         session.send("Password must contain at least 8 characters, including at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character. For example: Mybot@123");
//     }
// }
//
// function sendData(data, cb) {
//     http.get("http://local.dev/aplostestbot/saveData.php?name=" + data.name + "&email=" + data.email + "&password=" + data.password, function (res) {
//         var msg = '';
//         res.on("data", function (chunk) {
//             msg += chunk;
//         });
//
//         res.on('end', function () {
//             cb(msg);
//         });
//
//     }).on('error', function (e) {
//         console.log("Got error: " + e.message);
//     });
// }




// var http = require('http');
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// require('./routes')(app);
// var server = app.listen(8000, function() {
//     console.log("app running on 8000");
// });

// initialize proc
// proc.init(app);



var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(8000 || 8081 || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "47340519-6bd9-4d02-9636-e30f9b40ac93",
    appPassword: "utzZCJ262=qbupNEOA38@{#"
});

console.log("connector",connector);
// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});