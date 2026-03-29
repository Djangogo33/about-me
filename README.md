# 🚀 Portfolio — Djangogo33

Site portfolio personnel, multi-fichiers, prêt à déployer sur GitHub Pages.

## 📁 Structure

```
portfolio/
├── index.html              # Page principale
├── css/
│   ├── variables.css       # Design tokens (couleurs, fonts, espacements)
│   ├── base.css            # Reset, blobs, conteneurs, boutons, utilitaires
│   ├── nav.css             # Barre de navigation fixe + menu mobile
│   ├── sections.css        # Styles de chaque section (hero, about, projets...)
│   └── animations.css      # Classes d'animation au scroll
├── js/
│   ├── main.js             # Navigation, scroll, terminal, interactions
│   └── blog.js             # Données & rendu des articles de blog
├── assets/
│   └── (images à ajouter)
└── README.md
```

## ✅ À personnaliser

### 1. Photo de profil
Ajoute ton image dans `assets/` puis dans `index.html` remplace :
```html
<!-- dans #about-avatar -->
<img src="assets/photo.jpg" alt="Djangogo33">
```

### 2. Lien WhatsApp
Dans `index.html`, remplace `[WHATSAPP_LIEN]` par ton lien `wa.me/...`.
Il apparaît 2 fois (section about + section contact).

### 3. Lien extension Chrome Web Store
Quand ton extension sera publiée sur le Chrome Web Store, décommente
les boutons avec `[EXTENSION_LIEN]` et remplace par l'URL réelle.

### 4. Durée de coding
Dans la chip "⏱️ Dev depuis ~2 ans", ajuste si besoin.

### 5. Articles de blog
Édite le tableau `BLOG_POSTS` dans `js/blog.js` pour ajouter / modifier tes articles.

## 🚀 Déployer sur GitHub Pages (gratuit)

1. Crée un repo GitHub nommé **`djangogo33.github.io`**
2. Upload tous les fichiers (en respectant la structure)
3. Va dans Settings → Pages → Source : `main branch / root`
4. Ton site sera visible sur `https://djangogo33.github.io` 🎉

## 🛠️ Déployer sur Netlify (aussi gratuit)

1. Push le dossier sur GitHub
2. Va sur [netlify.com](https://netlify.com) → New site from Git
3. Sélectionne le repo → Deploy !
