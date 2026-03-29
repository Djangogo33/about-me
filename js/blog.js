/* ============================================
   blog.js — Articles & rendu du blog
   ============================================ */

const BLOG_POSTS = [
  {
    id: 1,
    tag: "Extension Chrome",
    title: "Comment j'ai créé AITools Pro v4.0",
    excerpt: "De l'idée à la production : architecture Manifest V3, service workers, injection de scripts dans des pages tierces et gestion du stockage persistant.",
    date: "Mars 2026",
    readtime: "6 min",
    content: `
      <h2>Pourquoi AITools Pro ?</h2>
      <p>Tout a commencé par une frustration simple : passer trop de temps à naviguer entre des onglets différents pour chercher sur Maps, ChatGPT ou Wikipedia. Je voulais un seul outil accessible partout dans Chrome.</p>

      <h2>L'architecture : Manifest V3</h2>
      <p>AITools Pro est construit sur <strong>Manifest V3</strong>, la dernière version du système d'extensions Chrome. Contrairement à MV2, MV3 impose l'utilisation de <em>service workers</em> à la place des background pages persistantes.</p>
      <p>Concrètement, ça veut dire :</p>
      <ul>
        <li>Le background script se lance seulement quand nécessaire, ce qui économise la RAM</li>
        <li>La communication popup ↔ content script se fait via <code>chrome.runtime.sendMessage</code></li>
        <li>Le stockage utilise <code>chrome.storage.local</code> (et non localStorage, inaccessible dans les workers)</li>
      </ul>

      <h2>L'injection de scripts</h2>
      <p>La fonctionnalité la plus complexe : injecter des boutons directement dans la page Google Search. Le content script <code>content-v4.js</code> détecte si on est sur google.com et modifie le DOM pour ajouter la barre AITools.</p>
      <pre><code>// Détecter la page Google
if (window.location.hostname.includes('google.com')) {
  injectToolbar();
}</code></pre>

      <h2>Le mode sombre universel</h2>
      <p>L'un des features les plus appréciés. Au lieu de cibler chaque site un par un, on injecte une feuille de style CSS globale qui force un filtre sombre sur toute la page :</p>
      <pre><code>html { filter: invert(1) hue-rotate(180deg) !important; }
img, video { filter: invert(1) hue-rotate(180deg); }</code></pre>
      <p>Simple, mais efficace sur 99% des sites.</p>

      <h2>Ce que j'ai appris</h2>
      <p>Ce projet m'a appris à gérer la <strong>communication asynchrone</strong> entre différents contextes (popup, background, content), à respecter les <strong>contraintes CSP</strong> de MV3 (pas de scripts inline), et à penser en termes d'<strong>expérience utilisateur</strong> : chaque clic de trop est une fonctionnalité en moins.</p>

      <h2>La suite</h2>
      <p>La roadmap prévoit la synchronisation cloud, le support Firefox et un système de marketplace pour ajouter ses propres catégories de recherche. Tout le code est dispo sur GitHub — contributions bienvenues !</p>
    `,
    url: "https://github.com/Djangogo33/AITools",
  },
  {
    id: 2,
    tag: "Tutoriel",
    title: "Déployer gratuitement avec Netlify + GitHub",
    excerpt: "Guide complet pour héberger ton projet HTML/CSS/JS sans payer un centime, avec déploiement automatique à chaque push.",
    date: "Fév. 2026",
    readtime: "4 min",
    content: null, /* Article complet à rédiger */
    url: "https://djangogo33.github.io/optitools",
    comingSoon: true,
  },
  {
    id: 3,
    tag: "Dev Web",
    title: "Auth client-side avec localStorage : retour d'expérience",
    excerpt: "Retour d'expérience sur la mise en place d'un système d'authentification 100% front-end dans TutoFacile, sans serveur.",
    date: "Jan. 2026",
    readtime: "5 min",
    content: null,
    url: "https://github.com/Djangogo33/optitools",
    comingSoon: true,
  },
];

