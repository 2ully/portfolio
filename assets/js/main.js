/* ===================================
   MAIN.JS — Personal Portfolio
=================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL ────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ─── MOBILE NAV TOGGLE ────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ─── SCROLL REVEAL ────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED COUNTER ─────────────────────
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, step);
  }

  // ─── EMAILJS SETUP ────────────────────────
  const SERVICE_ID = "service_portfolio";
  const TEMPLATE_ID = "template_hrzs8sr";
  const PUBLIC_KEY = "-vBLqwXMnsR2mnJSz";

  emailjs.init(PUBLIC_KEY);

  // ─── CONTACT FORM ─────────────────────────
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span style="display:inline-block;animation:spin 0.6s linear infinite">↻</span> Sending...';
    btn.disabled = true;

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      showToast('✅', "Message sent! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      showToast('❌', 'Failed to send message. Please try again.');
      console.error('EmailJS error:', error);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  // ─── TOAST ────────────────────────────────
  function showToast(icon, message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-icon').textContent = icon;
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
  // ─── SMOOTH ACTIVE NAV HIGHLIGHT ──────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchorMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    navAnchorMap[a.getAttribute('href').slice(1)] = a;
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(navAnchorMap).forEach(a => a.style.color = '');
        const link = navAnchorMap[entry.target.id];
        if (link && !link.classList.contains('nav-cta')) {
          link.style.color = 'var(--text-primary)';
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});
