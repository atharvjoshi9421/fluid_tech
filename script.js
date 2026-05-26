/* ============================================================
   FLUID-TECH WEBSITE — main.js
   All interactive functionality
   ============================================================ */

'use strict';

/* ── Page Loader ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  }
});

/* ── Navbar Scroll Effect ─────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── Active Nav Link ──────────────────────────────────────── */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll-to-Top Button ─────────────────────────────────── */
const scrollTopBtn = document.querySelector('.float-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

/* ── Animated Counter ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = 30;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    const suffix = el.getAttribute('data-suffix') || '';
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, step);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCounters);

/* ── Product Filter Tabs ──────────────────────────────────── */
function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const wrapper = card.closest('[data-item]') || card;
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          wrapper.style.display = '';
          setTimeout(() => {
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
          }, 10);
        } else {
          wrapper.style.opacity = '0';
          wrapper.style.transform = 'translateY(10px)';
          setTimeout(() => wrapper.style.display = 'none', 300);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductFilter);

/* ── Gallery Lightbox ─────────────────────────────────────── */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryItems.length) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item =>
    item.querySelector('img')?.src || ''
  );

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

document.addEventListener('DOMContentLoaded', initLightbox);

/* ── Enquiry / Contact Form Validation ────────────────────── */
function initFormValidation() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;
    let message = '';

    if (field.hasAttribute('required') && !value) {
      valid = false;
      message = 'This field is required.';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (field.type === 'tel' && value) {
      const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/;
      if (!phoneRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid phone number.';
      }
    }

    const feedbackEl = field.parentElement.querySelector('.invalid-feedback');
    if (valid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (feedbackEl) feedbackEl.textContent = message;
    }

    return valid;
  }

  // Live validation
  form.querySelectorAll('.form-control, .form-select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('.form-control, .form-select').forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (allValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        form.reset();
        form.querySelectorAll('.form-control, .form-select').forEach(f => {
          f.classList.remove('is-valid', 'is-invalid');
        });
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => successMsg.style.display = 'none', 6000);
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      }, 1800);
    } else {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 4000);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initFormValidation);

/* ── Smooth Page Transitions ──────────────────────────────── */
function initPageTransitions() {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Only internal links, not anchors
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel') &&
      !href.startsWith('javascript') &&
      href.endsWith('.html')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => window.location.href = href, 300);
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
  initPageTransitions();
});

/* ── Video Modal ──────────────────────────────────────────── */
function initVideoModal() {
  const playBtns = document.querySelectorAll('[data-video-url]');
  const modal = document.getElementById('videoModal');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');

  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-video-url');
      if (iframe && url) {
        iframe.src = url + '?autoplay=1';
      }
    });
  });

  modal.addEventListener('hidden.bs.modal', () => {
    if (iframe) iframe.src = '';
  });
}

document.addEventListener('DOMContentLoaded', initVideoModal);

/* ── Navbar Collapse on Mobile Click ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const navCollapse = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });
});

/* ── Typed effect for hero (optional) ────────────────────── */
function initTypedEffect() {
  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const words = typedEl.getAttribute('data-words')?.split(',') || [];
  if (!words.length) return;

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIdx].trim();

    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

document.addEventListener('DOMContentLoaded', initTypedEffect);

/* ── Sticky nav offset for in-page anchor scrolling ───────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* ── Parallax on hero background ─────────────────────────── */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg-fallback');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initHeroParallax);