document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('gameContainer');
    const car = document.getElementById('car');
    const gameOver = document.getElementById('gameOver');
    const restartButton = document.getElementById('restartButton');
    let obstacles = [];
    let carSpeed = 10;
    let obstacleSpeed = 2;
    let gameRunning = true;

    function createObstacle() {
        if (!gameRunning) return;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.random() * (gameContainer.clientWidth - 50) + 'px';
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
    
    function moveCar(event) {
        if (!gameRunning) return;
        const carRect = car.getBoundingClientRect();
        const gameContainerRect = gameContainer.getBoundingClientRect();
        let currentLeft = parseFloat(window.getComputedStyle(car).left);

        if (event.key === 'q' && currentLeft > 0) {
            car.style.left = (currentLeft - carSpeed) + 'px';
        } else if (event.key === 'd' && currentLeft < (gameContainer.clientWidth - carRect.width)) {
            car.style.left = (currentLeft + carSpeed) + 'px';
        }
    }

    function checkCollision(rect1, rect2) {
        return !(rect1.top > rect2.bottom || rect1.bottom < rect2.top || rect1.left > rect2.right || rect1.right < rect2.left);
    }

    function updateGame() {
        if (!gameRunning) return;
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (obstacleRect.top >= gameContainer.clientHeight) {
                gameContainer.removeChild(obstacle);
                obstacles = obstacles.filter(o => o !== obstacle);
            } else {
                obstacle.style.top = obstacleRect.top + obstacleSpeed + 'px';
                if (checkCollision(car.getBoundingClientRect(), obstacleRect)) {
                    gameOver.style.display = 'block';
                    gameRunning = false;
                }
            }
        });

        requestAnimationFrame(updateGame);
    }

    function restartGame() {
        gameOver.style.display = 'none';
        car.style.left = '50%';
        car.style.transform = 'translateX(-50%)';
        obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
        obstacles = [];
        gameRunning = true;
        updateGame();
    }

    document.addEventListener('keydown', moveCar);
    restartButton.addEventListener('click', restartGame);
    setInterval(createObstacle, 200);
    updateGame();
});
document.getElementById('settingsIcon').onclick = function() {
    location.href = 'Index.html';
};