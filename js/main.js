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
  if (!form) return;

  // Supabase client for photo uploads
  const SUPABASE_URL = 'https://oschjeuhejqibymdaqxw.supabase.co';
  const SUPABASE_ANON = 'REPLACE_WITH_ANON_KEY';
  const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    const fd = new FormData(form);
    const photoInput = form.querySelector('input[name="photos"]');
    const photoUrls = [];

    // Upload photos to Supabase Storage
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
      btn.textContent = 'Sending...';
    } else {
      btn.textContent = 'Sending...';
    }

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
});