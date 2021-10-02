const express = require("express"),
app = express(),
WebSocket = require('ws'),
wss = new WebSocket.Server({ noServer: true })
fetch = require('node-fetch'),
Room = require('./src/Room'),
colors = require('colors/safe');

let uid = require("short-unique-id");
uid = new uid({ length: 10 });

// express setup
app.use(express.static("public"));


const HTML_PATH = `${__dirname}/html`;

const HandleSocket = require("./src/socket/HandleSocket");
handleSocket = new HandleSocket();


app.get("/", function(req, res) {
    res.sendFile(`${HTML_PATH}/index.html`);
});

app.get("/game/:game_id", function(req, res) {
    if (
        handleSocket.gameExist(req.params["game_id"]) &&
        !handleSocket.games[req.params["game_id"]].started
    ) {
        res.sendFile(`${HTML_PATH}/game.html`);
    }
});

app.post("/create_new_game", function(req, res) {
    let newGameId = uid();
    handleSocket.newGame(newGameId);
    res.redirect(`/game/${newGameId}`);
});

wss.on('connection', function (ws, req) {
    handleSocket.connection(ws, req);
});

const server = app.listen(8080, () => {
    console.log(`server started on :\n${colors.green("localhost:8080")}\n`);
});
server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});