# Portfolio — Djangogo33

**Site :** https://djangogo33.github.io/about-me  
**Admin :** https://djangogo33.github.io/about-me/admin/  
**Repo :** https://github.com/Djangogo33/about-me

---

## Structure des fichiers dans le repo

```
about-me/                   ← racine du repo
├── index.html              ← page principale du site
├── data/
│   └── posts.json          ← articles du blog (lu par le site)
├── admin/
│   └── index.html          ← interface admin du blog
├── assets/
│   ├── avatar.png          ← photo de profil (renard Minecraft)
│   └── favicon.svg         ← icône dans l'onglet
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── nav.css
│   ├── sections.css
│   └── animations.css
└── js/
    ├── main.js             ← navigation, animations, terminal
    ├── blog.js             ← affichage des articles sur le site
    ├── auth.js             ← vérification du mot de passe admin
    └── github.js           ← lecture/écriture GitHub API
```

---

## 🔐 Sécurité — Ce que tu dois comprendre

### Il y a DEUX types de secrets très différents :

**1. Le TOKEN_SECRET dans `js/auth.js`**
→ C'est une phrase secrète que TU INVENTES
→ Elle sert à signer les sessions de connexion admin
→ Exemple : `"monblog-abc123-perso"`
→ **⚠️ PAS un token GitHub ! Jamais un ghp_...**

**2. Le GitHub PAT (ghp_...)**
→ C'est le vrai token GitHub pour écrire dans le repo
→ Tu le saisis dans le formulaire de login admin
→ Il est stocké en `sessionStorage` (disparaît à la fermeture du navigateur)
→ **Il ne doit JAMAIS être dans le code source**

---

## 🔑 Créer un nouveau GitHub PAT

1. Va sur https://github.com/settings/tokens/new
2. Note : `Blog Admin Portfolio`
3. Expiration : 1 an
4. Scope : coche uniquement **`repo`**
5. Clique `Generate token`
6. **Copie le token** — il s'affiche une seule fois !
7. Stocke-le dans un endroit sûr (ex: notes chiffrées, gestionnaire de mdp)

Ce token tu le saisis dans le formulaire de login admin. Voilà.

---

## ✏️ Changer le mot de passe admin

Le mot de passe par défaut est `Djangogo33!Admin2026`.

Pour le changer :
1. Va sur https://emn178.github.io/online-tools/sha256.html
2. Tape ton nouveau mot de passe dans le champ Input
3. Copie le hash (64 caractères héxadécimaux)
4. Ouvre `js/auth.js`
5. Remplace la valeur de `ADMIN_PASS_HASH` par le hash copié

---

## 🚀 Utiliser l'admin du blog

1. Va sur https://djangogo33.github.io/about-me/admin/
2. Identifiant : `djangogo33`
3. Mot de passe : ton mot de passe
4. GitHub Token : le ghp_ que tu as créé
5. → Tu peux créer, modifier, supprimer des articles
6. → Ctrl+S pour sauvegarder rapidement
7. → "Publier" = visible sur le site, "Brouillon" = caché

---

## ⚙️ Config dans `js/github.js`

```js
const REPO_OWNER = 'Djangogo33';   // Ton pseudo GitHub
const REPO_NAME  = 'about-me';     // Nom exact du repo
const FILE_PATH  = 'data/posts.json'; // Ne pas changer
```
