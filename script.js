document.addEventListener('DOMContentLoaded', () => {
const bg = document.getElementById('spaceBg');
for(let i=0; i<150; i++) {
const s = document.createElement('div');
s.classList.add('star');
const size = Math.random() * 3 + 1;
s.style.width = size + 'px';
s.style.height = size + 'px';
s.style.left = Math.random() * 100 + 'vw';
s.style.top = Math.random() * 100 + 'vh';
s.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
s.style.animationDelay = Math.random() * 5 + 's';
bg.appendChild(s);
}
const style = document.createElement('style');
style.innerHTML = `
@keyframes twinkle {
0% { opacity: .2; transform: scale(.8); }
100% { opacity: 1; transform: scale(1.2); }
}
@keyframes floatUp {
0% { transform: translateY(0) scale(1); opacity: 0; }
10% { opacity: 1; }
100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}
`;
document.head.appendChild(style);
for(let i=0; i<20; i++) {
const p = document.createElement('div');
p.style.position = 'absolute';
p.style.width = Math.random() * 4 + 2 + 'px';
p.style.height = p.style.width;
p.style.background = '#ff7b00';
p.style.borderRadius = '50%';
p.style.left = Math.random() * 100 + 'vw';
p.style.top = Math.random() * 100 + 'vh';
p.style.animation = `floatUp ${Math.random() * 10 + 10}s linear infinite`;
p.style.animationDelay = Math.random() * 10 + 's';
p.style.opacity = '0.6';
p.style.boxShadow = '0 0 10px #ff7b00';
bg.appendChild(p);
}
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.1 });
sections.forEach(s => observer.observe(s));
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
const pendant = document.getElementById('pendant');
const thread = document.getElementById('thread');
const necklace = document.getElementById('necklace');
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
document.addEventListener('mousemove', (e) => {
const rect = necklace.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
mouseX = (e.clientX - centerX) / 50;
mouseY = (e.clientY - centerY) / 50;
});
function animate() {
targetX += (mouseX - targetX) * 0.1;
targetY += (mouseY - targetY) * 0.1;
currentX = targetX;
currentY = targetY;
pendant.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
thread.style.transform = `rotate(${currentX * 0.5}deg)`;
requestAnimationFrame(animate);
}
animate();
const glow = document.createElement('div');
glow.style.position = 'fixed';
glow.style.width = '300px';
glow.style.height = '300px';
glow.style.borderRadius = '50%';
glow.style.background = 'radial-gradient(circle, rgba(255,123,0,0.15) 0%, rgba(255,123,0,0) 70%)';
glow.style.pointerEvents = 'none';
glow.style.zIndex = '-1';
glow.style.transform = 'translate(-50%,-50%)';
document.body.appendChild(glow);
document.addEventListener('mousemove', (e) => {
glow.style.left = e.clientX + 'px';
glow.style.top = e.clientY + 'px';
});
window.addEventListener('scroll', () => {
const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
const orbs = document.querySelectorAll('.glow-orb');
if(orbs.length > 0) {
orbs[0].style.background = `rgba(255, 123, 0, ${0.15 - scrollPercent * 0.1})`;
orbs[0].style.transform = `scale(${1 + scrollPercent * 0.5})`;
}
if (!document.body.classList.contains('portal-active')) {
document.body.style.background = `radial-gradient(circle at 50% ${20 + scrollPercent * 30}%, rgba(61, 27, 10, ${1 - scrollPercent * 0.3}) 0%, #0d0504 100%)`;
}
});
function createShootingStar() {
const star = document.createElement('div');
star.style.position = 'absolute';
star.style.width = '2px';
star.style.height = '2px';
star.style.background = '#fff';
star.style.borderRadius = '50%';
star.style.boxShadow = '0 0 10px 2px #fff, 0 0 20px 4px #ff7b00';
star.style.left = Math.random() * 100 + 'vw';
star.style.top = Math.random() * 50 + 'vh';
star.style.opacity = '0';
const angle = Math.random() * 45 + 135;
star.style.transform = `rotate(${angle}deg)`;
bg.appendChild(star);
star.animate([
{ transform: `translate(0, 0) rotate(${angle}deg)`, opacity: 0 },
{ opacity: 1, offset: 0.1 },
{ transform: `translate(-200px, 200px) rotate(${angle}deg)`, opacity: 0 }
], {
duration: 1000 + Math.random() * 1000,
easing: 'ease-out'
}).onfinish = () => star.remove();
}
setInterval(() => {
if (Math.random() > 0.6) createShootingStar();
}, 3000);
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
if (window.scrollY > 300) {
scrollTopBtn.classList.add('show');
} else {
scrollTopBtn.classList.remove('show');
}
});
scrollTopBtn.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
const stars = document.querySelectorAll('.star');
document.addEventListener('mousemove', (e) => {
stars.forEach(star => {
const rect = star.getBoundingClientRect();
const dist = Math.hypot(e.clientX - rect.left, e.clientY - rect.top);
if (dist < 100) {
star.style.boxShadow = '0 0 20px 5px rgba(255, 123, 0, 0.8)';
star.style.background = '#ffb347';
} else {
star.style.boxShadow = '0 0 10px rgba(255,255,255,.5)';
star.style.background = '#fff';
}
});
});
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);
const trails = [];
const trailCount = 8;
for (let i = 0; i < trailCount; i++) {
const t = document.createElement('div');
t.classList.add('cursor-trail');
t.style.opacity = (1 - i / trailCount) * 0.7;
t.style.width = (6 - i * 0.5) + 'px';
t.style.height = (6 - i * 0.5) + 'px';
document.body.appendChild(t);
trails.push({ el: t, x: 0, y: 0 });
}
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
document.addEventListener('mousemove', (e) => {
cursorX = e.clientX;
cursorY = e.clientY;
cursorDot.style.left = cursorX + 'px';
cursorDot.style.top = cursorY + 'px';
});
document.addEventListener('mousedown', () => {
cursorDot.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
cursorDot.classList.remove('clicking');
});
function animateTrail() {
let prevX = cursorX;
let prevY = cursorY;
trails.forEach((trail, index) => {
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
const sectionsForGlow = document.querySelectorAll('.section');
sectionsForGlow.forEach(section => {
section.addEventListener('mousemove', e => {
const rect = section.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
section.style.setProperty('--mouse-x', `${x}px`);
section.style.setProperty('--mouse-y', `${y}px`);
});
});
const notebookSection = document.querySelector('.notebook-section');
const portalObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
document.body.classList.add('portal-active');
} else if (!entry.isIntersecting) {
document.body.classList.remove('portal-active');
}
});
}, { threshold: [0, 0.4, 0.8] });
if (notebookSection) {
portalObserver.observe(notebookSection);
}
});
