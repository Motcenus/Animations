let balls = [];
let simulationRunning = false;
let simulationPaused = false;

function createBalls(numBalls, radius) {
    // Clear existing balls
    balls.forEach(ball => ball.element.remove());
    balls = [];

    for (let i = 0; i < numBalls; i++) {
        const id = `circle${i}`; // Unique ID for each ball
        const initialX = Math.random() * (window.innerWidth - radius * 2);
        const initialY = Math.random() * (window.innerHeight - radius * 2);
        const ballElement = document.createElement('div');
        ballElement.id = id;
        ballElement.className = 'circle';
        ballElement.style.width = `${radius * 2}px`;
        ballElement.style.height = `${radius * 2}px`;
        document.body.appendChild(ballElement);
        
        balls.push(new Circle(id, initialX, initialY, radius));
    }
}

function update() {
    if (!simulationRunning || simulationPaused) return;

    balls.forEach(ball => {
        ball.applyGravity(); // Update each ball's position with gravity

        // Check collisions with other balls
        balls.forEach(otherBall => {
            if (ball !== otherBall && ball.isColliding(otherBall)) {
                ball.resolveCollision(otherBall);
            }
        });

        // Check collision with the sensor
        if (ball.isColliding(sensor)) {
            ball.updateColor('green');
        } else {
            ball.updateColor(ball.color); // Restore original color
        }
    });

    requestAnimationFrame(update);
}

document.getElementById('startSimulation').addEventListener('click', () => {
    if (!simulationRunning) {
        simulationRunning = true;
        simulationPaused = false;
        update();
    }
});

document.getElementById('pauseSimulation').addEventListener('click', () => {
    simulationPaused = true;
});

document.getElementById('endSimulation').addEventListener('click', () => {
    simulationRunning = false;
    simulationPaused = false;
});

document.getElementById('reset').addEventListener('click', () => {
    const numBalls = parseInt(document.getElementById('numBalls').value) || 5;
    const radius = parseInt(document.getElementById('ballRadius').value) || 25;
    createBalls(numBalls, radius);
    if (simulationRunning) {
        simulationRunning = false;
        simulationPaused = false;
    }
});

window.onload = function() {
    const numBalls = parseInt(document.getElementById('numBalls').value) || 5;
    const radius = parseInt(document.getElementById('ballRadius').value) || 25;
    createBalls(numBalls, radius);

    window.sensor = {
        getPosition: () => {
            const element = document.getElementById('sensor');
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                radius: rect.width / 2
            };
        }
    };
};
