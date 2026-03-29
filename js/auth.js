/* ============================================
   auth.js — Authentification admin sécurisée
   SHA-256 + token de session signé + expiration
   ============================================ */

const Auth = (() => {

  /* ── Config (à personnaliser) ────────────────
     Génère un hash SHA-256 de ton mot de passe :
     https://emn178.github.io/online-tools/sha256.html
     Remplace les valeurs ci-dessous.
  ─────────────────────────────────────────── */
  const ADMIN_USER        = 'djangogo33';
  /* SHA-256 de "AdminPass2026!" — CHANGE CE MOT DE PASSE */
  const ADMIN_PASS_HASH   = '692ada71d366a84b6a441708411824b66edc1ca0f8bf857a56cda1777af1f04d';
  /* Sel secret pour signer les tokens — CHANGE CETTE VALEUR */
  const TOKEN_SECRET      = 'dj33-secret-salt-2026-xK9mP2nQ';
  const SESSION_DURATION  = 24 * 60 * 60 * 1000; /* 24 heures en ms */
  const SESSION_KEY       = 'dj33_admin_session';

  /* ── SHA-256 via Web Crypto API (natif, sécurisé) ── */
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ── Générer un token de session signé ── */
  async function generateToken(username) {
    const expires = Date.now() + SESSION_DURATION;
    const payload = `${username}:${expires}`;
    const signature = await sha256(payload + TOKEN_SECRET);
    return btoa(JSON.stringify({ payload, signature, expires }));
  }

  /* ── Vérifier un token ── */
  async function verifyToken(raw) {
    try {
      const { payload, signature, expires } = JSON.parse(atob(raw));
      if (Date.now() > expires) return false;
      const expected = await sha256(payload + TOKEN_SECRET);
      return expected === signature;
    } catch {
      return false;
    }
  }

  /* ── API publique ── */
  return {

    /* Tenter un login — retourne true/false */
    async login(username, password) {
      if (username.toLowerCase() !== ADMIN_USER) return false;
      const passHash = await sha256(password);
      if (passHash !== ADMIN_PASS_HASH) return false;
      const token = await generateToken(username);
      sessionStorage.setItem(SESSION_KEY, token);
      return true;
    },

    /* Vérifier si la session courante est valide */
    async isAuthenticated() {
      const token = sessionStorage.getItem(SESSION_KEY);
      if (!token) return false;
      return verifyToken(token);
    },

    /* Déconnexion */
    logout() {
      sessionStorage.removeItem(SESSION_KEY);
    },

    /* Hacher un mot de passe (utilitaire pour générer ADMIN_PASS_HASH) */
    async hashPassword(password) {
      return sha256(password);
    },

    /* Exposer sha256 pour usage interne */
    sha256,
  };

})();

/* Exposer globalement */
window.Auth = Auth;
