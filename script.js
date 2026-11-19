document.addEventListener('DOMContentLoaded', () => {
    const dustContainer = document.getElementById('magicDust');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('magic-particle');
        const size = Math.random() * 4 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.opacity = Math.random() * 0.5 + 0.2;
        dustContainer.appendChild(p);
    }

    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000, radius: 200 };
    const numParticles = window.innerWidth < 768 ? 40 : 90;
    const connectionDist = 120;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.baseX += this.vx;
            this.baseY += this.vy;
            if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
            if (this.baseY < 0 || this.baseY > height) this.vy *= -1;
            const dx = mouse.x - this.baseX;
            const dy = mouse.y - this.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x = this.baseX + Math.cos(angle) * force * 30;
                this.y = this.baseY + Math.sin(angle) * force * 30;
            } else {
                this.x += (this.baseX - this.x) * 0.1;
                this.y += (this.baseY - this.y) * 0.1;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const opacity = dist < mouse.radius ? 1 : 0.6;
            ctx.fillStyle = `rgba(216, 180, 254, ${opacity})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());
    
    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const midX = (particles[i].x + particles[j].x) / 2;
                    const midY = (particles[i].y + particles[j].y) / 2;
                    const distToMouse = Math.sqrt((mouse.x - midX)**2 + (mouse.y - midY)**2);
                    const baseOpacity = 1 - (dist / connectionDist);
                    const mouseBoost = distToMouse < mouse.radius ? 0.5 : 0;
                    const opacity = Math.min(1, baseOpacity * 0.4 + mouseBoost);
                    ctx.strokeStyle = `rgba(179, 71, 255, ${opacity})`;
                    ctx.lineWidth = distToMouse < mouse.radius ? 1.5 : 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    const sections = document.querySelectorAll('.section');
    const tabs = document.querySelectorAll('.tab');
    let currentIndex = 0;
    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;
        sections.forEach(s => s.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        sections[index].classList.add('active');
        if (tabs[index]) tabs[index].classList.add('active');
        currentIndex = index;
    }
    document.getElementById('nextBtn').addEventListener('click', () => goToSection(currentIndex + 1));
    document.getElementById('prevBtn').addEventListener('click', () => goToSection(currentIndex - 1));
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            goToSection(index);
        });
    });
    let isScrolling = false;
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        isScrolling = true;
        if (e.deltaY > 0) goToSection(currentIndex + 1);
        else goToSection(currentIndex - 1);
        setTimeout(() => isScrolling = false, 800);
    });
    goToSection(0);

    const magneticElements = document.querySelectorAll('.tab, .nav-btn, .social-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0, 0)`;
        });
    });

    const thread = document.getElementById('thread');
    const pendant = document.getElementById('pendant');
    const container = document.getElementById('necklaceContainer');
    let pMouseX = 0, pMouseY = 0;
    let currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0;
    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        pMouseX = (e.clientX - (rect.left + rect.width / 2)) / 40;
        pMouseY = (e.clientY - (rect.top + rect.height / 2)) / 40;
    });
    pendant.addEventListener('click', () => {
        velocityX += (Math.random() - 0.5) * 60;
        velocityY += (Math.random() - 0.5) * 60;
    });
    function animatePendant() {
        velocityX += (pMouseX - currentX) * 0.03;
        velocityY += (pMouseY - currentY) * 0.03;
        velocityX *= 0.92;
        velocityY *= 0.92;
        currentX += velocityX;
        currentY += velocityY;
        pendant.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg) translateZ(20px)`;
        thread.style.transform = `rotateZ(${currentX * 0.5}deg) rotateX(${currentY * 0.5}deg)`;
        requestAnimationFrame(animatePendant);
    }
    animatePendant();

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    const trails = [];
    for (let i = 0; i < 8; i++) {
        const t = document.createElement('div');
        t.classList.add('cursor-trail');
        t.style.opacity = (1 - i / 8) * 0.7;
        t.style.width = (6 - i * 0.5) + 'px';
        t.style.height = (6 - i * 0.5) + 'px';
        document.body.appendChild(t);
        trails.push({ el: t, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });
    document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursorDot.classList.remove('clicking'));
    function animateTrail() {
        let prevX = cursorX;
        let prevY = cursorY;
        trails.forEach((trail) => {
            trail.x += (prevX - trail.x) * 0.3;
            trail.y += (prevY - trail.y) * 0.3;
            trail.el.style.left = trail.x + 'px';
            trail.el.style.top = trail.y + 'px';
            prevX = trail.x;
            prevY = trail.y;
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
});
