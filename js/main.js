/* ============================================
   main.js — Navigation, scroll, interactions
   ============================================ */

/* ── Helpers ── */
const qs  = (sel)      => document.querySelector(sel);
const qsa = (sel)      => document.querySelectorAll(sel);
const go  = (url)      => window.open(url, '_blank');

/* ── Bug fix : scrollTo collide avec window.scrollTo natif
      → on renomme notre fonction navTo ── */
function navTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* Expose globalement pour les onclick inline dans le HTML */
window.navTo = navTo;
window.go    = go;

/* ══════════════════════════════════════════
   Navigation
══════════════════════════════════════════ */
function initNav() {
  const nav    = qs('nav');
  const burger = qs('#nav-burger');
  const mobile = qs('#nav-mobile');

  /* Scroll : border + lien actif */
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  /* Burger mobile */
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobile.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      mobile.setAttribute('aria-hidden', !isOpen);
    });

    /* Fermer au clic lien mobile */
    mobile.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        burger.classList.remove('open');
        mobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobile.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* Fermer drawer si clic extérieur */
  document.addEventListener('click', (e) => {
    if (mobile && mobile.classList.contains('open')
        && !mobile.contains(e.target)
        && !burger.contains(e.target)) {
      burger.classList.remove('open');
      mobile.classList.remove('open');
    }
  });
}

/* ── Lien actif selon section visible ── */
function updateActiveLink() {
  const sections = ['hero', 'about', 'projects', 'parcours', 'blog', 'contact'];
  const links    = qsa('.nav-links a');
  let current    = 'hero';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === current);
  });
}

/* ══════════════════════════════════════════
   Animations au scroll (IntersectionObserver)
══════════════════════════════════════════ */
function initScrollAnimations() {
  /* Observer pour .anim-up */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  /* On observe les éléments déjà dans le DOM */
  qsa('.anim-up').forEach(el => observer.observe(el));

  /* Observer réutilisable pour les éléments injectés dynamiquement (blog) */
  window._animObserver = observer;
}

/* ══════════════════════════════════════════
   Compteurs animés
══════════════════════════════════════════ */
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      if (isNaN(end)) return;

      let current = 0;
      const increment = Math.ceil(end / 40);
      const timer = setInterval(() => {
        current = Math.min(current + increment, end);
        el.textContent = current + (el.dataset.suffix || '');
        if (current >= end) clearInterval(timer);
      }, 25);

      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  qsa('[data-count]').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   Terminal — effet machine à écrire
══════════════════════════════════════════ */
function initTerminal() {
  const body = qs('#terminal-body');
  if (!body) return;

  const lines = [
    { prompt: true,  text: 'whoami' },
    { prompt: false, text: 'Djangogo33 — dev français, open source builder', cls: 't-out' },
    { prompt: true,  text: 'ls projects/' },
    { prompt: false, text: 'AITools-Pro/   TutoFacile/   NewTab/', cls: 't-muted' },
    { prompt: true,  text: 'git log --oneline' },
    { prompt: false, text: 'a1f3c2  AITools v4.0 — production ✅', cls: 't-muted' },
    { prompt: false, text: '7b9e1a  TutoFacile — 50+ tutoriels live', cls: 't-muted' },
    { prompt: false, text: '3d8e01  NewTab — custom Chrome homepage', cls: 't-muted' },
  ];

  body.innerHTML = '';
  let idx = 0;

  function addLine() {
    if (idx >= lines.length) {
      /* Curseur final clignotant */
      const div = document.createElement('div');
      div.className = 't-line';
      div.style.marginTop = '4px';
      div.innerHTML = '<span class="t-prompt">›</span>&nbsp;<span class="cursor"></span>';
      body.appendChild(div);
      return;
    }

    const l   = lines[idx++];
    const div = document.createElement('div');

    if (l.prompt) {
      div.className = 't-line';
      const span = document.createElement('span');
      span.className = 't-cmd';
      div.innerHTML = '<span class="t-prompt">›</span>&nbsp;';
      div.appendChild(span);
      body.appendChild(div);
      typeText(span, l.text, () => setTimeout(addLine, 180));
    } else {
      div.className = l.cls || 't-out';
      div.textContent = l.text;
      body.appendChild(div);
      setTimeout(addLine, 70);
    }
  }

  setTimeout(addLine, 500);
}

function typeText(el, text, cb) {
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
  }, 26);
}

/* ══════════════════════════════════════════
   Project cards cliquables
══════════════════════════════════════════ */
function initProjectCards() {
  qsa('.project-card[data-url]').forEach(card => {
    card.addEventListener('click', () => go(card.dataset.url));
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') go(card.dataset.url);
    });
  });
}

/* ══════════════════════════════════════════
   Liens data-href (blog cards, contact chips…)
   Appelé aussi depuis blog.js après render
══════════════════════════════════════════ */
function initDataLinks(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-href]').forEach(el => {
    if (el._dataHrefBound) return; /* Évite double-binding */
    el._dataHrefBound = true;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => go(el.dataset.href));
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') go(el.dataset.href);
    });
  });
}
window.initDataLinks = initDataLinks; /* Exposé pour blog.js */

/* ══════════════════════════════════════════
   Année courante dans le footer
══════════════════════════════════════════ */
function setYear() {
  const el = qs('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════
   Effet ripple sur les boutons
══════════════════════════════════════════ */
function initRipple() {
  qsa('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.18);border-radius:50%;
        transform:scale(0);animation:ripple 0.5s ease-out forwards;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  /* Keyframes ripple injectés une seule fois */
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(s);
  }
}

/* ══════════════════════════════════════════
   Init global
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  animateCounters();
  initTerminal();
  initProjectCards();
  initDataLinks();
  initRipple();
  setYear();
  updateActiveLink();
});
