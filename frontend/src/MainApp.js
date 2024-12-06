import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Layout from "./components/Layout";
import Avis from "./components/Avis";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import ProductsPage from "./components/ProductsPage"; 
import ProductDetailPage from "./components/ProductDetailPage"; 
import CategoryProductsPage from './components/CategoryProductsPage';
import AddProductPage from './components/AddProductPage';
import MyProductsPage from "./components/MyProductsPage";
import MyProductDetailsPage from './components/MyProductDetailsPage';
import EditProductPage from './components/EditProductPage';
import CartPage from './components/CartPage';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AdressePage from './components/AdressePage';
import PaiementEnLigne from './components/PaiementEnLignePage';
import ConfirmationPage from './components/ConfirmationPage';
import ChoixPaiementPage from './components/ChoixPaiementPage';
import { CartProvider } from './context/CartContext';
import Orders from './components/Orders';
import { AuthProvider } from './context/authContext';
import AccountSettingsPage from './components/AccountSettingsPage';
import PrivateRoute from './components/PrivateRoute'; 
import Dashboard from './components/Admin/Dashboard';
import DemandeAjoutCategorie from './components/DemandeAjoutCategorie'


function MainApp() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userEmail = user.email;
                const db = getFirestore();
                const usersRef = collection(db, 'Utilisateurs');
                const q = query(usersRef, where('email', '==', userEmail));
                
                getDocs(q).then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        const username = userData.nom_utilisateur || user.email;
                        const role = userData.role || "User"; 
                        setUser({ ...user, username, role });
                    }
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('user'); 
            window.location.reload();
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
    <AuthProvider>
    <CartProvider>
        <Router>
            <Layout user={user} setUser={setUser} onLogout={handleLogout}>
                <Routes>
                    <Route path="/" element={<App user={user} setUser={setUser} />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset" element={<ResetPassword />} />
                    <Route path="/reviews" element={<Avis />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/my-products" element={<MyProductsPage user={user} />} />
                    <Route path="/product-my-page/:id" element={<MyProductDetailsPage />} />
                    <Route path="/edit-product/:id" element={<EditProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/adresse" element={<AdressePage />} />
                    <Route path="/paiement" element={<PaiementEnLigne/>} />
                    <Route path="/choix-methode" element={<ChoixPaiementPage/>} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/orders" element={<Orders user={user} />} />
                    <Route path="/parametre" element={<AccountSettingsPage user={user} />} />
                    <Route path="/add-category-request" element={<DemandeAjoutCategorie user={user} />} />
                    <Route 
                    path="/dashboard/*" 
                    element={
                        <PrivateRoute user={user} setUser={setUser} role="Admin">
                            <Dashboard />
                        </PrivateRoute>
                    } 
                    />
                </Routes>
            </Layout>
        </Router>
    </CartProvider>
    </AuthProvider>
    );
}

export default MainApp;
