alert("do not close this web page");

let players = {};

const GAME_ID = window.location.pathname.split("/")[2];
const socket = new WebSocket(`ws://localhost:8080/${GAME_ID}`);

// Connection opened
socket.addEventListener('open', function (msg) {
    socket.send(JSON.stringify({
        type: "browser",
        game_id: GAME_ID
    }));
});

// Listen for messages
socket.addEventListener('message', function (msg) {
    //console.log('Message from server ', event.data);

    msg = JSON.parse(msg.data);

    if (msg.type == "new_player") {
        players[msg.data.player_id] = new Player(0, 0, msg.data.player_id);
        //players.push(new Player(0, 0, msg.data.player_id));
    }

    if (msg.type == "input") {
        players[msg.player_id].input.x = msg.data.x;
        players[msg.player_id].input.y = msg.data.y;
        //console.log(players[]);
        /*for (const player of players) {
            console.log(player.id, msg.player_id);
            if (player.id == msg.player_id) {
                console.log(1);
                player.input.x = msg.data.x;
                player.input.y = msg.data.y;
            }
            console.log(player.input.x);

        }*/
    }

    if (msg.type == "close") {
        delete players[msg.player_id]
        console.log(`${msg.player_id} : player left`);
    }
});


// QR CODE

let qrCode = new QRCode("qrcode", {
    width: 300,
    height: 300,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
});

qrCode.makeCode(`ws://192.168.0.35:8080/${GAME_ID}`);