# 💼 ProjetDevB2 — Application Investisseur / Créateur de pitch decks

## ⚙️ Prérequis

- Node.js (v18+ recommandé)  
- PostgreSQL (avec une base nommée `investnet`)  
- `npm` (ou `pnpm`, ou `yarn`)  
- Un fichier `.env` bien configuré (voir ci-dessous)

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

## 🧪 Fichier `.env` (à placer dans `/backend/.env`)

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<votre_mot_de_passe_postgres>
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

> 💡 Assurez-vous d'avoir compilé avant d'exécuter la migration.

```bash
# 1. Compiler le projet
npx tsc

# 2. Appliquer les migrations pour créer les tables dans PostgreSQL
npx typeorm migration:run -d dist/data-source.js
```

---

## 🚀 Lancer le serveur en développement

```bash
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

# Générer une migration manuelle
npx typeorm migration:create src/migrations/NomDeLaMigration

# Générer automatiquement une migration selon les entités
npx typeorm migration:generate src/migrations/AutoNom -d dist/data-source.js

# Appliquer les migrations (toujours après compilation)
npx typeorm migration:run -d dist/data-source.js
```

---

## ✅ Bon à savoir

- Le fichier `.env` doit être **bien rempli**, sinon la connexion à la BDD échoue.  
- Les **migrations** créent uniquement les **structures**, pas les données.  
- Le mot de passe dans `.env` doit être une **chaîne valide** (pas vide, pas de caractères spéciaux non échappés).
- Le fichier `data-source.ts` est **compilé** en `dist/data-source.js` — assure-toi qu'il est bien généré.