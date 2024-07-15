const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const replayBtn = document.getElementById('replayBtn');
const homeBtn = document.getElementById('homeBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 50, y: 50, width: 50, height: 50, speed: 5, image: new Image() };
let monster = { x: 300, y: 300, width: 50, height: 50, speed: 3, image: new Image() };
let coins = generateCoins();
let score = parseInt(localStorage.getItem('coinCount')) || 0;
let gameOver = false;

player.image.src = 'images/player.png'; 
monster.image.src = 'images/monster.png';
coins.forEach(coin => coin.image.src = 'images/coin.png');

const coinImage = new Image();
coinImage.src = 'images/coin.png';

function generateCoins() {
    let newCoins = [];
    for (let i = 0; i < 10; i++) {
        newCoins.push({
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            width: 20,
            height: 20,
            image: new Image()
        });
    }
    return newCoins;
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawMonster() {
    ctx.drawImage(monster.image, monster.x, monster.y, monster.width, monster.height);
}

function drawCoins() {
    coins.forEach(coin => {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
    });
}

function drawScore() {
    ctx.drawImage(coinImage, 20, 10, 30, 30);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(' x ' + score, 60, 35);
}

function update() {
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    if (player.x < monster.x) monster.x -= monster.speed;
    if (player.x > monster.x) monster.x += monster.speed;
    if (player.y < monster.y) monster.y -= monster.speed;
    if (player.y > monster.y) monster.y += monster.speed;

    if (isColliding(player, monster)) {
        gameOver = true;
        message.classList.remove('hidden');
        localStorage.setItem('coinCount', score);
        return;
    }

    coins.forEach(coin => {
        if (isColliding(player, coin)) {
            score++;
            coin.x = Math.random() * (canvas.width - 20);
            coin.y = Math.random() * (canvas.height - 20);
        }
    });
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function resetGame() {
    player.x = 50;
    player.y = 50;
    monster.x = Math.random() * (canvas.width - 100) + 50;
    monster.y = Math.random() * (canvas.height - 100) + 50;
    coins = generateCoins();
    coins.forEach(coin => coin.image.src = 'images/coin.png'); 
    gameOver = false;
    message.classList.add('hidden');
    gameLoop();
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawMonster();
    drawCoins();
    drawScore();
    update();
    requestAnimationFrame(gameLoop);
}

let keys = {};
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

replayBtn.addEventListener('click', resetGame);
homeBtn.addEventListener('click', function() {
    window.location.href = 'Index.html';
});

gameLoop();