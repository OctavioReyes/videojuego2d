const TARGET_OBJECT_COUNT = 25;

// URL DE TU IMAGEN DE FONDO (Cambia esta ruta por tu imagen local o URL)
const BACKGROUND_IMAGE_URL = "assets/wp.jpg"; 

const IMAGE_URLS = [
    "assets/bat.png",
    "assets/witch.png",
    "assets/jack.png",
    "assets/pumpkin.png",
    "assets/ghost.png"
];

const AUDIO_URL = "assets/audio.mp3";

const FALLBACK_SVGS = [
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23ff6b00'/><circle cx='35' cy='40' r='8' fill='%23000'/><circle cx='65' cy='40' r='8' fill='%23000'/><polygon points='50,55 40,75 60,75' fill='%23000'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%239b51e0'/><circle cx='35' cy='40' r='6' fill='%23fff'/><circle cx='65' cy='40' r='6' fill='%23fff'/><ellipse cx='50' cy='68' rx='12' ry='8' fill='%23fff'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%232ed573'/><circle cx='35' cy='42' r='7' fill='%23000'/><circle cx='65' cy='42' r='7' fill='%23000'/><path d='M30,68 Q50,85 70,68' stroke='%23000' stroke-width='6' fill='none'/></svg>"
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(context) {
        context.save();
        context.globalAlpha = Math.max(this.alpha, 0);
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, 3, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}

class Circle {
    constructor(x, y, radius, imageUrl, color = "#ff6b00") {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.mass = this.radius * this.radius;

        this.image = new Image();
        this.image.src = imageUrl;

        this.image.onerror = () => {
            this.image.src = FALLBACK_SVGS[Math.floor(Math.random() * FALLBACK_SVGS.length)];
        };

        this.changeTimer = 0;
        this.setRandomMovement();
    }

    setRandomMovement() {
        this.type = Math.floor(Math.random() * 4);
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() * 0.04 + 0.02) * (Math.random() < 0.5 ? 1 : -1);
        this.orbitRadius = Math.random() * 3 + 2;
        
        let speed = Math.random() * 2.5 + 1.5;

        switch (this.type) {
            case 0:
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = -speed;
                break;
            case 1:
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = speed;
                break;
            case 2:
                let dirX = Math.random() < 0.5 ? 1 : -1;
                let dirY = Math.random() < 0.5 ? 1 : -1;
                this.vx = dirX * speed;
                this.vy = dirY * speed;
                break;
            case 3:
                this.vx = Math.cos(this.angle) * speed;
                this.vy = Math.sin(this.angle) * speed;
                break;
        }
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.clip();

        if (this.image.complete && this.image.naturalWidth !== 0) {
            context.drawImage(
                this.image, 
                this.x - this.radius, 
                this.y - this.radius, 
                this.radius * 2, 
                this.radius * 2
            );
        } else {
            context.fillStyle = this.color;
            context.fill();
        }

        context.restore();
    }

    update(width, height) {
        this.changeTimer++;
        if (this.changeTimer > Math.random() * 120 + 120) {
            this.changeTimer = 0;
            this.setRandomMovement();
        }

        if (this.type === 3) {
            this.angle += this.angularSpeed;
            this.x += this.vx + Math.cos(this.angle) * this.orbitRadius;
            this.y += this.vy + Math.sin(this.angle) * this.orbitRadius;
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }

        if (this.x + this.radius > width) {
            this.x = width - this.radius;
            this.vx = -Math.abs(this.vx);
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = Math.abs(this.vx);
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy);
        } else if (this.y + this.radius > height) {
            this.y = height - this.radius;
            this.vy = -Math.abs(this.vy);
        }
    }
}

class Simulation {
    constructor() {
        this.canvas = document.getElementById("simulationCanvas");
        this.ctx = this.canvas.getContext("2d");
        
        // Elementos UI de estadísticas
        this.statCount = document.getElementById("stat-count");
        this.statCollisions = document.getElementById("stat-collisions");
        this.statClicks = document.getElementById("stat-clicks");
        this.statDestroyed = document.getElementById("stat-destroyed");
        this.statFps = document.getElementById("stat-fps");
        this.btnAudio = document.getElementById("btn-audio");

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Carga de la imagen de fondo del Canvas
        this.bgImage = new Image();
        this.bgImage.src = BACKGROUND_IMAGE_URL;
        this.bgImageLoaded = false;
        this.bgImage.onload = () => {
            this.bgImageLoaded = true;
        };

        this.circles = [];
        this.particles = [];
        this.activeCollisionsCount = 0;
        
        // Contadores de interactividad
        this.totalClicks = 0;
        this.destroyedObjects = 0;
        
        this.lastTime = performance.now();
        this.fps = 0;
        
        this.initAudio();
        this.initListeners();
        this.generateEnvironment();
        this.animate();
    }

