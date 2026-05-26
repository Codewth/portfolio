/* ============================================
   PORTFOLIO — MAIN SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR =====
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactables = document.querySelectorAll('a, button, .btn, .tag, .info-card, .project-card, .contact-item');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // ===== PARTICLE CANVAS BACKGROUND =====
  const canvas  = document.getElementById('bg-canvas');
  const ctx     = canvas.getContext('2d');
  let   width, height, particles = [];

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x     = Math.random() * width;
      this.y     = init ? Math.random() * height : height + 10;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = -(Math.random() * 0.4 + 0.1);
      this.size  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,245,255' : '180,77,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  // Draw subtle grid
  function drawGrid() {
    ctx.strokeStyle = 'rgba(0,245,255,0.025)';
    ctx.lineWidth   = 0.5;
    const step = 60;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.cssText = open
      ? ''
      : 'display:flex;flex-direction:column;position:fixed;top:70px;right:20px;background:rgba(5,8,17,0.95);backdrop-filter:blur(20px);border:1px solid rgba(0,245,255,0.12);border-radius:12px;padding:20px 28px;gap:20px;';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) navLinks.style.cssText = '';
    });
  });

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll(
    '.info-card, .skill-category, .project-card, .contact-item, .contact-form, .about-text, .section-title, .section-label'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // ===== CONTACT FORM =====
  const sendBtn = document.getElementById('send-btn');
  sendBtn && sendBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    let   valid  = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'rgba(255,77,184,0.6)';
        setTimeout(() => input.style.borderColor = '', 2000);
      }
    });

    if (!valid) { showToast('⚠️  Please fill all fields', 'error'); return; }

    sendBtn.textContent = 'Sending...';
    sendBtn.disabled    = true;

    setTimeout(() => {
      inputs.forEach(i => i.value = '');
      sendBtn.textContent = 'Send Message →';
      sendBtn.disabled    = false;
      showToast('✓  Message sent! I\'ll reply soon.');
    }, 1400);
  });

  function showToast(msg, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    if (type === 'error') {
      toast.style.background = 'rgba(255,77,184,0.12)';
      toast.style.borderColor = 'rgba(255,77,184,0.3)';
      toast.style.color = 'var(--accent-pink)';
    } else {
      toast.style.background = '';
      toast.style.borderColor = '';
      toast.style.color = '';
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ===== SMOOTH ANCHOR SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== TYPING ANIMATION for hero subtitle =====
  const roles = ['Software Developer', 'Full Stack Engineer', 'Problem Solver', 'Open Source Fan'];
  let   rIdx = 0, cIdx = 0, deleting = false;
  const subtitleEl = document.querySelector('.subtitle-line');

  function type() {
    const current = roles[rIdx];
    if (!deleting) {
      subtitleEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      subtitleEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 45 : 90);
  }
  setTimeout(type, 1200);

  // ===== ACTIVE NAV HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent-cyan)' : '';
    });
  });

});

emailjs.init("IT4Zn1Xpw1sOroO5E");

const form = document.getElementById("contact-form");

console.log(form);

form.addEventListener("submit", async (e) => {

    console.log("FORM WORKING");

    e.preventDefault();

    try {

        const response = await emailjs.sendForm(
            "service_w7llw74",
            "template_8piu2ug",
            form
        );

        console.log(response);

        alert("Message sent successfully!");

        form.reset();

    } catch(error) {

        console.log(error);

        alert("Failed to send message");

    }

});