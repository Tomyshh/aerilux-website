# Aerilux Website

Site web moderne et responsive pour Aerilux - un système révolutionnaire de dissuasion de pigeons alimenté par l'IA.

## 🚀 Démarrage rapide

### Option 1 : Script automatique (recommandé)
```bash
./start.sh
```

### Option 2 : Commandes manuelles
```bash
# Installer les dépendances
npm install

# Créer le fichier .env (si nécessaire)
cp env.example .env

# Démarrer le serveur de développement
npm start
```

Le site sera accessible sur **http://localhost:3000**

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🛠️ Technologies utilisées

- React 18 avec TypeScript
- Styled Components pour le styling
- Framer Motion pour les animations
- Axios pour les appels API
- React Router pour la navigation
- Supabase pour le backend

## 📁 Structure du projet

```
src/
├── components/     # Composants React
├── pages/         # Pages de l'application
├── services/      # Services API
├── types/         # Types TypeScript
├── hooks/         # Hooks React personnalisés
├── styles/        # Styles globaux
└── utils/         # Fonctions utilitaires
```

## 🔧 Configuration

Le fichier `.env` contient les variables d'environnement nécessaires :
- `REACT_APP_API_URL` : URL de l'API backend
- `REACT_APP_STRIPE_PUBLIC_KEY` : Clé publique Stripe (pour les paiements)
- `REACT_APP_GA_ID` : ID Google Analytics (optionnel)
- `REACT_APP_ENV` : Environnement (development/production)

## 📝 Scripts disponibles

- `npm start` : Démarre le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm test` : Lance les tests
- `npm run eject` : Éjecte la configuration (irréversible)

## 🌐 Déploiement

Le projet est configuré pour être déployé sur Render (voir `render.yaml`).

Pour plus d'informations, consultez `PROJECT_INFO.md`.

