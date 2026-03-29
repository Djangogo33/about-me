# 🚀 Portfolio — Djangogo33

Site portfolio multi-fichiers avec système de blog administrable via GitHub API.

## 📁 Structure

```
portfolio/
├── index.html              ← Site public
├── data/posts.json         ← Articles du blog
├── admin/index.html        ← Interface admin
├── css/                    ← Feuilles de style séparées
├── js/
│   ├── main.js             ← Interactions & navigation
│   ├── blog.js             ← Rendu public du blog
│   ├── auth.js             ← Auth SHA-256 + session token
│   └── github.js           ← GitHub API (lecture/écriture)
└── assets/avatar.png
```

## 🔐 Admin

URL : `https://djangogo33.github.io/admin/`

Identifiants par défaut :
- Identifiant : `djangogo33`
- Mot de passe : `Djangogo33!Admin2026`

> ⚠️ CHANGE LE MOT DE PASSE avant de déployer ! (voir ci-dessous)

## 🔑 GitHub Token (requis pour sauvegarder)

1. https://github.com/settings/tokens/new
2. Note : `Blog Admin` — Scope : **repo** — Durée : 1 an
3. Saisis le token à chaque connexion admin (stocké en sessionStorage uniquement)

## ✏️ Changer le mot de passe

1. https://emn178.github.io/online-tools/sha256.html
2. Tape ton nouveau mot de passe → copie le hash SHA-256
3. Dans `js/auth.js` remplace `ADMIN_PASS_HASH` et `TOKEN_SECRET`

## 🔧 Config GitHub (js/github.js)

```js
const REPO_OWNER = 'Djangogo33';
const REPO_NAME  = 'djangogo33.github.io';
const FILE_PATH  = 'data/posts.json';
```

## 🚀 Déploiement GitHub Pages

1. Repo nommé `djangogo33.github.io`
2. Upload tous les fichiers
3. Settings → Pages → Source : main branch / root
