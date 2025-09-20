
const phrases = [
    "Eres mi sol.",
    "Contigo todo es mejor.",
    "Mi lugar favorito es a tu lado.",
    "Gracias por ser mi aventura.",
    "Juntos somos magia.",
    "Te elijo cada día.",
    "Nuestro amor es mi refugio.",
    "Eres mi sueño hecho realidad.",
    "A tu lado, soy más fuerte.",
    "Para siempre y un día más.",
    "Creas un mundo nuevo para mí.",
    "Eres mi canción favorita."
];

let phraseIndex = 0;

function detachPetal(event) {
    const petal = event.currentTarget;
    if (petal.classList.contains('falling')) return;

    const computedStyle = window.getComputedStyle(petal);
    petal.style.setProperty('--original-rotate', computedStyle.transform);
    petal.classList.add('falling');

    const phrase = document.createElement('div');
    phrase.classList.add('floating-phrase');
    phrase.textContent = phrases[phraseIndex % phrases.length];
    phraseIndex++;
    phrase.style.left = `${event.clientX}px`;
    phrase.style.top = `${event.clientY}px`;
    document.body.appendChild(phrase);

    petal.addEventListener('animationend', () => petal.remove());
    phrase.addEventListener('animationend', () => phrase.remove());
}

function createPetals() {
    const head = document.querySelector('.head');
    const layers = [
        { count: 16, className: 'petal-back', offset: 0 },
        { count: 16, className: 'petal-middle', offset: 11.25 },
        { count: 12, className: 'petal-front', offset: 15 }
    ];
    layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal', layer.className);
            const angle = (360 / layer.count) * i + layer.offset;
            petal.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
            if (layer.className === 'petal-front') {
                petal.classList.add('clickable');
                petal.addEventListener('click', detachPetal);
            }
            head.appendChild(petal);
        }
    });
}

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

const centerDiv = document.querySelector('.center');
canvas.width = centerDiv.clientWidth;
canvas.height = centerDiv.clientHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 3 + 1;
        this.life = 100;
        this.maxLife = 100;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
    }

    draw() {
        ctx.beginPath();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = '#ffd700';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    particlesArray = particlesArray.filter(p => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

window.onload = () => {
    createPetals();

    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            particlesArray.push(new Particle());
        }
    }, 300);

    animate();

    const nightModeToggle = document.getElementById('night-mode-toggle');
    nightModeToggle.addEventListener('click', () => {

        document.body.classList.toggle('night-mode');

        if (document.body.classList.contains('night-mode')) {
            nightModeToggle.textContent = 'Modo Día ☀️';
        } else {
            nightModeToggle.textContent = 'Modo Noche 🌙';
        }
    });
};
                            
