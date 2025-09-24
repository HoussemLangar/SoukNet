# 🛍️ SoukNet

SoukNet est une application web e-commerce moderne construite avec **React (frontend)**, **Node.js/Express (backend)** et intégrée avec **Firebase** et **Azure Functions** pour la gestion et le déploiement.

## 🚀 Fonctionnalités

- ✅ Interface utilisateur moderne et responsive (React)
- ✅ Gestion des catégories et produits
- ✅ API backend avec Express.js
- ✅ Envoi d'e-mails et gestion Firebase
- ✅ Déploiement via Firebase Hosting et Azure Functions
- ✅ Configuration CI/CD avec GitHub Actions

---

## 📂 Structure du projet

```
SoukNet-main/
│── frontend/ (React - Create React App)
│── backend/ (Express.js, services, routes)
│   ├── routes/
│   ├── services/
│   └── server.js
│── .github/workflows/ (CI/CD GitHub Actions)
│── firebase.json
│── package.json
│── README.md
```

---

## ⚙️ Installation & Lancement

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/username/SoukNet.git
cd SoukNet-main
```

### 2️⃣ Installer les dépendances
#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3️⃣ Lancer en développement
#### Frontend (React)
```bash
npm start
```
Accessible sur [http://localhost:3000](http://localhost:3000)

#### Backend (Express)
```bash
node server.js
```
Accessible sur [http://localhost:5000](http://localhost:5000)

---

## 🌐 Déploiement

### Firebase Hosting
- Le frontend est déployé avec **Firebase Hosting**  
- Configurations dans `firebase.json`

### Azure Functions
- Le backend est déployé via **Azure Functions**  
- Fichiers dans `/backend/azure`

### GitHub Actions
- CI/CD automatisé avec workflows dans `.github/workflows`

---

## 🛠️ Technologies Utilisées

- **Frontend** : React, JSX, CSS
- **Backend** : Node.js, Express.js
- **Base de données** : Firebase
- **Cloud Functions** : Azure Functions
- **Outils** : GitHub Actions, Firebase CLI

---

## 👨‍💻 Auteur

Projet développé par **Houssem LANGAR**  
📧 Contact : houssemlangar3@gmail.com

---

## 📜 Licence

Ce projet est sous licence **MIT** – libre à l’utilisation et modification.