    initAudio() {
        this.bgMusic = new Audio(AUDIO_URL);
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;
        this.isPlayingAudio = false;

        this.btnAudio.addEventListener("click", () => {
            this.toggleMusic();
        });
    }

    toggleMusic() {
        if (this.isPlayingAudio) {
            this.bgMusic.pause();
            this.isPlayingAudio = false;
            this.btnAudio.innerText = "🎵 Música: OFF";
            this.btnAudio.classList.remove("active");
        } else {
            this.bgMusic.play().then(() => {
                this.isPlayingAudio = true;
                this.btnAudio.innerText = "🔊 Música: ON";
                this.btnAudio.classList.add("active");
            }).catch(err => console.log(err));
        }
    }

    initListeners() {
        this.canvas.addEventListener('click', (e) => {
            this.totalClicks++;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            for (let i = this.circles.length - 1; i >= 0; i--) {
                let circle = this.circles[i];
                let dx = clickX - circle.x;
                let dy = clickY - circle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= circle.radius) {
                    this.destroyedObjects++;
                    this.triggerBallExplosion(circle);
                    this.circles.splice(i, 1);
                    break;
                }
            }
        });
    }

    triggerBallExplosion(circle) {
        for (let i = 0; i < 30; i++) {
            let p = new Particle(circle.x, circle.y, circle.color);
            p.vx *= 2.2;
            p.vy *= 2.2;
            this.particles.push(p);
        }
    }

    generateEnvironment() {
        while (this.circles.length < TARGET_OBJECT_COUNT) {
            this.spawnRandomCircle();
        }
    }

    spawnRandomCircle() {
        let radius = Math.random() * 20 + 20;
        let x = Math.random() * (this.width - radius * 2) + radius;
        let y = Math.random() * (this.height - radius * 2) + radius;
        
        let randomImage = IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)];
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        
        this.circles.push(new Circle(x, y, radius, randomImage, color));
    }

    handleElasticCollisions() {
        this.activeCollisionsCount = 0;

        for (let i = 0; i < this.circles.length; i++) {
            for (let j = i + 1; j < this.circles.length; j++) {
                let c1 = this.circles[i];
                let c2 = this.circles[j];

                let dx = c2.x - c1.x;
                let dy = c2.y - c1.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let minDist = c1.radius + c2.radius;

                if (distance < minDist) {
                    this.activeCollisionsCount++;

                    let contactX = (c1.x * c2.radius + c2.x * c1.radius) / minDist;
                    let contactY = (c1.y * c2.radius + c2.y * c1.radius) / minDist;

                    for (let p = 0; p < 3; p++) {
                        this.particles.push(new Particle(contactX, contactY, c1.color));
                    }

                    let overlap = minDist - distance;
                    let nx = dx / (distance || 1);
                    let ny = dy / (distance || 1);

                    let totalMass = c1.mass + c2.mass;
                    c1.x -= nx * overlap * (c2.mass / totalMass);
                    c1.y -= ny * overlap * (c2.mass / totalMass);
                    c2.x += nx * overlap * (c1.mass / totalMass);
                    c2.y += ny * overlap * (c1.mass / totalMass);

                    let kx = c1.vx - c2.vx;
                    let ky = c1.vy - c2.vy;
                    let vn = kx * nx + ky * ny;

                    if (vn > 0) {
                        let impulse = (2 * vn) / totalMass;
                        c1.vx -= impulse * c2.mass * nx;
                        c1.vy -= impulse * c2.mass * ny;
                        c2.vx += impulse * c1.mass * nx;
                        c2.vy += impulse * c1.mass * ny;
                    }
                }
            }
        }
    }

    updateStats() {
        this.statCount.innerText = this.circles.length;
        this.statCollisions.innerText = this.activeCollisionsCount;
        this.statClicks.innerText = this.totalClicks;
        this.statDestroyed.innerText = this.destroyedObjects;
        this.statFps.innerText = Math.round(this.fps);
    }

    animate(currentTime = 0.0) {
        let deltaTime = currentTime - this.lastTime;
        if (deltaTime > 0) this.fps = 1000 / deltaTime;
        this.lastTime = currentTime;

        // Limpieza previa del canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Dibujar imagen de fondo si está cargada
        if (this.bgImageLoaded) {
            this.ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
        }

        while (this.circles.length < TARGET_OBJECT_COUNT) {
            this.spawnRandomCircle();
        }

        this.handleElasticCollisions();

        for (let i = 0; i < this.circles.length; i++) {
            let circle = this.circles[i];
            circle.update(this.width, this.height);
            circle.draw(this.ctx);
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            p.draw(this.ctx);
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        this.updateStats();

        requestAnimationFrame((time) => this.animate(time));
    }
}

window.addEventListener('load', () => {
    new Simulation();
});