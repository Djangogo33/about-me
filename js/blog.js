/* ============================================
   blog.js — Lecture des articles depuis GitHub
   et rendu du blog sur le site public
   ============================================ */

const POSTS_URL = 'data/posts.json'; /* Chemin relatif — fonctionne depuis /about-me/ */

/* ── Charger les articles depuis le JSON local (ou GitHub Pages) ── */
async function fetchPosts() {
  try {
    const res = await fetch(POSTS_URL + '?t=' + Date.now()); /* Cache-bust */
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const all = await res.json();
    return all.filter(p => p.published !== false); /* Seulement les publiés */
  } catch(e) {
    console.warn('blog.js: impossible de charger posts.json :', e.message);
    return [];
  }
}

/* ── Rendu de la grille d'articles ── */
async function renderBlogPosts() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:1rem 0">Chargement des articles…</div>';

  const posts = await fetchPosts();

  if (!posts.length) {
    grid.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:1rem 0">Aucun article publié pour le moment.</div>';
    return;
  }

  grid.innerHTML = posts.map(post => `
    <div class="blog-card anim-up" data-id="${post.id}">
      ${post.coverImage
        ? `<img src="${post.coverImage}" alt="Couverture" style="width:100%;height:140px;object-fit:cover;border-radius:4px;margin-bottom:.75rem;">`
        : ''}
      <div class="blog-tag">${post.tag || ''}</div>
      <div class="blog-title">${post.title}</div>
      <p class="blog-excerpt">${post.excerpt || ''}</p>
      <div class="blog-meta">
        <span>${post.dateDisplay || ''}</span>
        <span>${post.readtime || '?'} min de lecture</span>
      </div>
    </div>
  `).join('');

  /* Clic → ouvrir la modale */
  grid.querySelectorAll('.blog-card').forEach(card => {
    const id   = card.dataset.id;
    const post = posts.find(p => p.id === id);
    if (!post) return;

    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.addEventListener('click',   () => openArticle(post));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openArticle(post); });
  });

  /* Activer les animations */
  if (window._animObserver) {
    grid.querySelectorAll('.anim-up').forEach(el => window._animObserver.observe(el));
  }
}

/* ── Modale article ── */
function openArticle(post) {
  let modal = document.getElementById('blog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <span class="modal-tag"></span>
          <button class="modal-close" aria-label="Fermer">✕</button>
        </div>
        <img class="modal-cover" id="modal-cover" src="" alt="Couverture">
        <h2 class="modal-title" id="modal-title"></h2>
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

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      history.replaceState(null, '', window.location.pathname);
    };
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-back').addEventListener('click', close);
    modal.querySelector('.modal-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* Remplir la modale */
  modal.querySelector('.modal-tag').textContent    = post.tag || '';
  modal.querySelector('.modal-title').textContent  = post.title;
  modal.querySelector('.modal-meta').textContent   = `${post.dateDisplay || ''} · ${post.readtime || '?'} min de lecture`;
  modal.querySelector('.modal-body').innerHTML     = post.content || '';
  modal.querySelector('.modal-github').onclick     = () => window.open(post.url || 'https://github.com/Djangogo33', '_blank');

  const coverEl = modal.querySelector('.modal-cover');
  if (post.coverImage) {
    coverEl.src = post.coverImage;
    coverEl.style.display = 'block';
  } else {
    coverEl.style.display = 'none';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-panel').scrollTop = 0;
}

/* ── Styles modale injectés une seule fois ── */
function injectModalStyles() {
  if (document.getElementById('modal-style')) return;
  const s = document.createElement('style');
  s.id = 'modal-style';
  s.textContent = `
    #blog-modal{display:none;position:fixed;inset:0;z-index:500;align-items:center;justify-content:center}
    #blog-modal.open{display:flex}
    .modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(8px)}
    .modal-panel{
      position:relative;z-index:1;background:#14141f;border:1px solid rgba(255,255,255,.12);
      border-radius:12px;width:min(740px,96vw);max-height:90vh;overflow-y:auto;
      padding:2.5rem;display:flex;flex-direction:column;gap:1rem;
      animation:fadeUp .3s ease both;
      scrollbar-width:thin;scrollbar-color:rgba(124,106,255,.3) transparent;
    }
    .modal-header{display:flex;justify-content:space-between;align-items:center}
    .modal-tag{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#7c6aff}
    .modal-close{background:none;border:none;color:#6868a0;font-size:1rem;cursor:pointer;
      transition:color .2s;padding:5px 9px;border-radius:4px;line-height:1}
    .modal-close:hover{color:#e8e8f0;background:rgba(255,255,255,.07)}
    .modal-cover{width:100%;max-height:260px;object-fit:cover;border-radius:8px;display:none}
    .modal-title{font-family:'Syne',sans-serif;font-size:1.65rem;font-weight:800;
      letter-spacing:-.03em;line-height:1.2;color:#e8e8f0}
    .modal-meta{font-size:11px;color:#6868a0;letter-spacing:.05em}
    .modal-body{font-size:13px;color:#a0a0c0;line-height:1.9;
      border-top:1px solid rgba(255,255,255,.07);padding-top:1.5rem}
    .modal-body h2{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;
      color:#e8e8f0;margin:1.5rem 0 .6rem}
    .modal-body h3{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;
      color:#e8e8f0;margin:1.2rem 0 .4rem}
    .modal-body p{margin-bottom:.9rem}
    .modal-body ul,.modal-body ol{padding-left:1.5rem;margin-bottom:.9rem}
    .modal-body li{margin-bottom:.3rem}
    .modal-body strong{color:#e8e8f0;font-weight:700}
    .modal-body em{color:#ff6a9e;font-style:normal}
    .modal-body a{color:#7c6aff;text-decoration:underline}
    .modal-body blockquote{border-left:3px solid #7c6aff;padding-left:1rem;
      color:#6868a0;margin:1rem 0;font-style:italic}
    .modal-body pre{background:#0e0e18;border:1px solid rgba(255,255,255,.08);
      border-radius:6px;padding:1rem 1.2rem;overflow-x:auto;margin:.8rem 0}
    .modal-body code{font-family:'Space Mono',monospace;font-size:11px;color:#6affd4;
      background:#0e0e18;border:1px solid rgba(255,255,255,.08);padding:1px 6px;border-radius:3px}
    .modal-body pre code{background:none;border:none;padding:0}
    .modal-footer{display:flex;gap:10px;flex-wrap:wrap;padding-top:.5rem;
      border-top:1px solid rgba(255,255,255,.07)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  `;
  document.head.appendChild(s);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', renderBlogPosts);
