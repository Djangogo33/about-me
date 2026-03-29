/* ============================================
   github.js — Lecture/écriture posts via GitHub API
   Les articles sont stockés dans data/posts.json
   ============================================ */

const GitHub = (() => {

  /* ── Config ─────────────────────────────────
     À remplir dans l'interface admin (stocké
     dans sessionStorage, jamais en dur ici).
  ─────────────────────────────────────────── */
  const REPO_OWNER  = 'Djangogo33';
  const REPO_NAME   = 'djangogo33.github.io'; /* Ton repo GitHub Pages */
  const FILE_PATH   = 'data/posts.json';
  const API_BASE    = 'https://api.github.com';
  const TOKEN_KEY   = 'dj33_gh_token'; /* Clé sessionStorage */

  /* ── Stocker / récupérer le token GitHub PAT ── */
  function setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token.trim());
  }
  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  }
  function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  }
  function hasToken() {
    return !!getToken();
  }

  /* ── Headers authentifiés ── */
  function headers() {
    return {
      'Authorization': `Bearer ${getToken()}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  /* ── Lire le fichier posts.json depuis GitHub ── */
  async function readPosts() {
    const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await fetch(url, { headers: headers() });

    if (res.status === 404) {
      /* Fichier inexistant → retourner tableau vide + sha null */
      return { posts: [], sha: null };
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub API error ${res.status}`);
    }

    const data = await res.json();
    const content = JSON.parse(atob(data.content.replace(/\n/g, '')));
    return { posts: content, sha: data.sha };
  }

  /* ── Écrire posts.json sur GitHub (crée ou met à jour) ── */
  async function writePosts(posts, sha, commitMessage) {
    const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(posts, null, 2))));

    const body = {
      message: commitMessage || `📝 Blog: mise à jour des articles`,
      content,
      ...(sha ? { sha } : {}), /* sha requis pour update, absent pour create */
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub write error ${res.status}`);
    }
    return res.json();
  }

  /* ── Vérifier que le token est valide ── */
  async function validateToken() {
    const res = await fetch(`${API_BASE}/user`, { headers: headers() });
    if (!res.ok) return null;
    const user = await res.json();
    return user.login; /* Retourne le username GitHub si ok */
  }

  /* ── Calculer le temps de lecture ── */
  function calcReadtime(htmlContent) {
    const text = htmlContent.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200)); /* 200 mots/min */
  }

  /* ── Formater la date ── */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  /* ── Générer un ID unique ── */
  function genId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 6);
  }

  /* ── API publique ── */
  return {
    setToken, getToken, clearToken, hasToken,
    readPosts, writePosts, validateToken,
    calcReadtime, formatDate, genId,
    REPO_OWNER, REPO_NAME,
  };

})();

window.GitHub = GitHub;
