# 🛍️ SoukNet

SoukNet is a modern e-commerce web application built with **React (frontend)**, **Node.js/Express (backend)**, and integrated with **Firebase** and **Azure Functions** for management and deployment.

## 🚀 Features

- ✅ Modern and responsive UI (React)  
- ✅ Category and product management  
- ✅ Backend API with Express.js  
- ✅ Email sending and Firebase integration  
- ✅ Deployment via Firebase Hosting and Azure Functions  
- ✅ CI/CD configuration with GitHub Actions  

---

## 📂 Project Structure

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

## ⚙️ Installation & Run

### 1️⃣ Clone the project
```bash
git clone https://github.com/username/SoukNet.git
cd SoukNet-main
```

### 2️⃣ Install dependencies
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

### 3️⃣ Run in development
#### Frontend (React)
```bash
npm start
```
Available at [http://localhost:3000](http://localhost:3000)

#### Backend (Express)
```bash
node server.js
```
Available at [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment

### Firebase Hosting
- The frontend is deployed with **Firebase Hosting**  
- Configurations in `firebase.json`

### Azure Functions
- The backend is deployed via **Azure Functions**  
- Files located in `/backend/azure`

### GitHub Actions
- Automated CI/CD with workflows in `.github/workflows`

---

## 🛠️ Technologies Used

- **Frontend**: React, JSX, CSS  
- **Backend**: Node.js, Express.js  
- **Database**: Firebase  
- **Cloud Functions**: Azure Functions  
- **Tools**: GitHub Actions, Firebase CLI  

---

## 👨‍💻 Author

Project developed by **Houssem LANGAR**  
📧 Contact: houssemlangar3@gmail.com  

---

## 📜 License

This project is licensed under the **MIT License** – free to use and modify.  
