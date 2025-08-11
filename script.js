document.addEventListener('DOMContentLoaded', () => {
    // --- Home Page Countdown Timer ---
    const homeCountdownDate = new Date("Sep 25, 2025 09:00:00").getTime();
    function updateHomeCountdown() {
        const now = new Date().getTime();
        const distance = homeCountdownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("home-days");
        const hoursEl = document.getElementById("home-hours");
        const minutesEl = document.getElementById("home-minutes");
        const secondsEl = document.getElementById("home-seconds");

        if(daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
        if(hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
        if(minutesEl) minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        if(secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            if(daysEl) daysEl.innerText = "00";
            if(hoursEl) hoursEl.innerText = "00";
            if(minutesEl) minutesEl.innerText = "00";
            if(secondsEl) secondsEl.innerText = "00";
        }
    }
    updateHomeCountdown();
    setInterval(updateHomeCountdown, 1000);

    // --- 3D Background Animation ---
    let scene, camera, renderer, particles;
    const mouse3D = new THREE.Vector2();
    let mainAnimationId;

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
        mainAnimationId = requestAnimationFrame(animate3D);
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
    const contentWrapperForScroll = document.querySelector('.content-wrapper');
    contentWrapperForScroll.addEventListener('scroll', () => {
        if (contentWrapperForScroll.scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- Parallax Tilt & Flip Effect for Cards ---
    const flipContainers = document.querySelectorAll('.flip-container');

    flipContainers.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            if (container.classList.contains('is-flipping') || container.classList.contains('is-flipped')) return;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -20;
            const rotateY = (x / width - 0.5) * 20;

            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        container.addEventListener('mouseleave', () => {
            if (container.classList.contains('is-flipping') || container.classList.contains('is-flipped')) return;
            container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });


    // --- Card Countdown Timer ---
    const countdownDate = new Date("Sep 20, 2025 00:00:00").getTime();
    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("card-days");
        const hoursEl = document.getElementById("card-hours");
        const minutesEl = document.getElementById("card-minutes");
        const secondsEl = document.getElementById("card-seconds");

        if(daysEl) daysEl.innerText = days;
        if(hoursEl) hoursEl.innerText = hours;
        if(minutesEl) minutesEl.innerText = minutes;
        if(secondsEl) secondsEl.innerText = seconds;

        if (distance < 0) {
            clearInterval(countdownFunction);
            const countdownEl = document.getElementById("card-countdown");
            if(countdownEl) countdownEl.innerHTML = "<div class='col-span-4 text-lg font-bold'>The Event is Live!</div>";
        }
    }, 1000);

    // --- Overlay & Modal Logic ---
    const contentWrapper = document.querySelector('.content-wrapper');
    const body = document.body;
    let activeFlipContainer = null;
    
    let timelineAnimationId, themesAnimationId, registrationAnimationId, aboutAnimationId;
    let savedScrollPosition = 0;

    function openOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        
        savedScrollPosition = contentWrapper.scrollTop;
        body.classList.add('modal-open');
        overlay.classList.add('is-visible');
        contentWrapper.classList.add('is-blurred');
        
        if (overlayId === 'full-Details-overlay') initTimelineAnimation();
        if (overlayId === 'full-themes-overlay') initThemesAnimation();
        if (overlayId === 'full-registration-overlay') initRegistrationAnimation();
    }

    function closeOverlay() {
        const visibleOverlay = document.querySelector('.opacity-0.is-visible');
        if (visibleOverlay) {
            body.classList.remove('modal-open');
            visibleOverlay.classList.remove('is-visible');
            contentWrapper.classList.remove('is-blurred');
            contentWrapper.scrollTop = savedScrollPosition;

            if (activeFlipContainer) {
                activeFlipContainer.classList.remove('is-flipped');
                activeFlipContainer.classList.remove('is-flipping');
                activeFlipContainer.style.transform = '';
                activeFlipContainer = null;
            }

            const overlayId = visibleOverlay.id;
            if (overlayId === 'full-Details-overlay') cancelAnimationFrame(timelineAnimationId);
            if (overlayId === 'full-themes-overlay') cancelAnimationFrame(themesAnimationId);
            if (overlayId === 'full-registration-overlay') cancelAnimationFrame(registrationAnimationId);
        }
    }
    
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const overlayId = this.dataset.overlayId;
            const currentFlipContainer = this.closest('.flip-container');
            activeFlipContainer = currentFlipContainer;

            if (currentFlipContainer && !currentFlipContainer.classList.contains('is-flipping')) {
                currentFlipContainer.classList.add('is-flipping');
                currentFlipContainer.classList.add('is-flipped');
                
                setTimeout(() => {
                    openOverlay(overlayId);
                }, 450); // Slightly less than the CSS transition to feel responsive

                const onTransitionEnd = () => {
                   if(currentFlipContainer) {
                        currentFlipContainer.classList.remove('is-flipping');
                   }
                   currentFlipContainer.removeEventListener('transitionend', onTransitionEnd);
                };
                currentFlipContainer.addEventListener('transitionend', onTransitionEnd);
            }
        });
    });

    // Specific listeners for the main overlay close buttons
    document.getElementById('full-Details-close').addEventListener('click', closeOverlay);
    document.getElementById('full-themes-close').addEventListener('click', closeOverlay);
    document.getElementById('full-registration-close').addEventListener('click', closeOverlay);


    // --- Timeline Page Background Animation (Synapse Effect) ---
    function initTimelineAnimation() {
        const synapseCanvas = document.getElementById('synapse-canvas');
        if (!synapseCanvas) return;
        const synapseCtx = synapseCanvas.getContext('2d');
        let synapseParticles = [];
        const synapseMouse = { x: null, y: null, radius: 150 };

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
                    let distance = ((synapseParticles[a].x - synapseParticles[b].x) ** 2)
                        + ((synapseParticles[a].y - synapseParticles[b].y) ** 2);
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
            synapseCtx.clearRect(0, 0, synapseCanvas.width, synapseCanvas.height);
            for (let i = 0; i < synapseParticles.length; i++) {
                synapseParticles[i].update();
                synapseParticles[i].draw();
            }
            connectSynapses();
            timelineAnimationId = requestAnimationFrame(animateSynapse);
        }

        const overlay = document.getElementById('full-Details-overlay');
        const onMouseMove = (e) => {
            synapseMouse.x = e.clientX;
            synapseMouse.y = e.clientY;
        };
        const onMouseOut = () => {
            synapseMouse.x = null;
            synapseMouse.y = null;
        };

        overlay.addEventListener('mousemove', onMouseMove);
        overlay.addEventListener('mouseout', onMouseOut);
        
        let synapseResizeHandler = resizeSynapseCanvas;
        window.addEventListener('resize', synapseResizeHandler);

        resizeSynapseCanvas();
        animateSynapse();
        
        document.getElementById('full-Details-close').addEventListener('click', () => {
            overlay.removeEventListener('mousemove', onMouseMove);
            overlay.removeEventListener('mouseout', onMouseOut);
        }, { once: true });
    }

    // --- About Section DNA Animation ---
    function initAboutAnimation() {
        const canvas = document.getElementById('about-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const group = new THREE.Group();
        scene.add(group);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00f5d4, 1, 100);
        pointLight.position.set(10, 10, 20);
        scene.add(pointLight);

        const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00f5d4, metalness: 0.5, roughness: 0.5 });
        const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.5, roughness: 0.5 });
        const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.5, roughness: 0.5 });
        const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);

        const numPairs = 15;
        const pairDistance = 2;
        const radius = 5;

        for (let i = 0; i < numPairs; i++) {
            const y = (i - numPairs / 2) * pairDistance;
            const angle = i * 0.5;

            const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
            sphere1.position.set(radius * Math.cos(angle), y, radius * Math.sin(angle));
            group.add(sphere1);

            const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
            sphere2.position.set(radius * Math.cos(angle + Math.PI), y, radius * Math.sin(angle + Math.PI));
            group.add(sphere2);

            const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, radius * 2, 8), cylinderMaterial);
            cylinder.position.y = y;
            cylinder.lookAt(sphere1.position);
            group.add(cylinder);
        }
        
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        canvas.addEventListener('mousedown', (e) => { isDragging = true; });
        canvas.addEventListener('mouseup', (e) => { isDragging = false; });
        canvas.addEventListener('mouseleave', (e) => { isDragging = false; });
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                group.rotation.y += deltaMove.x * 0.01;
                group.rotation.x += deltaMove.y * 0.01;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        function animate() {
            aboutAnimationId = requestAnimationFrame(animate);
            const time = Date.now() * 0.002;

            if (!isDragging) {
                group.rotation.y += 0.005;
                group.rotation.x += Math.sin(time * 0.5) * 0.001;
            }
            
            group.children.forEach(child => {
                if (child.geometry.type === 'SphereGeometry') {
                    const scale = 1 + Math.sin(time + child.position.y * 0.5) * 0.1;
                    child.scale.set(scale, scale, scale);
                }
            });

            renderer.render(scene, camera);
        }
        animate();
    }
    
    const aboutSection = document.getElementById('about');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initAboutAnimation();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }


    // --- Themes Page Globe Animation ---
    function initThemesAnimation() {
        const canvas = document.getElementById('themes-canvas');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 25;

        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const color = new THREE.Color();
        const radius = 15;

        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            const randomColor = Math.random() > 0.3 ? 0x00f5d4 : 0x00aaff;
            color.setHex(randomColor);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        function animate() {
            themesAnimationId = requestAnimationFrame(animate);
            points.rotation.y += 0.001; 
            points.rotation.x += 0.0005; 
            renderer.render(scene, camera);
        }
        animate();
    }
    
    // --- Registration Page Minimal Animation ---
    function initRegistrationAnimation() {
        const canvas = document.getElementById('registration-canvas');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 100;

        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ size: 0.3, color: 0x00f5d4, transparent: true, opacity: 0.5 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        function animate() {
            registrationAnimationId = requestAnimationFrame(animate);
            points.rotation.x += 0.0001;
            points.rotation.y += 0.0002;
            renderer.render(scene, camera);
        }
        animate();
    }


    // --- Event Details Modal Logic ---
    const modal = document.getElementById('event-details-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('modal-close');
    
    const eventCards = document.querySelectorAll('.Details-card');

    function openModal(title, description) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modal.classList.add('is-visible');
    }

    function closeModal() {
        const modal = document.getElementById('event-details-modal');
        modal.classList.remove('is-visible');
    }

    eventCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;

            const title = card.querySelector('h3, h4').textContent;
            const descriptionEl = card.querySelector('p');
            
            if (descriptionEl) {
                const description = descriptionEl.textContent;
                if(description && description.trim() !== '') {
                     openModal(title, description);
                }
            }
        });
    });

    if(closeModalBtn){
        closeModalBtn.addEventListener('click', closeModal);
    }
    if(modal){
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // --- Hackfest Carousel Logic ---
    const slider = document.querySelector('.hackfest-slider');
    const prevButton = document.querySelector('.arrow-left');
    const nextButton = document.querySelector('.arrow-right');
    const navButtons = document.querySelectorAll('.hackfest-nav-btn');
    const slides = document.querySelectorAll('.hackfest-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
        document.querySelectorAll('.flip-container.is-flipped').forEach(fc => {
            fc.classList.remove('is-flipped');
        });
        currentIndex = index;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        navButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === currentIndex);
        });
    }

    nextButton.addEventListener('click', () => {
        goToSlide((currentIndex + 1) % totalSlides);
    });

    prevButton.addEventListener('click', () => {
        goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
    });
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToSlide(parseInt(button.dataset.index));
        });
    });
    
    // --- Nav Dropdown Logic ---
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetButtonId = e.target.dataset.targetButton;
            const targetButton = document.getElementById(targetButtonId);
            
            if (targetButtonId === 'register-now-btn') {
                 document.getElementById('hackfest').scrollIntoView({ behavior: 'smooth' });
                 goToSlide(3);
            } else if (targetButton) {
                targetButton.click();
            }
        });
    });
    
    // --- Keyboard navigation ---
    document.addEventListener('keydown', (e) => {
        const isOverlayVisible = document.querySelector('#full-Details-overlay.is-visible, #full-themes-overlay.is-visible, #full-registration-overlay.is-visible');
        const isModalVisible = document.getElementById('event-details-modal').classList.contains('is-visible');

        if (isOverlayVisible || isModalVisible) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
            switch (e.key) {
                case 'Escape':
                     e.preventDefault();
                    if (isModalVisible) closeModal();
                    else if (isOverlayVisible) closeOverlay();
                    break;
                case 'ArrowDown':
                    if (isOverlayVisible) isOverlayVisible.querySelector('.overlay-scroller').scrollBy({ top: 60, behavior: 'smooth' });
                    break;
                case 'ArrowUp':
                     if (isOverlayVisible) isOverlayVisible.querySelector('.overlay-scroller').scrollBy({ top: -60, behavior: 'smooth' });
                    break;
            }
            return;
        }

        const hackfestSection = document.getElementById('hackfest');
        const rect = hackfestSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    nextButton.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevButton.click();
                    break;
            }
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                contentWrapper.scrollBy({ top: 100, behavior: 'smooth' });
                break;
            case 'ArrowUp':
                e.preventDefault();
                contentWrapper.scrollBy({ top: -100, behavior: 'smooth' });
                break;
        }
    });
});
