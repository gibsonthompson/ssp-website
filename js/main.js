/* ============================================
   STRICKLAND SURFACE PREPARATION - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('.nav__link:not(.nav__link--dropdown)').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Mobile dropdown toggle
    nav.querySelectorAll('.nav__dropdown').forEach(dd => {
      const trigger = dd.querySelector('.nav__link--dropdown');
      if (trigger && window.innerWidth <= 900) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            dd.classList.toggle('open');
          }
        });
      }
    });
  }

  // --- Scroll reveal ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // --- Active nav link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });

  // --- Contact form ---
  const form = document.querySelector('#quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      // Simulate submission — replace with real endpoint
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 800);
    });
  }

  // --- Phone number formatting for display ---
  document.querySelectorAll('[data-phone]').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', { event_category: 'contact' });
      }
    });
  });

});
