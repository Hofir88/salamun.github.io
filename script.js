/* ============================================
   SALAMUN HOFIR — PORTFOLIO SCRIPT
   Loader | Particles | Typing | Scroll Reveal
   ============================================ */

'use strict';

/* ─── LOADER ──────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initReveal();
    animateProgressBars();
  }, 1200);
});

/* ─── PARTICLE BACKGROUND ─────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 70;
  const COLORS = ['rgba(0,245,212,', 'rgba(0,170,255,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.2 + 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,212,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─── TYPING ANIMATION ────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Junior Web Developer',
    'Teknik Komputer & Jaringan',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Fast Learner'
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 800);
})();

/* ─── NAVBAR ──────────────────────────────────── */
(function initNavbar() {
  const nav  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ─── SMOOTH SCROLL (for older browsers) ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── SCROLL REVEAL ───────────────────────────── */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ─── PROGRESS BARS ────────────────────────────── */
function animateProgressBars() {
  const fills = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = parseInt(fill.dataset.width, 10);
        // Small delay for stagger
        setTimeout(() => { fill.style.width = target + '%'; }, 150);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => observer.observe(fill));
}

/* ─── ACTIVE NAV LINK ON SCROLL ──────────────── */
(function trackActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });

    links.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent)';
      }
    });
  }, { passive: true });
})();

/* ─── CURSOR GLOW EFFECT ──────────────────────── */
(function initCursorGlow() {
  if (window.innerWidth < 860) return; // Skip on mobile

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,212,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ─── CARD TILT EFFECT ────────────────────────── */
(function initTilt() {
  if (window.innerWidth < 860) return;

  const cards = document.querySelectorAll('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-4px) perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── STATS COUNT-UP ──────────────────────────── */
(function initCountUp() {
  const statNums = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num  = parseInt(text);
      if (isNaN(num)) return;
      const suffix = text.replace(/[0-9]/g, '');

      let start = 0;
      const step = num / 30;
      const timer = setInterval(() => {
        start += step;
        if (start >= num) {
          el.textContent = num + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  statNums.forEach(el => observer.observe(el));
})();

console.log('%c Salamun Hofir — Portfolio v1.0 ', 'background:#00f5d4;color:#050810;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px;');
