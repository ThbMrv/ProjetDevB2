# 💼 ProjetDevB2 — Application Investisseur / Créateur de pitch decks

## ⚙️ Prérequis
- Node.js (v18+ recommandé)
- PostgreSQL (avec une base nommée `investnet`)
- pnpm ou npm ou yarn
- Un fichier `.env` configuré (voir ci-dessous)

---

## 📦 Installation

```bash
# 1. Cloner le repo
git clone <url-du-projet>
cd ProjetDevB2/backend

# 2. Installer les dépendances
npm install
```

---

## 🧪 Fichier .env (à placer dans `/backend/.env`)

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Mot de passe défini dans votre postegre
DB_NAME=investnet
```

---

## 🛠️ Compilation (TypeScript)

```bash
# Compiler les fichiers TS → JS dans /dist
npx tsc
```

---

## 🗄️ Lancer les migrations TypeORM

```bash
# Lancer les migrations pour créer les tables dans PostgreSQL
npx typeorm migration:run -d dist/src/data-source.js
```

---

## 🚀 Lancer le serveur en développement

```bash
# Lance l'app NestJS
npm run start:dev
```

---

## 🌍 Accès à l'application

- Interface d'inscription / connexion :  
  [http://localhost:3000/login](http://localhost:3000/login)

---

## 🧹 Commandes utiles

```bash
# Recompiler après un changement
npx tsc

# Supprimer les fichiers JS compilés
rm -rf dist

# Générer une nouvelle migration
npx typeorm migration:create src/migrations/NomDeLaMigration

# Refaire une migration après changement de structure
npx typeorm migration:generate src/migrations/AutoNom
```

---

## ✅ Bon à savoir

- Le fichier `.env` doit être bien rempli sinon la BDD échouera.
- Les **migrations** créent uniquement les **structures**, pas les données.
- Le mot de passe BDD doit être une **chaîne simple** sans erreurs d'encodage (`.env` bien chargé).