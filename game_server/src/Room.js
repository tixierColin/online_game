class Room {
    constructor(id) {
        this.id = id;
        this.roomConnection = null;
        this.players = []; // list of connection
        this.started = false;
        this.gameStarted = false;
    }

    sendToAll() {
        for (const player of this.players) {
            
        }
    }

    removePlayer(playerId) {
        for (const [index, player] of this.players.entries()) {
            if (player.id == playerId) {
                this.players.splice(index, 1);
            }
        }
    }

    startRoom(ws) {
        this.roomConnection = ws;
        this.started = true;
    }
}

module.exports = Room;