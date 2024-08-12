class Circle {
    constructor(id, initialX, initialY, radius, leaveScreen = false) {
        this.element = document.getElementById(id);
        this.radius = radius;
        this.x = initialX;
        this.y = initialY;
        this.vx = (Math.random() - 0.5) * 2; // Random initial velocity
        this.vy = (Math.random() - 0.5) * 2;
        this.gravity = 0.5; // Gravity acceleration
        this.friction = 0.98; // Friction to simulate bouncing effect
        this.color = this.randomColor(); // Set random color
        this.leaveScreen = leaveScreen; // Flag to control if the ball can leave the screen
        this.setPosition(this.x, this.y);
        this.updateColor(this.color);
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    getPosition() {
        const rect = this.element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            radius: this.radius
        };
    }

    updateColor(color) {
        this.element.style.backgroundColor = color;
    }

    randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    isColliding(other) {
        const posA = this.getPosition();
        const posB = other.getPosition();

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (posA.radius + posB.radius);
    }

    resolveCollision(other) {
        const posA = this.getPosition();
        const posB = other.getPosition();
        
        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const overlap = (posA.radius + posB.radius) - distance;
        const angle = Math.atan2(dy, dx);

        const halfOverlap = overlap / 2;
        this.x += halfOverlap * Math.cos(angle);
        this.y += halfOverlap * Math.sin(angle);
        other.x -= halfOverlap * Math.cos(angle);
        other.y -= halfOverlap * Math.sin(angle);

        // Reflect velocities based on normal
        const normalX = dx / distance;
        const normalY = dy / distance;
        const relativeVelocityX = this.vx - other.vx;
        const relativeVelocityY = this.vy - other.vy;

        const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

        this.vx -= velocityAlongNormal * normalX;
        this.vy -= velocityAlongNormal * normalY;
        other.vx += velocityAlongNormal * normalX;
        other.vy += velocityAlongNormal * normalY;

        // Trigger collision effect
        this.triggerCollisionEffect();
        other.triggerCollisionEffect();
    }

    triggerCollisionEffect() {
        this.element.classList.add('collision');
        setTimeout(() => {
            this.element.classList.remove('collision');
        }, 300); // Duration of the collision effect
    }

    applyGravity() {
        this.vy += this.gravity; // Apply gravity to velocity
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.leaveScreen) {
            // Allow the ball to leave the screen boundaries
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // Bounce off the screen edges
            if (this.x < 0 || this.x + this.radius * 2 > screenWidth) {
                this.vx *= -this.friction;
            }
            if (this.y < 0 || this.y + this.radius * 2 > screenHeight) {
                this.vy *= -this.friction;
            }
        } else {
            // Restrict ball within screen boundaries
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (this.x < 0) {
                this.x = 0;
                this.vx *= -this.friction;
            } else if (this.x + this.radius * 2 > screenWidth) {
                this.x = screenWidth - this.radius * 2;
                this.vx *= -this.friction;
            }

            if (this.y < 0) {
                this.y = 0;
                this.vy *= -this.friction;
            } else if (this.y + this.radius * 2 > screenHeight) {
                this.y = screenHeight - this.radius * 2;
                this.vy *= -this.friction;
            }
        }

        this.setPosition(this.x, this.y);
    }
}
