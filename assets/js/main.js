/**
 * Abbu Bhakar Siddik — Portfolio Interactive Scripts
 * Full Stack AI Developer (MERN · Next.js · React Native)
 * Features: Dark/Light Mode, Typewriter Effect, Scroll Progress,
 * Skills & Project Filtering, Clipboard Toast, Active Scroll Spy, Back-to-Top
 */

(function () {
  'use strict';

  // ==========================================
  // 1. THEME SWITCHER (Dark / Light Mode)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const STORAGE_KEY = 'abu_portfolio_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'bx bx-sun';
        themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
        themeToggle.setAttribute('title', 'Switch to Light Mode');
      } else {
        themeIcon.className = 'bx bx-moon';
        themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
        themeToggle.setAttribute('title', 'Switch to Dark Mode');
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore storage errors */
    }
  }

  // Detect initial theme
  const savedTheme = (function () {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  })();

  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!savedTheme) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ==========================================
  // 3. NAVIGATION MENU (Mobile & Active Spy)
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show');
      const isOpen = navMenu.classList.contains('show');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('show');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active scroll section indicator
  const sections = document.querySelectorAll('section[id]');

  function scrollActive() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          matchingLink.classList.add('active-link');
        } else {
          matchingLink.classList.remove('active-link');
        }
      }
    });
  }

  window.addEventListener('scroll', scrollActive, { passive: true });
  scrollActive();

  // Header background on scroll
  const header = document.querySelector('.l-header');
  function scrollHeader() {
    if (!header) return;
    if (window.scrollY >= 50) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }
  }
  window.addEventListener('scroll', scrollHeader, { passive: true });
  scrollHeader();

  // ==========================================
  // 4. TYPEWRITER EFFECT IN HERO
  // ==========================================
  const typewriterElem = document.getElementById('typewriter-text');
  if (typewriterElem) {
    const roles = [
      'Full Stack AI Developer',
      'MERN & Next.js Architect',
      'React Native & Mobile Engineer',
      'LLM & Prompt Specialist',
      'Supabase & PostgreSQL Engineer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 95;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 800);
  }

  // ==========================================
  // 5. SKILLS FILTERING TABS
  // ==========================================
  const skillFilters = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill__card');

  if (skillFilters.length && skillCards.length) {
    skillFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        skillFilters.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter || (category && category.includes(filter))) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px) scale(0.96)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================
  // 6. PROJECTS FILTERING TABS
  // ==========================================
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project__card');

  if (projectFilters.length && projectCards.length) {
    projectFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        projectFilters.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter || (category && category.includes(filter))) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(0.97)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================
  // 7. TOAST NOTIFICATION & COPY-TO-CLIPBOARD
  // ==========================================
  const toast = document.getElementById('clipboard-toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast(`✓ ${label} copied to clipboard!`);
          })
          .catch(() => {
            fallbackCopy(textToCopy, label);
          });
      } else {
        fallbackCopy(textToCopy, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`✓ ${label} copied to clipboard!`);
    } catch (err) {
      showToast(`Copy failed. Please manually copy: ${text}`);
    }
    document.body.removeChild(tempInput);
  }

  // ==========================================
  // 8. BACK TO TOP BUTTON
  // ==========================================
  const backToTop = document.getElementById('back-to-top');

  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.pageYOffset > 380) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 9. SMOOTH ACCORDION FOR PROJECT DETAILS
  // ==========================================
  const projectDetails = document.querySelectorAll('.project__details');
  projectDetails.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        const body = detail.querySelector('.project__details-body');
        if (body) {
          body.style.animation = 'detailReveal 0.35s ease both';
        }
      }
    });
  });

  // ==========================================
  // 10. SCROLLREVEAL ANIMATIONS
  // ==========================================
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof ScrollReveal !== 'undefined' && !prefersReducedMotion) {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '24px',
      duration: 800,
      delay: 60,
      interval: 80,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      reset: false,
      viewFactor: 0.1
    });

    sr.reveal('.home__tag, .home__title, .home__subtitle-wrapper, .home__description, .home__actions, .home__social', {
      origin: 'left',
      interval: 80
    });
    sr.reveal('.home__stats > div', { interval: 80, distance: '16px' });
    sr.reveal('.home__visual', { origin: 'right', delay: 180, distance: '30px' });
    sr.reveal('.about__img-wrap', { origin: 'left', distance: '30px' });
    sr.reveal('.about__content > *', { origin: 'right', interval: 90 });
    sr.reveal('.skill-filter-tabs', { origin: 'top', distance: '15px' });
    sr.reveal('.skill__card', { interval: 60, distance: '20px' });
    sr.reveal('.project-filter-tabs', { origin: 'top', distance: '15px' });
    sr.reveal('.project__card', { interval: 110, distance: '28px' });
    sr.reveal('.experience__card', { interval: 80, distance: '20px' });
    sr.reveal('.cert__card', { interval: 80, distance: '20px' });
    sr.reveal('.education__card', { interval: 100, distance: '20px' });
    sr.reveal('.resume__inner', { distance: '25px' });
    sr.reveal('.contact__container > *', { interval: 120, distance: '25px' });
  }

  // Expose toast trigger globally if needed
  window.showToast = showToast;
})();
