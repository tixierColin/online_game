const Room = require('../Room'),
colors = require('colors/safe');


// uid
let uid = require("short-unique-id");
uid = new uid({ length: 10 });

class HandleSocket {
    constructor(/*wss*/) {
        this.games = {};
    }

    gameExist(gameId) {
        return Object.keys(this.games).includes(gameId);
    }

    gameExistAndStarted() {
        return (
            Object.keys(this.games).includes(gameId) &&
            this.games[gameId].started
        );
    }

    playerInGame(gameId, playerId) {
        return this.games[gameId].players.includes(playerId);
    }

    newGame(gameId) {
        this.games[gameId] = new Room(gameId);
        console.log(this.games);
    }

    connection(ws, req) {
        // add to put an arrow function to pass the context
        ws.on('message', (msg) => {
            try {
                msg = JSON.parse(msg);
            } catch (err) {
                return;    
            }
            // browser
            if (
                msg.type == "browser" &&
                this.gameExist(gameId) &&
                !this.games[gameId].started
            ) {
                /*this.games[msg.game_id] = new Room(msg.game_id, ws);*/
                ///this.newGame
                this.games[msg.game_id].startRoom(ws);
                console.log("game started");
                
            }

            // player input
            if (msg.type == "input") { // TODO: make the start game thing
                // send to browser
                this.games[msg.room_id].roomConnection.send(
                    JSON.stringify(msg)
                );
            }
            // connection close remove player
            if (msg.type == "close" && this.gameExist(msg.room_id)) {
                this.games[msg.room_id].removePlayer(msg.player_id);
                this.games[msg.room_id].roomConnection.send(
                    JSON.stringify(msg)
                );
                console.log(colors.red(colors.red(`remove player: ${msg.player_id}`)));
            }

            // TODO: close connection browser
        });

        ws.on("close", function (msg) {
            console.log(colors.red("/!\\ close /!\\"));
        });

        let gameId = req.url.replace("/", "");
        if (this.gameExist(gameId) && this.games[gameId].started) {
            let playerId = uid();
            let newPlayer = { id: playerId, room_id: gameId};

            ws.send(JSON.stringify(newPlayer));
            newPlayer["connection"] = ws;

            this.games[gameId].players.push(newPlayer);
            this.games[gameId].roomConnection.send(JSON.stringify(
                {
                    type: "new_player",
                    data: { player_id: playerId }
                }
            ));
        }
    }
}

module.exports = HandleSocket;