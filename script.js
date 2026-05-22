/* ============================================================
   Fluid Tech — main.js
   Navbar scroll/active state, scroll-top, reveal-on-scroll,
   counters, lightbox, form validation
   ============================================================ */
(function () {
  'use strict';
  // ---------- Active nav link highlight ----------
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.ft-navbar .nav-link').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
  // ---------- Scroll-to-top button ----------
  const topBtn = document.querySelector('.float-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('show', window.scrollY > 300);
    });
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // ---------- Reveal on scroll (IntersectionObserver) ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.dataset.counter, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const val = Math.floor(target * (0.5 - Math.cos(Math.PI * p) / 2));
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }
  // ---------- Lightbox ----------
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  if (galleryItems.length) {
    const sources = Array.from(galleryItems).map((el) => el.dataset.lightbox);
    let idx = 0;
    const lb = document.createElement('div');
    lb.className = 'ft-lightbox';
    lb.innerHTML = `
      <button class="lb-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <button class="lb-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="lb-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
      <img alt="Gallery image" />
    `;
    document.body.appendChild(lb);
    const img = lb.querySelector('img');
    const show = (i) => {
      idx = (i + sources.length) % sources.length;
      img.src = sources[idx];
      lb.classList.add('open');
    };
    const close = () => lb.classList.remove('open');
    galleryItems.forEach((el, i) => el.addEventListener('click', () => show(i)));
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
  // ---------- Enquiry / Contact form validation ----------
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const setStatus = (msg, ok) => {
      if (!status) return;
      status.className = 'alert mt-3 ' + (ok ? 'alert-success' : 'alert-danger');
      status.textContent = msg;
      status.classList.remove('d-none');
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      // Clear previous
      form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      const fields = {
        name:    form.querySelector('[name="name"]'),
        company: form.querySelector('[name="company"]'),
        mobile:  form.querySelector('[name="mobile"]'),
        email:   form.querySelector('[name="email"]'),
        city:    form.querySelector('[name="city"]'),
        message: form.querySelector('[name="message"]'),
      };
      const fail = (el) => { if (el) { el.classList.add('is-invalid'); valid = false; } };
      if (fields.name && !fields.name.value.trim()) fail(fields.name);
      if (fields.mobile) {
        const v = fields.mobile.value.replace(/\D/g, '');
        if (!/^\d{10}$/.test(v)) fail(fields.mobile);
      }
      if (fields.email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(fields.email.value.trim())) fail(fields.email);
      }
      if (fields.message && !fields.message.value.trim()) fail(fields.message);
      if (!valid) {
        setStatus('Please fix the highlighted fields and try again.', false);
        return;
      }
      // Client-side only. Build mailto fallback so the message can actually go somewhere.
      const subject = encodeURIComponent('Website Enquiry from ' + (fields.name?.value || ''));
      const body = encodeURIComponent(
        `Name: ${fields.name?.value || ''}\n` +
        `Company: ${fields.company?.value || ''}\n` +
        `Mobile: ${fields.mobile?.value || ''}\n` +
        `Email: ${fields.email?.value || ''}\n` +
        `City: ${fields.city?.value || ''}\n\n` +
        `Requirement:\n${fields.message?.value || ''}`
      );
      // Replace TODO email with the real address when known
      const mailto = `mailto:info@fluidtech.example?subject=${subject}&body=${body}`;
      setStatus('Thank you! Your enquiry has been prepared — opening your email client to send it to our team.', true);
      setTimeout(() => { window.location.href = mailto; }, 600);
      form.reset();
    });
  });
})();
