import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; 
import { AuthProvider } from '../../context/authContext';
import AdminSidebar from './AdminSidebar';
import VoirProduits from './Product';
import AjouterProduit from './AddProduct';
import EditProduct from './EditProduct';
import Utilisateurs from './ViewUsers'; 
import Commandes from './Commandes'; 
import Categories from './Categories'; 
import CategoryForm from './CategoryForm'; 
import Avis from './Avis'; 
import Adresses from './Adresses'; 
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import AccountSettingsAdmin from './AccountSettingsAdmin';
import AjouterUtilisateurs from './AddUser';
import ModifierUtilisateurs from './ModifyUser';
import EditCategory from './EditCategory';


const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
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
            <AdminNavbar user={user} setUser={setUser} onLogout={handleLogout} />
            <div className="dashboard-container">
                <AdminSidebar />
                <div className="dashboard-content">
                <Routes>
                    <Route path="/" element={
                        <iframe 
                            title="dashboard_souknet" 
                            width="100%" 
                            height="100%" 
                            src="https://app.powerbi.com/view?r=eyJrIjoiZGEwNWUyNDQtNWQ4NS00ODgxLTk1MzUtYjgwMWU1OTEyYmNiIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9" 
                            frameBorder="0" 
                            allowFullScreen={true}
                        />
                    } />
                    <Route path="/parametreAdmin" element={<AccountSettingsAdmin />} />
                    <Route path="/produits" element={<VoirProduits />} />
                    <Route path="/ajouter-produit" element={<AjouterProduit />} />
                    <Route path="/modifier/:id" element={<EditProduct />} />
                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route path="/ajouter-utilisateur" element={<AjouterUtilisateurs />} />
                    <Route path="/modifier-utilisateur/:id" element={<ModifierUtilisateurs />} />
                    <Route path="/commandes" element={<Commandes />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/ajouter-categorie" element={<CategoryForm />} />
                    <Route path="/modifier-categorie/:id" element={ <EditCategory /> } />                    
                    <Route path="/avis" element={<Avis />} />
                    <Route path="/adresses" element={<Adresses />} />
                </Routes>

                    </div>
                </div>
        </AuthProvider>
    );
};

export default Dashboard;
