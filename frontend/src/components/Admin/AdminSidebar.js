import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faUsers, faClipboardList, faTag, faComments, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
    const [activeMenu, setActiveMenu] = useState(null); 

    const handleToggle = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <nav className="admin-sidebar">
            <div className="sidebar-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('products')}
                        >
                            <FontAwesomeIcon icon={faBoxes} className="sidebar-icon" />
                            Gestion des Produits
                        </button>
                        {activeMenu === 'products' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="produits">Voir Produits</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="ajouter-produit">Ajouter Produit</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('users')}
                        >
                            <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
                            Gestion des Utilisateurs
                        </button>
                        {activeMenu === 'users' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="utilisateurs">Voir Utilisateurs</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="ajouter-utilisateur">Ajouter Utilisateur</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('orders')}
                        >
                            <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
                            Gestion des Commandes
                        </button>
                        {activeMenu === 'orders' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="commandes">Voir Commandes</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('categories')}
                        >
                            <FontAwesomeIcon icon={faTag} className="sidebar-icon" />
                            Gestion des Catégories
                        </button>
                        {activeMenu === 'categories' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="categories">Voir Catégories</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="ajouter-categorie">Ajouter Catégorie</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('reviews')}
                        >
                            <FontAwesomeIcon icon={faComments} className="sidebar-icon" />
                            Gestion des Avis
                        </button>
                        {activeMenu === 'reviews' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="avis">Voir Avis</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="nav-item">
                        <button 
                            className="nav-link sidebar-toggle" 
                            onClick={() => handleToggle('addresses')}
                        >
                            <FontAwesomeIcon icon={faAddressBook} className="sidebar-icon" />
                            Gestion des Adresses
                        </button>
                        {activeMenu === 'addresses' && (
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" to="adresses">Voir Adresses</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminSidebar;
