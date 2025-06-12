# 💼 ProjetDevB2 — Plateforme Investisseurs & Créateurs de pitch decks

ProjetDevB2 est une API web backend conçue pour connecter des **créateurs de projets** et des **investisseurs** à travers des offres (pitchs), un système de messagerie, et une authentification sécurisée.  
Le projet est développé en **NestJS** avec **PostgreSQL** comme base de données, et via une **API REST**.

---

## 🔧 Fonctionnalités

- Authentification
- Création, lecture, mise à jour, suppression d’offres
- Système de messagerie entre utilisateurs
- Réserver un rendez-vous
- Faire une offre sur un projet / Accepter OU Refuser l'offre
- Mettre des favoris
- Notifications

---

## ⚙️ Technologies utilisées

- **NestJS** (framework Node.js backend)
- **TypeScript**
- **TypeORM** (ORM + migration SQL)
- **PostgreSQL**
- **JWT & bcrypt** (authentification sécurisée)
- **Swagger** (documentation API)
- **Postman** (test manuel de l’API)

---

## 📁 Structure simplifié du projet

```
ProjetDevB2/
└── backend/
├── src/
│ ├── auth/ # Authentification (login, register, JWT)
│ ├── user/ # Gestion des utilisateurs
│ ├── offer/ # Gestion des offres
│ ├── message/ # Messagerie entre utilisateurs
│ ├── favorite/ # Système de favoris
│ ├── notification/ # Notifications (optionnelles)
│ ├── migrations/ # Migrations de la base (TypeORM)
│ └── main.ts, app.module.ts, etc. # Fichiers principaux NestJS
├── views/ # Templates Handlebars (.hbs)
├── .env # Fichier d’environnement
├── package.json # Dépendances backend
└── README.md # Documentation du projet
```

---

## 🧪 Configuration `.env`

Crée un fichier `.env` à la racine de `/backend` :

````env
Lien relié à Supabase et Render pour héberger le projet
---

## 📦 Installation & lancement

```bash
# Cloner le projet

git clone https://github.com/ThbMrv/ProjetDevB2.git

cd ProjetDevB2/backend

# Installer les dépendances
npm install

# Compiler TypeScript → JavaScript
npx tsc

# Appliquer les migrations (après compilation)
npx typeorm migration:run -d dist/data-source.js

# Lancer le serveur en dev
npm run start:dev
````

---

## 🚀 Accès API

- Swagger : [http://localhost:3000/api](http://localhost:3000/api)
- Exemple de routes :
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /offers`
  - `POST /message`

---

## 🧪 Tests manuels

Toutes les routes ont été **testées via Postman**.  
Chaque fonctionnalité (authentification, CRUD, messagerie) a été validée manuellement avec :

- Envoi de requêtes POST/GET
- Vérification des statuts HTTP
- Vérification des données insérées/modifiées
- Sécurité des tokens JWT

---

## ⚠️ Limitations actuelles

- Pas de tests automatisés (unitaires ou e2e)
- Pas de ESLint ou Prettier configurés
- Pas de CI/CD ni Dockerfile pour le moment

---

## 🏗️ Améliorations possibles (bonus)

| Feature                             | Statut |
| ----------------------------------- | ------ |
| Interface front (React)             | ❌     |
| Dockerisation                       | ❌     |
| CI/CD (GitHub Actions)              | ❌     |
| Tests automatisés (Jest, Supertest) | ❌     |

---

## 👤 Auteur

ThbMrv
PatNwk

---

## ✅ Statut

🟢 Projet fonctionnel — testé manuellement via Postman.
