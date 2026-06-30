# Madrassa Quiz — Yassin & Nargis

Application de révision (QCM, vrai/faux, texte à trous, questions ouvertes) pour réviser ensemble les cours de Aqida, avec un profil par personne et une comparaison des résultats.

## Ajouter un nouveau cours

1. Crée un fichier dans `src/data/courses/<matière>/<sous-matière>/cours-X.js` qui exporte un objet module (voir `cours-1.js` comme modèle : `id`, `titre`, `titreArabe`, `description`, `dureeEstimee`, `questions[]`).
2. Types de questions disponibles : `qcm`, `vrai_faux`, `trou`, `ouverte`.
3. Importe et ajoute ce module dans `src/data/registry.js` (dans la bonne matière / sous-matière, ou crée-en une nouvelle).

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Génère le dossier `dist/` prêt à être hébergé (site statique + PWA installable).

## Déploiement

Voir les instructions fournies séparément pour mettre en ligne gratuitement via Netlify et installer l'app sur iPhone ("Ajouter à l'écran d'accueil").
