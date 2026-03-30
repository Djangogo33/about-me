/* ============================================================
   auth.js — Authentification admin sécurisée
   ============================================================

   POUR CHANGER TON MOT DE PASSE :
   1. Va sur https://emn178.github.io/online-tools/sha256.html
   2. Tape ton nouveau mot de passe
   3. Copie le hash (64 caractères) et remplace ADMIN_PASS_HASH

   POUR TOKEN_SECRET :
   ⚠️  C'est une phrase secrète que TU INVENTES toi-même.
       Exemple : "monblog-secret-2026-perso"
       CE N'EST PAS ton token GitHub (ghp_xxx...)
       Ne jamais mettre un ghp_ ici.
   ============================================================ */

const Auth = (() => {

  const ADMIN_USER      = 'djangogo33';
  /* Hash SHA-256 du mot de passe "Djangogo33!Admin2026" */
  const ADMIN_PASS_HASH = '3317aa538c37cc0d073839ea8d98438e78c5eb32e1119b5e4e22ff0992bc91af';
  /* Phrase inventée pour signer les sessions — PAS un token GitHub ! */
  const TOKEN_SECRET    = 'vive_les_vacances';

  const SESSION_DURATION = 24 * 60 * 60 * 1000;
  const SESSION_KEY      = 'dj33_admin_session';

  async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  async function makeToken(user) {
    const exp = Date.now() + SESSION_DURATION;
    const pay = `${user}:${exp}`;
    const sig = await sha256(pay + TOKEN_SECRET);
    return btoa(JSON.stringify({ pay, sig, exp }));
  }

  async function checkToken(raw) {
    try {
      const { pay, sig, exp } = JSON.parse(atob(raw));
      if (Date.now() > exp) return false;
      return await sha256(pay + TOKEN_SECRET) === sig;
    } catch { return false; }
  }

  return {
    async login(user, pass) {
      if (user.toLowerCase() !== ADMIN_USER) return false;
      if (await sha256(pass) !== ADMIN_PASS_HASH) return false;
      sessionStorage.setItem(SESSION_KEY, await makeToken(user));
      return true;
    },
    async isAuthenticated() {
      const t = sessionStorage.getItem(SESSION_KEY);
      return t ? checkToken(t) : false;
    },
    logout() { sessionStorage.removeItem(SESSION_KEY); },
    sha256,
  };
})();

window.Auth = Auth;
