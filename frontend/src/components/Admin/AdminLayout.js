// components/Admin/Dashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Produits from './CRUDProduits'; 
import Utilisateurs from './CRUDUtilisateurs'; 
import Commandes from './CRUDCommandes'; 
import Categories from './CRUDCategories'; 
import Avis from './CRUDAvis'; 
import Adresses from './CRUDAdresses'; 

const Dashboard = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '260px', padding: '20px', flex: 1 }}>
                <h1>Tableau de bord Admin</h1>
                
                <Routes>
                    <Route path="produits" element={<Produits />} />
                    <Route path="utilisateurs" element={<Utilisateurs />} />
                    <Route path="commandes" element={<Commandes />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="avis" element={<Avis />} />
                    <Route path="adresses" element={<Adresses />} />
                </Routes>

                <nav>
                    <ul>
                        <li><Link to="produits">Gestion des Produits</Link></li>
                        <li><Link to="utilisateurs">Gestion des Utilisateurs</Link></li>
                        <li><Link to="commandes">Gestion des Commandes</Link></li>
                        <li><Link to="categories">Gestion des Catégories</Link></li>
                        <li><Link to="avis">Gestion des Avis</Link></li>
                        <li><Link to="adresses">Gestion des Adresses</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Dashboard;
