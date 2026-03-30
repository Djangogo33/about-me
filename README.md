# 🚀 Portfolio — Djangogo33
Site : https://djangogo33.github.io/about-me/
Admin : https://djangogo33.github.io/about-me/admin/

## 📁 Structure du repo `djangogo33.github.io`

```
djangogo33.github.io/
└── about-me/                   ← tout le portfolio est ici
    ├── index.html
    ├── data/posts.json         ← articles du blog
    ├── admin/index.html        ← interface admin
    ├── assets/
    │   ├── avatar.png
    │   └── favicon.svg
    ├── css/
    └── js/
        ├── main.js
        ├── blog.js
        ├── auth.js             ← hash SHA-256 du mdp
        └── github.js           ← config REPO_NAME + BASE_PATH
```

## ⚠️ Sécurité — À FAIRE AVANT DE DÉPLOYER

### 1. Révoquer l'ancien token (URGENT si déjà poussé sur GitHub)
→ https://github.com/settings/tokens → supprimer le token exposé

### 2. Créer un nouveau token
1. https://github.com/settings/tokens/new
2. Note : `Blog Admin Portfolio`
3. Expiration : 1 an
4. Scope : cocher **repo** uniquement
5. Copier le token (affiché une seule fois)

### 3. Changer le mot de passe admin dans `js/auth.js`
1. Aller sur https://emn178.github.io/online-tools/sha256.html
2. Taper ton nouveau mot de passe → copier le hash
3. Remplacer `ADMIN_PASS_HASH` dans `js/auth.js`
4. Remplacer `TOKEN_SECRET` par une chaîne aléatoire perso
   (ex: `mon-site-dj33-secret-2026-xYz789`)
   **Ne jamais mettre un token GitHub comme TOKEN_SECRET !**

## 🔧 Config GitHub (js/github.js)
```js
const REPO_OWNER = 'Djangogo33';
const REPO_NAME  = 'djangogo33.github.io'; // Nom du repo (pas le chemin !)
const BASE_PATH  = 'about-me';             // Sous-dossier dans le repo
```

## 🔐 Identifiants par défaut
- Utilisateur : `djangogo33`
- Mot de passe : `Djangogo33!Admin2026`
  → À changer immédiatement via le hash SHA-256 !

## 🚀 Déploiement
Le fichier `.github/workflows/static.yml` est déjà configuré.
Push sur `main` → GitHub Pages se met à jour automatiquement.
