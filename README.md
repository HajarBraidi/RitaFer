# RitaFer Interactive

Plateforme web de vente et de gestion de matériaux de construction, qui relie les clients, les fournisseurs et l'administrateur.

Projet réalisé pendant mon stage de 1re année chez RitaFer à Meknès (juillet - août 2025).

## Fonctionnalités

**Client**
- Inscription, connexion et réinitialisation du mot de passe
- Consultation du catalogue de produits classés par famille (gamme des produits)
- Passage de commande auprès d'un fournisseur
- Génération automatique du bon de commande au format PDF

**Fournisseur**
- Réception et suivi des commandes, avec indication des nouvelles commandes non vues
- Statistiques de ventes sous forme de graphiques
- Accès aux bons de commande (documents PDF)
- Gestion du profil

**Administrateur**
- Tableau de bord : nombre de clients, de fournisseurs, de commandes et évolution des commandes
- Gestion des produits (ajout, modification, suppression)
- Gestion des utilisateurs
- Gestion du profil

## Technologies

- **Frontend** : React, React Router, Tailwind CSS, Axios, Recharts (graphiques), jsPDF et jsPDF-AutoTable (bons de commande)
- **Backend** : Node.js, Express
- **Base de données** : MongoDB avec Mongoose
- **Sécurité** : authentification par JWT, mots de passe hachés avec bcrypt, rôles (admin, client, fournisseur)
- **Fichiers** : Multer pour l'envoi des PDF et des images

## Structure du projet

```
RitaFer/
├── backend/
│   ├── controllers/      logique d'authentification
│   ├── models/           User, Order, produits (schémas Mongoose)
│   ├── routes/           auth, users, produits, commandes, fournisseurs, admin
│   ├── uploads/          bons de commande et images
│   ├── createAdmin.js    création du compte administrateur
│   ├── seedProduits.js   insertion des produits de départ
│   └── server.js
└── frontend/
    └── src/
        ├── components/   en-tête et barres latérales (admin, fournisseur)
        └── pages/        pages client, fournisseur et administrateur
```

## API principale

| Route | Rôle |
|---|---|
| `/api/auth` | inscription, connexion, réinitialisation du mot de passe |
| `/api/users` | gestion des utilisateurs |
| `/api/produits` | catalogue de produits |
| `/api/orders` | création des commandes et génération des PDF |
| `/api/fournisseurs` | profil, ventes et commandes d'un fournisseur |
| `/api/admin` | statistiques et gestion par l'administrateur |

## Installation

Prérequis : Node.js et MongoDB installés en local.

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/HajarBraidi/RitaFer.git
   cd RitaFer
   ```
2. Backend :
   ```bash
   cd backend
   npm install
   ```
   Créer un fichier `backend/.env` :
   ```
   MONGO_URI=mongodb://localhost:27017/ritaferdb
   JWT_SECRET=une_cle_secrete
   ```
   Puis créer l'administrateur, ajouter les produits et lancer le serveur (port 5000) :
   ```bash
   node createAdmin.js
   node seedProduits.js
   node server.js
   ```
3. Frontend :
   ```bash
   cd ../frontend
   npm install
   ```
   Créer un fichier `frontend/.env` :
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
   Puis lancer l'application :
   ```bash
   npm start
   ```

Remarque : l'origine autorisée par CORS est définie dans `backend/server.js`. Il faut l'adapter à l'adresse du frontend.

## Auteure

Hajar Braidi, élève ingénieure à l'ENSIAS
