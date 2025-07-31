// --- Canvas Animation Script ---
const canvas = document.getElementById('bioluminescence-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const mouse = { x: width / 2, y: height / 2, radius: 120 };
const blobs = [];
const numBlobs = 8; // Increase for more blobs
const colors = ['#00F5D4', '#00A896', '#02C39A', '#2E86AB', '#05668D', '#00aaff', '#a0e8e0'];

class Blob {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 80 + 120;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.radius) {
            const force = (mouse.radius + this.radius - distance) / (mouse.radius + this.radius);
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
        }
    }
    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, `${this.color}00`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    // Clear the array before re-populating
    blobs.length = 0;
    for (let i = 0; i < numBlobs; i++) {
        blobs.push(new Blob());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(1, 8, 17, 0.1)';
    ctx.fillRect(0, 0, width, height);
    blobs.forEach(blob => { 
        blob.update(); 
        blob.draw(); 
    });
    requestAnimationFrame(animate);
}

// Initial setup
init();
animate();

// --- Event Listeners ---
window.addEventListener('mousemove', (e) => { 
    mouse.x = e.clientX; 
    mouse.y = e.clientY; 
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Re-initialize blobs for the new screen size
    init();
});

// --- Countdown Timer Script ---
// Set the date for the countdown
const countdownDate = new Date("Sep 26, 2025 09:00:00").getTime();

const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the respective elements
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    // If the countdown is over, write some text 
    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "<div class='col-span-4 text-2xl font-bold'>The Event is Live!</div>";
    }
}, 1000);
