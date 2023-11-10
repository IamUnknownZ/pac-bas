const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");

const pacmanImage = new Image();
pacmanImage.src = 'pacbas.png'; // Replace 'your-image-url.jpg' with the path to your image

const pacman = {
    x: 200,
    y: 200,
    width: 30,
    height: 30,
    directionX: 0,
    directionY: 0,
    speed: 3,
};

let pellets = [];
let obstacles = [
    { x: 100, y: 100, width: 50, height: 150 },
    { x: 250, y: 200, width: 80, height: 30 },
];

let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let level = 1;

function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    ctx.rotate(Math.atan2(pacman.directionY, pacman.directionX));
    ctx.drawImage(pacmanImage, -pacman.width / 2, -pacman.height / 2, pacman.width, pacman.height);
    ctx.restore();
}

function drawPellets() {
    ctx.fillStyle = "#fff";
    pellets.forEach((pellet) => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, pellet.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });
}

function drawObstacles() {
    ctx.fillStyle = "#ff0000";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollisions() {
    pellets.forEach((pellet, index) => {
        const distance = Math.sqrt((pacman.x - pellet.x) ** 2 + (pacman.y - pellet.y) ** 2);
        if (distance < pacman.width / 2 + pellet.radius) {
            pellets.splice(index, 1);
            score++;
            if (pellets.length === 0) {
                level++;
                generateRandomLevel();
            }
        }
    });

    obstacles.forEach((obstacle) => {
        const pacmanCenterX = pacman.x;
        const pacmanCenterY = pacman.y;

        if (
            pacmanCenterX > obstacle.x &&
            pacmanCenterX < obstacle.x + obstacle.width &&
            pacmanCenterY > obstacle.y &&
            pacmanCenterY < obstacle.y + obstacle.height
        ) {
            pacman.directionX = 0;
            pacman.directionY = 0;
            updateHighestScore();
        }
    });
}

function revivePacman() {
    pacman.x = 10;
    pacman.y = 20;
    pacman.directionX = 0;
    pacman.directionY = 0;
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#FFFF00";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawHighestScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff000";
    ctx.fillText(`Highest Score: ${highestScore}`, 10, 40);
}

function drawLevel() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#fff000";
    ctx.fillText(`Level: ${level}`, 10, 60);
}

function updateHighestScore() {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore);
    }
}

function generateRandomLevel() {
    score = 0;
    pellets = [];
    const pelletCount = level * 3;
    const pelletRadius = 5;

    for (let i = 0; i < pelletCount; i++) {
        let pelletX, pelletY;

        do {
            pelletX = Math.random() * (canvas.width - pelletRadius * 2) + pelletRadius;
            pelletY = Math.random() * (canvas.height - pelletRadius * 2) + pelletRadius;
        } while (isPelletInsideObstacle(pelletX, pelletY, pelletRadius));

        pellets.push({
            x: pelletX,
            y: pelletY,
            radius: pelletRadius,
        });
    }

    obstacles = [];
    const obstacleCount = level * 2;
    for (let i = 0; i < obstacleCount; i++) {
        const obstacleWidth = Math.random() * 50 + 30;
        const obstacleHeight = Math.random() * 50 + 30;

        obstacles.push({
            x: Math.random() * (canvas.width - obstacleWidth),
            y: Math.random() * (canvas.height - obstacleHeight),
            width: obstacleWidth,
            height: obstacleHeight,
        });
    }
}

function isPelletInsideObstacle(pelletX, pelletY, pelletRadius) {
    for (const obstacle of obstacles) {
        if (
            pelletX + pelletRadius > obstacle.x &&
            pelletX - pelletRadius < obstacle.x + obstacle.width &&
            pelletY + pelletRadius > obstacle.y &&
            pelletY - pelletRadius < obstacle.y + obstacle.height
        ) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    pacman.x = 200;
    pacman.y = 200;
    pacman.directionX = 0;
    pacman.directionY = 0;
    level = 1;
    generateRandomLevel();
}

function update() {
    clearCanvas();
    drawObstacles();
    drawPellets();
    drawPacman();
    drawScore();
    drawHighestScore();
    drawLevel();
    checkCollisions();
    updateHighestScore();

    if (pacman.directionX !== 0 || pacman.directionY !== 0) {
        const angle = Math.atan2(pacman.directionY, pacman.directionX);
        pacman.x += pacman.speed * Math.cos(angle);
        pacman.y += pacman.speed * Math.sin(angle);

        if (pacman.x - pacman.width / 2 < 0 || pacman.x + pacman.width / 2 > canvas.width) {
            pacman.directionX = 0;
        }

        if (pacman.y - pacman.height / 2 < 0 || pacman.y + pacman.height / 2 > canvas.height) {
            pacman.directionY = 0;
        }
    }

    requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        pacman.directionX = 1;
    } else if (event.key === "ArrowLeft") {
        pacman.directionX = -1;
    } else if (event.key === "ArrowDown") {
        pacman.directionY = 1;
    } else if (event.key === "ArrowUp") {
        pacman.directionY = -1;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        pacman.directionX = 0;
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        pacman.directionY = 0;
    }
});

document.getElementById("reviveButton").addEventListener("click", revivePacman);
document.getElementById("resetButton").addEventListener("click", resetGame);

generateRandomLevel();
pacmanImage.onload = update;
