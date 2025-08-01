document.addEventListener('DOMContentLoaded', () => {

    // --- 3D Background Animation ---
    let scene, camera, renderer, particles;
    const mouse3D = new THREE.Vector2();

    function init3D() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const color = new THREE.Color();
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            const randomColor = Math.random() > 0.5 ? '#00f5d4' : '#00aaff';
            color.set(randomColor);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function animate3D() {
        requestAnimationFrame(animate3D);
        const time = Date.now() * 0.0001;
        particles.rotation.y = time * 0.5;
        camera.position.x += (mouse3D.x * 20 - camera.position.x) * 0.02;
        camera.position.y += (-mouse3D.y * 20 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    
    window.addEventListener('mousemove', (event) => {
        mouse3D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse3D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    init3D();
    animate3D();

    // --- Scroll-based Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
    
    // --- Header Scroll Effect ---
    const header = document.querySelector('.header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3D Tilt Effect for Cards ---
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -15;
            const rotateY = (x / width - 0.5) * 15;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.transition = 'transform 0.1s linear';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // --- Countdown Timer Script ---
    const countdownDate = new Date("Sep 15, 2025 09:00:00").getTime();
    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if(daysEl) daysEl.innerText = days;
        if(hoursEl) hoursEl.innerText = hours;
        if(minutesEl) minutesEl.innerText = minutes;
        if(secondsEl) secondsEl.innerText = seconds;

        if (distance < 0) {
            clearInterval(countdownFunction);
            const countdownEl = document.getElementById("countdown");
            if(countdownEl) countdownEl.innerHTML = "<div class='col-span-4 text-2xl font-bold'>The Event is Live!</div>";
        }
    }, 1000);
    
    // --- Full Details Overlay Logic ---
    const viewDetailsBtn = document.getElementById('view-Details-btn');
    const DetailsOverlay = document.getElementById('full-Details-overlay');
    const closeDetailsBtn = document.getElementById('full-Details-close');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    const synapseCanvas = document.getElementById('synapse-canvas');
    const synapseCtx = synapseCanvas.getContext('2d');
    let synapseParticles = [];
    const synapseMouse = { x: null, y: null, radius: 150 };
    let animationFrameId;

    function openDetails() {
        DetailsOverlay.classList.add('is-visible');
        contentWrapper.classList.add('is-blurred');
        document.body.classList.add('modal-open');
        resizeSynapseCanvas();
        animateSynapse();
    }
    
    function closeDetails() {
        DetailsOverlay.classList.remove('is-visible');
        contentWrapper.classList.remove('is-blurred');
        document.body.classList.remove('modal-open');
        cancelAnimationFrame(animationFrameId);
    }

    viewDetailsBtn.addEventListener('click', openDetails);
    closeDetailsBtn.addEventListener('click', closeDetails);

    // --- Synapse Animation for Overlay ---
    function resizeSynapseCanvas() {
        synapseCanvas.width = window.innerWidth;
        synapseCanvas.height = window.innerHeight;
        initSynapseParticles();
    }

    class SynapseParticle {
        constructor() {
            this.x = Math.random() * synapseCanvas.width;
            this.y = Math.random() * synapseCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = `hsl(${200 + Math.random() * 50}, 100%, 50%)`;
        }
        draw() {
            synapseCtx.fillStyle = this.color;
            synapseCtx.beginPath();
            synapseCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            synapseCtx.closePath();
            synapseCtx.fill();
        }
        update() {
            let dx = synapseMouse.x - this.x;
            let dy = synapseMouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < synapseMouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = synapseMouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = (forceDirectionX * force * this.density);
                let directionY = (forceDirectionY * force * this.density);
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
                if (this.y !== this.baseY) { this.y -= (this.y - this.baseY) / 10; }
            }
        }
    }
    
    function initSynapseParticles() {
        synapseParticles = [];
        let numberOfParticles = (synapseCanvas.height * synapseCanvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            synapseParticles.push(new SynapseParticle());
        }
    }

    function connectSynapses() {
        let opacityValue = 1;
        for (let a = 0; a < synapseParticles.length; a++) {
            for (let b = a; b < synapseParticles.length; b++) {
                let distance = ((synapseParticles[a].x - synapseParticles[b].x) * (synapseParticles[a].x - synapseParticles[b].x))
                    + ((synapseParticles[a].y - synapseParticles[b].y) * (synapseParticles[a].y - synapseParticles[b].y));
                if (distance < (synapseCanvas.width / 7) * (synapseCanvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    synapseCtx.strokeStyle = `rgba(0, 200, 255, ${opacityValue})`;
                    synapseCtx.lineWidth = 1;
                    synapseCtx.beginPath();
                    synapseCtx.moveTo(synapseParticles[a].x, synapseParticles[a].y);
                    synapseCtx.lineTo(synapseParticles[b].x, synapseParticles[b].y);
                    synapseCtx.stroke();
                }
            }
        }
    }

    function animateSynapse() {
        if (!DetailsOverlay.classList.contains('is-visible')) return;
        synapseCtx.clearRect(0, 0, synapseCanvas.width, synapseCanvas.height);
        for (let i = 0; i < synapseParticles.length; i++) {
            synapseParticles[i].update();
            synapseParticles[i].draw();
        }
        connectSynapses();
        animationFrameId = requestAnimationFrame(animateSynapse);
    }

    DetailsOverlay.addEventListener('mousemove', (e) => {
        synapseMouse.x = e.x;
        synapseMouse.y = e.y;
    });
    DetailsOverlay.addEventListener('mouseout', () => {
        synapseMouse.x = null;
        synapseMouse.y = null;
    });

    // --- Event Details Modal Logic ---
    const details = document.getElementById('event-Details-modal');
    const detailsContent = document.getElementById('modal-content');
    const detailsTitle = document.getElementById('modal-title');
    const detailsDescription = document.getElementById('modal-description');
    const detailsRulebook = document.getElementById('modal-rulebook');
    const closeDetailsBtn2 = document.getElementById('modal-close');

    const eventCards = document.querySelectorAll('.Details-card');

    function openDetailsModal(title, description, rulebookUrl) {
        detailsTitle.textContent = title;
        detailsDescription.textContent = description;
        detailsRulebook.href = rulebookUrl;
        details.classList.add('is-visible');
        details.style.opacity = "1";
        details.style.pointerEvents = "auto";
        detailsContent.style.transform = "scale(1)";
    }

    function closeDetailsModal() {
        details.classList.remove('is-visible');
        details.style.opacity = "0";
        details.style.pointerEvents = "none";
        detailsContent.style.transform = "scale(0.95)";
    }

    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3, h4').textContent;
            const description = card.querySelector('p').textContent;
            const rulebookUrl = card.querySelector('a').href;
            openDetailsModal(title, description, rulebookUrl);
        });
    });

    closeDetailsBtn2.addEventListener('click', closeDetailsModal);
    details.addEventListener('click', (e) => {
        if (e.target === details) {
            closeDetailsModal();
        }
    });
});
