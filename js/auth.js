/* ============================================
   auth.js — Authentification admin sécurisée
   SHA-256 + token de session signé + expiration

   ⚠️  PERSONNALISATION OBLIGATOIRE :
   1. Va sur https://emn178.github.io/online-tools/sha256.html
   2. Tape ton mot de passe → copie le hash
   3. Remplace ADMIN_PASS_HASH ci-dessous
   4. Remplace TOKEN_SECRET par une chaîne aléatoire
      (ex: mélange de lettres/chiffres, 32+ caractères)
      NE JAMAIS mettre un vrai token GitHub ici !
   ============================================ */

const Auth = (() => {

  const ADMIN_USER       = 'djangogo33';
  /* SHA-256 de "Djangogo33!Admin2026" */
  const ADMIN_PASS_HASH  = '692ada71d366a84b6a441708411824b66edc1ca0f8bf857a56cda1777af1f04d';
  /* Chaîne aléatoire secrète — PAS un token GitHub ! */
  const TOKEN_SECRET     = 'dj33-xK9mP2nQvR7wL4sT6uY8zA1cF0bE5hJ3kM';
  const SESSION_DURATION = 24 * 60 * 60 * 1000;
  const SESSION_KEY      = 'dj33_admin_session';

  async function sha256(message) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function generateToken(username) {
    const expires   = Date.now() + SESSION_DURATION;
    const payload   = `${username}:${expires}`;
    const signature = await sha256(payload + TOKEN_SECRET);
    return btoa(JSON.stringify({ payload, signature, expires }));
  }

  async function verifyToken(raw) {
    try {
      const { payload, signature, expires } = JSON.parse(atob(raw));
      if (Date.now() > expires) return false;
      return await sha256(payload + TOKEN_SECRET) === signature;
    } catch { return false; }
  }

  return {
    async login(username, password) {
      if (username.toLowerCase() !== ADMIN_USER) return false;
      if (await sha256(password) !== ADMIN_PASS_HASH) return false;
      sessionStorage.setItem(SESSION_KEY, await generateToken(username));
      return true;
    },
    async isAuthenticated() {
      const token = sessionStorage.getItem(SESSION_KEY);
      return token ? verifyToken(token) : false;
    },
    logout() { sessionStorage.removeItem(SESSION_KEY); },
    sha256,
  };
})();

window.Auth = Auth;
