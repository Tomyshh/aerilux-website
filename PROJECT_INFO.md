# Aerilux Website

## Overview
This is a modern, responsive website for Aerilux - a revolutionary AI-powered pigeon deterrent system. The site features a sleek design inspired by Apple and Samsung, with smooth animations and transitions.

## Technology Stack
- React 18 with TypeScript
- Styled Components for styling
- Framer Motion for animations
- Axios for API calls
- React Intersection Observer for scroll animations

## Features Implemented

### Frontend
- **Hero Section**: Eye-catching landing with animated background and CTAs
- **Features Grid**: Showcases 6 key product benefits with icons
- **Product Showcase**: Detailed product information with specifications
- **Technology Section**: Highlights the AI technology with statistics
- **Pricing Plans**: Three-tier pricing with purchase functionality
- **Responsive Navigation**: Fixed navbar with scroll effects
- **Footer**: Complete with links and social media

### Backend Preparation
The frontend is ready to connect to a backend API with the following services:
- Product management
- Order processing with inventory updates
- Payment processing integration
- User management
- Real-time inventory tracking

## Design Highlights
- Dark theme with high contrast
- Smooth animations on scroll
- Gradient text effects
- Glass morphism effects
- Mobile-responsive design
- Modern typography (Inter font)

## To Run the Project

### Méthode rapide (recommandée)
```bash
./start.sh
```

Le script `start.sh` va automatiquement :
- Installer les dépendances si nécessaire
- Créer le fichier `.env` à partir de `env.example`
- Démarrer le serveur de développement

### Méthode manuelle
1. Installer les dépendances: `npm install`
2. Copier `env.example` vers `.env` et mettre à jour les valeurs si nécessaire
3. Démarrer le serveur: `npm start`

Le site sera accessible sur http://localhost:3000 (ou le prochain port disponible)

## Folder Structure
```
src/
├── components/     # React components
├── services/       # API services
├── types/          # TypeScript types
├── hooks/          # Custom React hooks
├── styles/         # Global styles
└── utils/          # Utility functions
```

## Next Steps for Backend
1. Set up Node.js/Express server
2. Implement database (MongoDB/PostgreSQL)
3. Create REST API endpoints
4. Integrate payment gateway (Stripe)
5. Implement inventory management
6. Add authentication system

## Customization
- Replace placeholder images in components
- Update colors in CSS variables
- Modify content in component files
- Add real product images and videos
- Integrate with actual backend API 