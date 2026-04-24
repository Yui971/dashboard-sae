# Alien&lt;3 · Mission Control

Tableau de bord de pilotage pour la **SAÉ 2.02 du BUT MMI** — projet « Alien&lt;3 » (ligne de collectibles : peluches, porte-clés, blind boxes). Guadeloupe → International.

## ✨ Fonctionnalités

- **Suivi de 54 tâches** réparties sur 5 phases (Structuration · Conception · Production · CMS · Soutenance).
- **Progression en temps réel** avec anneau animé, barre de progression et stats par phase.
- **Équipe éditable** (clic sur une carte pour modifier nom + rôle).
- **Deadline éditable** avec compte à rebours en jours.
- **Persistance navigateur** via `localStorage` — rien n'est perdu entre les sessions.
- **Design 21st.dev-inspired** : typographie Instrument Serif + Geist, glass morphism, glow lime, étoiles animées.
- **Responsive** mobile · tablette · desktop.
- **Accessible** (prefers-reduced-motion, focus rings, aria-expanded).

## 📁 Structure

```
sae-dashboard/
├── index.html       # Page principale
├── styles.css       # Styles (variables CSS, animations, responsive)
├── script.js        # Logique + persistance localStorage
└── README.md        # Ce fichier
```

Aucune dépendance à installer : tout est chargé via CDN (Google Fonts + Lucide Icons).

## 🚀 Déploiement

### Option A · Netlify (drag &amp; drop)

1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glisse-dépose le dossier `sae-dashboard` entier.
3. Netlify te donne une URL publique en quelques secondes.

### Option B · Netlify (via Git)

1. Push le dossier sur un repo GitHub.
2. Sur Netlify : **Add new site → Import from Git**.
3. Sélectionne le repo, laisse les réglages par défaut (pas de build command, publish directory = `/` ou le sous-dossier).
4. Deploy.

### Option C · GitHub Pages

1. Crée un repo (par exemple `sae-dashboard`) et pousse les fichiers à la racine.
2. Dans le repo : **Settings → Pages**.
3. Source : **Deploy from a branch** · Branch : `main` · Folder : `/ (root)`.
4. L'URL sera `https://&lt;ton-username&gt;.github.io/sae-dashboard/`.

### Option D · Test en local

Ouvre simplement `index.html` dans ton navigateur.
Ou, pour un vrai serveur local :

```bash
# Python 3
python3 -m http.server 8000

# Puis ouvre http://localhost:8000
```

## 🔧 Personnalisation

- **Changer les tâches** → `script.js`, constante `PHASES`.
- **Changer les livrables** → `script.js`, constante `LIVRABLES`.
- **Changer l'équipe par défaut** → `script.js`, constante `DEFAULT_TEAM`.
- **Changer la deadline par défaut** → `script.js`, constante `DEFAULT_DEADLINE`.
- **Changer la couleur d'accent** → `styles.css`, rechercher `#c4f042`.

## 🗝️ Données locales

Tout est stocké sous les clés suivantes dans `localStorage` du navigateur :

- `sae-tasks-v1` — tâches cochées
- `sae-team-v1` — équipe
- `sae-deadline-v1` — deadline
- `sae-expanded-v1` — phase ouverte

Pour repartir de zéro : bouton **Reset tâches** en bas de page, ou vider le localStorage via les DevTools.

---

*IUT Guadeloupe · BUT MMI · 2025–2026*