/* ── Rendu de la grille d'articles ── */
function renderBlogPosts() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = BLOG_POSTS.map(post => `
    <div class="blog-card anim-up" data-id="${post.id}" ${post.comingSoon ? '' : `data-href="${post.url}"`}>
      <div class="blog-tag">${post.tag}</div>
      <div class="blog-title">${post.title}</div>
      <p class="blog-excerpt">${post.excerpt}</p>
      <div class="blog-meta">
        <span>${post.date}</span>
        <span>${post.readtime} de lecture${post.comingSoon ? ' · <em>bientôt</em>' : ''}</span>
      </div>
    </div>
  `).join('');

  /* Clic sur le 1er article → ouvre la modale */
  grid.querySelectorAll('.blog-card').forEach(card => {
    const id = parseInt(card.dataset.id);
    const post = BLOG_POSTS.find(p => p.id === id);

    if (post && post.content) {
      card.addEventListener('click', () => openArticle(post));
      card.style.cursor = 'pointer';
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openArticle(post); });
    }

    card.classList.add('anim-up');
  });

  /* Activer les liens data-href sur les autres */
  if (window.initDataLinks) {
    window.initDataLinks(grid);
  }

  /* Observer les nouvelles cards pour l'animation */
  if (window._animObserver) {
    grid.querySelectorAll('.anim-up').forEach(el => window._animObserver.observe(el));
  }
}

/* ── Modale article ── */
function openArticle(post) {
  /* Créer la modale si besoin */
  let modal = document.getElementById('blog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-panel" role="dialog" aria-modal="true">
        <div class="modal-header">
          <span class="modal-tag"></span>
          <button class="modal-close" aria-label="Fermer">✕</button>
        </div>
        <h2 class="modal-title"></h2>
        <div class="modal-meta"></div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <button class="btn btn-primary modal-github">Voir sur GitHub ↗</button>
          <button class="btn btn-ghost modal-back">← Fermer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    injectModalStyles();

    const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-back').addEventListener('click', close);
    modal.querySelector('.modal-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* Remplir */
  modal.querySelector('.modal-tag').textContent   = post.tag;
  modal.querySelector('.modal-title').textContent = post.title;
  modal.querySelector('.modal-meta').textContent  = `${post.date} · ${post.readtime} de lecture`;
  modal.querySelector('.modal-body').innerHTML    = post.content;
  modal.querySelector('.modal-github').onclick    = () => window.open(post.url, '_blank');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Styles modale injectés une seule fois ── */
function injectModalStyles() {
  if (document.getElementById('modal-style')) return;
  const s = document.createElement('style');
  s.id = 'modal-style';
  s.textContent = `
    #blog-modal { display:none; position:fixed; inset:0; z-index:500; align-items:center; justify-content:center; }
    #blog-modal.open { display:flex; }
    .modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); }
    .modal-panel {
      position:relative; z-index:1; background:#14141f; border:1px solid rgba(255,255,255,0.12);
      border-radius:10px; width:min(720px,95vw); max-height:88vh; overflow-y:auto;
      padding:2.5rem; display:flex; flex-direction:column; gap:1rem;
      animation:fadeUp .3s ease both;
    }
    .modal-header { display:flex; justify-content:space-between; align-items:center; }
    .modal-tag { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#7c6aff; }
    .modal-close { background:none; border:none; color:#6868a0; font-size:1.1rem; cursor:pointer; transition:color .2s; padding:4px 8px; border-radius:4px; }
    .modal-close:hover { color:#e8e8f0; background:rgba(255,255,255,0.07); }
    .modal-title { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; letter-spacing:-.03em; line-height:1.2; color:#e8e8f0; }
    .modal-meta { font-size:11px; color:#6868a0; letter-spacing:.05em; }
    .modal-body { font-size:13px; color:#a0a0c0; line-height:1.9; border-top:1px solid rgba(255,255,255,0.07); padding-top:1.5rem; }
    .modal-body h2 { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:#e8e8f0; margin:1.5rem 0 .6rem; }
    .modal-body p { margin-bottom:.9rem; }
    .modal-body ul { padding-left:1.5rem; margin-bottom:.9rem; }
    .modal-body li { margin-bottom:.3rem; }
    .modal-body pre { background:#0e0e18; border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:1rem 1.2rem; overflow-x:auto; margin:.8rem 0; }
    .modal-body code { font-family:'Space Mono',monospace; font-size:11px; color:#6affd4; }
    .modal-body strong { color:#e8e8f0; font-weight:400; }
    .modal-body em { color:#ff6a9e; font-style:normal; }
    .modal-footer { display:flex; gap:10px; flex-wrap:wrap; padding-top:.5rem; border-top:1px solid rgba(255,255,255,0.07); }
  `;
  document.head.appendChild(s);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', renderBlogPosts);
