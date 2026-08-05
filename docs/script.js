/* ============================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ============================================ */

const phrases = [
    "Eres mi sol.",
    "Mi vida brilla contigo.",
    "Mi lugar favorito es a tu lado.",
    "Eres mi paz y mi locura.",
    "Juntos somos magia.",
    "Te elijo cada día.",
    "Nuestro amor es mi refugio.",
    "Cada día contigo es un regalo.",
    "A tu lado, soy más fuerte.",
    "Para siempre y un día más.",
    "El mundo es perfecto contigo.",
    "A tu lado, todo florece."
];

let phraseIndex = 0;
let petalCount = 0;
let totalPetals = 12; // Número de pétalos frontales

/* ============================================
   CANVAS Y PARTÍCULAS
   ============================================ */

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

/* ============================================
   CREACIÓN DE PÉTALOS
   ============================================ */

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

    // Contar pétalos frontales
    petalCount = document.querySelectorAll('.petal-front').length;
}

/* ============================================
   DESPRENDIMIENTO DE PÉTALOS
   ============================================ */

function detachPetal(event) {
    const petal = event.currentTarget;
    if (petal.classList.contains('falling')) return;

    // Reproducir sonido de pétalo (opcional)
    playPetalSound();

    const computedStyle = window.getComputedStyle(petal);
    petal.style.setProperty('--original-rotate', computedStyle.transform);
    petal.classList.add('falling');

    // Crear frase flotante
    const phrase = document.createElement('div');
    phrase.classList.add('floating-phrase');
    phrase.textContent = phrases[phraseIndex % phrases.length];
    phraseIndex++;
    phrase.style.left = `${event.clientX}px`;
    phrase.style.top = `${event.clientY}px`;
    document.body.appendChild(phrase);

    // Crear partículas doradas
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
    }

    petal.addEventListener('animationend', () => {
        petal.remove();
        checkFinalMessage();
    }, { once: true });

    phrase.addEventListener('animationend', () => phrase.remove(), { once: true });
}

/* ============================================
   VERIFICAR MENSAJE FINAL
   ============================================ */

function checkFinalMessage() {
    const remainingPetals = document.querySelectorAll('.petal-front:not(.falling)');
    if (remainingPetals.length === 0) {
        showFinalMessage();
    }
}

function showFinalMessage() {
    const finalMessage = document.getElementById('final-message');
    const resetBtn = document.getElementById('reset-button');
    
    if (finalMessage) {
        finalMessage.style.display = 'block';
    }
    
    if (resetBtn) {
        resetBtn.style.display = 'block';
    }
}

/* ============================================
   RENACER DEL GIRASOL
   ============================================ */

function resetSunflower() {
    // Ocultar mensajes
    const finalMessage = document.getElementById('final-message');
    const resetBtn = document.getElementById('reset-button');
    
    if (finalMessage) finalMessage.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';

    // Remover todos los pétalos que cayeron
    document.querySelectorAll('.petal').forEach(petal => petal.remove());

    // Reiniciar contador
    phraseIndex = 0;

    // Recrear pétalos
    createPetals();

    // Reproducir sonido de renacer (opcional)
    playRebirthSound();
}

// Event listener para el botón de renacer
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-button');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSunflower);
    }
});

/* ============================================
   ESTRELLAS FUGACES
   ============================================ */

function createShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    star.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(star);

    star.addEventListener('animationend', () => star.remove(), { once: true });
}

// Crear estrellas fugaces cada cierto tiempo
setInterval(() => {
    if (Math.random() > 0.7) { // 30% de probabilidad
        createShootingStar();
    }
}, 4000);

/* ============================================
   EFECTOS DE SONIDO (Opcional)
   ============================================ */

function playPetalSound() {
    // Crear un sonido simple usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silenciosamente ignorar si Web Audio API no está disponible
    }
}

function playRebirthSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99]; // DO, MI, SOL

        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 100);
        });
    } catch (e) {
        // Silenciosamente ignorar si Web Audio API no está disponible
    }
}

/* ============================================
   INICIALIZACIÓN
   ============================================ */

window.addEventListener('load', () => {
    createPetals();

    // Crear partículas continuamente
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            particlesArray.push(new Particle());
        }
    }, 300);

    // Iniciar animación del canvas
    animate();
});

/* ============================================
   REDIMENSIONAMIENTO DEL CANVAS
   ============================================ */

window.addEventListener('resize', () => {
    const centerDiv = document.querySelector('.center');
    canvas.width = centerDiv.clientWidth;
    canvas.height = centerDiv.clientHeight;
});

/* ============================================
   ACCESIBILIDAD - SOPORTE PARA TECLADO
   ============================================ */

document.addEventListener('keydown', (e) => {
    // Presionar 'R' para renacer el girasol
    if (e.key === 'r' || e.key === 'R') {
        const resetBtn = document.getElementById('reset-button');
        if (resetBtn && resetBtn.style.display !== 'none') {
            resetSunflower();
        }
    }
});
