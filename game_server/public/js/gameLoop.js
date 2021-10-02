let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// make start animation

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 30, 30);
    
    for (const [key, player] of Object.entries(players)) {
        player.update();
    }

    ctx.fillStyle = "green";
    ctx.fillRect(50, 50, 30, 30);

    requestAnimationFrame(loop);
}

loop();