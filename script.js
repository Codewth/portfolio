/* ============================================
   PORTFOLIO — MAIN SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {



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
