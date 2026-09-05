/**
 * Advanced Interactive Animations - Revan Muchlis Setiawan Portfolio
 * Vanilla JavaScript (No external framework/dependencies required)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initParticleCanvas();
    initTypewriter();
    initMobileNav();
    initActiveNavScroll();
    init3DTilt();
    initScrollAnimations();
    initCounterAnimation();
    initBackToTop();
});

/* ─── 1. Custom Glowing Cursor Follower ─────────────────── */
function initCursorGlow() {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let glow = document.getElementById('cursor-glow');
    if (!glow) {
        glow = document.createElement('div');
        glow.id = 'cursor-glow';
        document.body.appendChild(glow);
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ─── 2. Interactive Canvas Particle Constellation ────────── */
function initParticleCanvas() {
    let canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 70);

    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
            this.color = '#38bdf8';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(render);
    }
    render();
}

/* ─── 3. Dynamic Typewriter Effect ──────────────────────── */
function initTypewriter() {
    const subtitleEl = document.querySelector('.subtitle');
    if (!subtitleEl) return;

    const phrases = [
        "Web Developer & UI/UX Designer",
        "Frontend & UI Enthusiast",
        "Creative Problem Solver",
        "Pelajar SMKN 1 Majalengka"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            subtitleEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            subtitleEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2200; // Pause at full text
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ─── 4. Mobile Navigation ──────────────────────────────── */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggleBtn.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggleBtn.classList.remove('active');
            });
        });
    }
}

/* ─── 5. Active Nav Highlight on Scroll ─────────────────── */
function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar blur intensity
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-section') === id);
                });
            }
        });
    }, { passive: true });
}

/* ─── 6. 3D Tilt Effect on Mouse Move ───────────────────── */
function init3DTilt() {
    // Disable on touch devices for smoother experience
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll('.skill-card, .project-card, .photo-frame, .about-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

/* ─── 7. Scroll Reveal Animations ───────────────────────── */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.section-title, .section-tag, .skill-card, .project-card, .info-item, .contact-item-row, .contact-cta');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
}

/* ─── 8. Animated Number Counter ────────────────────────── */
function initCounterAnimation() {
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNums.forEach(stat => {
                    const targetText = stat.textContent.trim();
                    const hasPlus = targetText.includes('+');
                    const hasPercent = targetText.includes('%');
                    const numericVal = parseInt(targetText, 10);

                    if (isNaN(numericVal)) return;

                    let current = 0;
                    const duration = 1500;
                    const stepTime = 30;
                    const steps = duration / stepTime;
                    const increment = numericVal / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericVal) {
                            current = numericVal;
                            clearInterval(timer);
                        }
                        stat.textContent = `${Math.floor(current)}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
}

/* ─── 9. Back to Top Floating Button ────────────────────── */
function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
        document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
