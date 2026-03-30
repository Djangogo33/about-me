/* ============================================
   github.js — Lecture/écriture posts via GitHub API
   ============================================ */

const GitHub = (() => {

  /* ── Config ──────────────────────────────────
     REPO_OWNER : ton pseudo GitHub
     REPO_NAME  : le NOM du repo seulement
                  (pas le chemin du site !)
     BASE_PATH  : sous-dossier dans le repo
                  (vide '' si à la racine)
  ────────────────────────────────────────── */
  const REPO_OWNER = 'Djangogo33';
  const REPO_NAME  = 'djangogo33.github.io';   /* NOM du repo, sans slash */
  const BASE_PATH  = 'about-me';               /* Sous-dossier dans le repo */
  const FILE_PATH  = BASE_PATH ? `${BASE_PATH}/data/posts.json` : 'data/posts.json';
  const API_BASE   = 'https://api.github.com';
  const TOKEN_KEY  = 'dj33_gh_token';

  const setToken   = t  => sessionStorage.setItem(TOKEN_KEY, t.trim());
  const getToken   = () => sessionStorage.getItem(TOKEN_KEY) || '';
  const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);
  const hasToken   = () => !!getToken();

  function headers() {
    return {
      'Authorization'       : `Bearer ${getToken()}`,
      'Accept'              : 'application/vnd.github+json',
      'Content-Type'        : 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async function readPosts() {
    const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await fetch(url, { headers: headers() });
    if (res.status === 404) return { posts: [], sha: null };
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub API ${res.status}`);
    }
    const data    = await res.json();
    const content = JSON.parse(atob(data.content.replace(/\n/g, '')));
    return { posts: content, sha: data.sha };
  }

  async function writePosts(posts, sha, message) {
    const url     = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(posts, null, 2))));
    const res = await fetch(url, {
      method : 'PUT',
      headers: headers(),
      body   : JSON.stringify({ message: message || '📝 Blog update', content, ...(sha ? { sha } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub write ${res.status}`);
    }
    return res.json();
  }

  async function validateToken() {
    const res = await fetch(`${API_BASE}/user`, { headers: headers() });
    if (!res.ok) return null;
    const u = await res.json();
    return u.login;
  }

  function calcReadtime(html) {
    const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  function genId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 6);
  }

  return {
    setToken, getToken, clearToken, hasToken,
    readPosts, writePosts, validateToken,
    calcReadtime, formatDate, genId,
    REPO_OWNER, REPO_NAME, BASE_PATH,
  };
})();

window.GitHub = GitHub;
