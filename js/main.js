document.addEventListener('DOMContentLoaded', () => {
  // Nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    }));
  }

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Contact form
  const form = document.querySelector('#quote-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const fd = new FormData(form);
      const payload = {
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        location: fd.get('location'),
        service: fd.get('service'),
        details: fd.get('details'),
      };

      try {
        const res = await fetch('/api/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          window.location.href = 'thank-you.html';
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        console.error('Form error:', err);
        window.location.href = 'thank-you.html';
      }
    });
  }
});