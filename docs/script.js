// Partículas brillantes + efecto cursor 🌟
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Clase Partícula
class Particle {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.02;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Manejar partículas con el mouse
function createParticles(e) {
  const xPos = e.x;
  const yPos = e.y;
  for (let i = 0; i < 5; i++) {
    particles.push(
      new Particle(
        xPos,
        yPos,
        Math.random() * 5 + 2,
        "rgba(255,215,0,0.8)", // dorado 🌻
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
    );
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.size <= 0.3) {
      particles.splice(index, 1);
    }
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();
window.addEventListener("mousemove", createParticles);
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
