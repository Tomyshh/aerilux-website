#!/bin/bash

echo "==================================="
echo "Aerilux Website - Démarrage"
echo "==================================="
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Erreur lors de l'installation des dépendances."
        exit 1
    fi
    echo ""
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "Création du fichier .env à partir de env.example..."
    cp env.example .env
    echo "Fichier .env créé. Veuillez le configurer si nécessaire."
    echo ""
fi

echo "Démarrage du serveur de développement..."
echo "Le site sera accessible sur http://localhost:3000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo "==================================="
echo ""

# Démarrer le serveur
npm start
