document.addEventListener('DOMContentLoaded', () => {
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

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const form = document.querySelector('#quote-form');
  if (!form) return;

  const SUPABASE_URL = 'https://szdrpdjyordvqtkuuazh.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZHJwZGp5b3JkdnF0a3V1YXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDAxMzgsImV4cCI6MjA4MjM3NjEzOH0.7rHx3HXaqe1h7q3y79nMwuXbOR9CcmWrY3WKXFjk8yM';
  const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    const fd = new FormData(form);
    const photoInput = form.querySelector('input[name="photos"]');
    const photoUrls = [];

    if (sb && photoInput && photoInput.files.length > 0) {
      for (const file of photoInput.files) {
        try {
          const ext = file.name.split('.').pop();
          const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data, error } = await sb.storage.from('ssp-photos').upload(path, file);
          if (!error && data) {
            const { data: urlData } = sb.storage.from('ssp-photos').getPublicUrl(data.path);
            photoUrls.push(urlData.publicUrl);
          }
        } catch (err) {
          console.error('Photo upload error:', err);
        }
      }
    }
    btn.textContent = 'Sending...';

    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      location: fd.get('location'),
      service: fd.get('service'),
      details: fd.get('details'),
      photo_urls: photoUrls,
    };

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        window.location.href = 'thank-you.html';
      } else {
        btn.textContent = 'Try Again';
        alert('DB Error: ' + (result.dbError || 'unknown'));
        btn.disabled = false;
      }
    } catch (err) {
      console.error('Form error:', err);
      window.location.href = 'thank-you.html';
    }
  });
});