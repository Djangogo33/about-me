/**
 * promo-section.js — About Me (Djangogo33)
 * Injecte une section de promotion croisée vers TutoFacile, Discord, WhatsApp, AITools
 * S'insère avant le footer
 */
(function () {
  'use strict';

  function injectPromoSection() {
    // Trouver le footer
    const footer = document.querySelector('footer');
    if (!footer) return;

    const section = document.createElement('section');
    section.id = 'promo-ecosystem';
    section.setAttribute('aria-label', 'Ecosystem');
    section.innerHTML = `
      <style>
        #promo-ecosystem {
          background: linear-gradient(135deg, #07070d 0%, #1a1a2e 100%);
          border-top: 1px solid rgba(0, 217, 163, 0.2);
          border-bottom: 1px solid rgba(0, 217, 163, 0.2);
          padding: 60px 20px;
          text-align: center;
        }
        #promo-ecosystem .promo-wrap {
          max-width: 900px;
          margin: 0 auto;
        }
        #promo-ecosystem .promo-label {
          display: inline-block;
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #00d9a3;
          margin-bottom: 16px;
          border: 1px solid rgba(0,217,163,.4);
          padding: 4px 14px;
          border-radius: 20px;
        }
        #promo-ecosystem h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.4rem);
          font-weight: 800;
          color: #f0f0f0;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        #promo-ecosystem p {
          color: rgba(240,240,240,.7);
          font-size: 1.05rem;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        #promo-ecosystem .promo-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        #promo-ecosystem .promo-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 24px 16px;
          text-decoration: none;
          color: #f0f0f0;
          transition: all .25s;
          cursor: pointer;
          display: block;
        }
        #promo-ecosystem .promo-card:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(0,217,163,.5);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,.4);
        }
        #promo-ecosystem .promo-card .card-icon { font-size: 2.5rem; margin-bottom: 12px; }
        #promo-ecosystem .promo-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        #promo-ecosystem .promo-card span { font-size: .82rem; opacity: .7; line-height: 1.4; display: block; }
        #promo-ecosystem .promo-cta {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        #promo-ecosystem .cta-btn {
          display: inline-block;
          padding: 11px 24px;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          font-size: .95rem;
          transition: all .2s;
          cursor: pointer;
        }
        #promo-ecosystem .cta-main {
          background: #00d9a3;
          color: #07070d;
        }
        #promo-ecosystem .cta-main:hover { background: #00c494; transform: translateY(-2px); }
        #promo-ecosystem .cta-ghost {
          background: transparent;
          color: #f0f0f0;
          border: 1.5px solid rgba(240,240,240,.4);
        }
        #promo-ecosystem .cta-ghost:hover { border-color: #f0f0f0; transform: translateY(-2px); }
      </style>
      <div class="promo-wrap">
        <span class="promo-label">🌐 Écosystème</span>
        <h2>Mes projets disponibles maintenant</h2>
        <p>Découvrez TutoFacile, rejoignez la communauté Discord et installez l'extension AITools.</p>

        <div class="promo-cards">
          <a class="promo-card" href="https://tutofacile.netlify.app" target="_blank" rel="noopener">
            <div class="card-icon">🎓</div>
            <h3>TutoFacile</h3>
            <span>50+ tutoriels gratuits en bricolage, cuisine, code et jardinage.</span>
          </a>
          <a class="promo-card" href="https://discord.gg/J2ssa2Wkjr" target="_blank" rel="noopener">
            <div class="card-icon">💬</div>
            <h3>Discord</h3>
            <span>Communauté active. Posez vos questions, partagez vos projets.</span>
          </a>
          <a class="promo-card" href="https://whatsapp.com/channel/0029VbCJCg06GcG7aLZPGu1f" target="_blank" rel="noopener">
            <div class="card-icon">📱</div>
            <h3>WhatsApp</h3>
            <span>Chaîne WhatsApp — restez informé des dernières updates.</span>
          </a>
          <a class="promo-card" href="https://github.com/Djangogo33/AITools" target="_blank" rel="noopener">
            <div class="card-icon">🧩</div>
            <h3>AITools Pro</h3>
            <span>Extension Chrome avec détection IA, bloqueur de pubs, et 8 outils.</span>
          </a>
        </div>

        <div class="promo-cta">
          <a class="cta-btn cta-main" href="https://tutofacile.netlify.app" target="_blank" rel="noopener">
            🎓 Explorer TutoFacile →
          </a>
          <a class="cta-btn cta-ghost" href="https://discord.gg/J2ssa2Wkjr" target="_blank" rel="noopener">
            💬 Rejoindre Discord
          </a>
        </div>
      </div>
    `;

    footer.parentNode.insertBefore(section, footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPromoSection);
  } else {
    injectPromoSection();
  }
})();
