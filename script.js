document.addEventListener('DOMContentLoaded', () => {
    
    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const numParticles = window.innerWidth < 768 ? 40 : 80;
    const connectionDist = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
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
                    const opacity = 1 - (dist / connectionDist);
                    ctx.strokeStyle = `rgba(255, 123, 0, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    sections.forEach(s => observer.observe(s));

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) current = section.getAttribute('id');
        });
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${current}`) tab.classList.add('active');
        });
    });

    const titles = document.querySelectorAll('.section-title, .notebook-title');
    titles.forEach(title => {
        const text = title.innerText;
        title.innerText = '';
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                title.innerText += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    });

    const thread = document.getElementById('thread');
    const pendant = document.getElementById('pendant');
    const container = document.getElementById('necklaceContainer');
    
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0;

    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - (rect.left + rect.width / 2)) / 40;
        mouseY = (e.clientY - (rect.top + rect.height / 2)) / 40;
    });

    pendant.addEventListener('click', () => {
        velocityX += (Math.random() - 0.5) * 40;
        velocityY += (Math.random() - 0.5) * 40;
    });

    function animatePendant() {
        velocityX += (mouseX - currentX) * 0.03;
        velocityY += (mouseY - currentY) * 0.03;
        
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
