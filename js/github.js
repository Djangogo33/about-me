/* ============================================================
   github.js — Lecture/écriture des articles via GitHub API

   COMMENT ÇA MARCHE :
   - Les articles sont dans data/posts.json dans ton repo GitHub
   - L'admin lit et écrit ce fichier via l'API GitHub
   - Le token GitHub PAT est saisi dans le formulaire de login
     et stocké en sessionStorage (disparaît à la fermeture du
     navigateur) — il n'est JAMAIS écrit dans ce fichier

   TON REPO :
   - URL : https://github.com/Djangogo33/about-me
   - Nom : about-me
   - Les fichiers sont à la racine du repo (pas dans un sous-dossier)
   ============================================================ */

const GitHub = (() => {

  /* === Config de ton repo === */
  const REPO_OWNER = 'Djangogo33';
  const REPO_NAME  = 'about-me';        /* Nom exact du repo sur GitHub */
  const FILE_PATH  = 'data/posts.json'; /* Chemin dans le repo */
  const API_BASE   = 'https://api.github.com';
  /* =========================== */

  const TOKEN_KEY = 'dj33_gh_token';

  /* Le token GitHub PAT est stocké en sessionStorage seulement */
  const setToken   = t  => sessionStorage.setItem(TOKEN_KEY, t.trim());
  const getToken   = () => sessionStorage.getItem(TOKEN_KEY) || '';
  const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);
  const hasToken   = () => !!getToken();

  /* Headers pour l'API GitHub */
  function headers() {
    return {
      'Authorization'        : `Bearer ${getToken()}`,
      'Accept'               : 'application/vnd.github+json',
      'Content-Type'         : 'application/json',
      'X-GitHub-Api-Version' : '2022-11-28',
    };
  }

  /* Lire posts.json depuis GitHub */
  async function readPosts() {
    const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await fetch(url, { headers: headers() });

    /* Fichier pas encore créé → tableau vide */
    if (res.status === 404) return { posts: [], sha: null };

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erreur GitHub API ${res.status}`);
    }

    const data  = await res.json();
    /* GitHub renvoie le contenu encodé en base64 */
    const posts = JSON.parse(atob(data.content.replace(/\n/g, '')));
    return { posts, sha: data.sha };
  }

  /* Écrire posts.json sur GitHub (commit automatique) */
  async function writePosts(posts, sha, message) {
    const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    /* Encoder le JSON en base64 pour l'API */
    const content = btoa(unescape(encodeURIComponent(
      JSON.stringify(posts, null, 2)
    )));
    const body = {
      message : message || '📝 Mise à jour des articles',
      content,
      ...(sha ? { sha } : {}), /* sha requis si le fichier existe déjà */
    };
    const res = await fetch(url, {
      method  : 'PUT',
      headers : headers(),
      body    : JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erreur écriture GitHub ${res.status}`);
    }
    return res.json();
  }

  /* Vérifier que le token est valide — retourne le username GitHub ou null */
  async function validateToken() {
    const res = await fetch(`${API_BASE}/user`, { headers: headers() });
    if (!res.ok) return null;
    const user = await res.json();
    return user.login;
  }

  /* Calculer le temps de lecture (200 mots/min) */
  function calcReadtime(html) {
    const text  = html.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  /* Formater une date ISO en "mois année" en français */
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', {
      month : 'long',
      year  : 'numeric',
    });
  }

  /* Générer un ID unique pour un article */
  function genId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 6);
  }

  return {
    setToken, getToken, clearToken, hasToken,
    readPosts, writePosts, validateToken,
    calcReadtime, formatDate, genId,
    REPO_OWNER, REPO_NAME, FILE_PATH,
  };

})();

window.GitHub = GitHub;
