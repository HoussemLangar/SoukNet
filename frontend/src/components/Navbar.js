import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faHome, faBox, faShoppingCart, faComments, faUserPlus, faSignOutAlt, faPlus, faThList, faUserAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Navbar = ({ user, onLogout }) => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesCollection = collection(db, "Categories"); 
                const categoriesSnapshot = await getDocs(categoriesCollection);
                const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCategories(categoriesList);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddProductClick = () => {
        if (!user) {
            navigate("/login"); 
        } else {
            navigate("/add-product"); 
        }
    };

    const handleMyProductsClick = () => {
        if (!user) {
            navigate("/login"); 
        } else {
            navigate("/my-products"); 
        }
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#384454' }}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/favicon.ico" alt="SoukNet Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    SoukNet
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <FontAwesomeIcon icon={faHome} /> Accueil
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link 
                                className="nav-link dropdown-toggle" 
                                to="/products" 
                                id="navbarDropdown" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <FontAwesomeIcon icon={faBox} /> Produits
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <button className="dropdown-item" onClick={handleMyProductsClick}>
                                        <FontAwesomeIcon icon={faThList} /> Mes Produits
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleAddProductClick}>
                                        <FontAwesomeIcon icon={faPlus} /> Ajouter Mon produit
                                    </button>
                                </li>
                                <li className="dropdown-divider"></li>
                                <li>
                                    <Link className="dropdown-item" to="/products">
                                        <FontAwesomeIcon icon={faThList} /> Tous les Produits
                                    </Link>
                                </li>
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <Link className="dropdown-item" to={`/category/${category.id}`}>
                                            <FontAwesomeIcon icon={faThList} /> {category.nom}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link className="dropdown-item" to="/add-category-request">
                                        <FontAwesomeIcon icon={faPlusCircle} /> Demande d'ajout d'une catégorie
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link 
                                className="nav-link dropdown-toggle" 
                                to="/cart" 
                                id="navbarDropdownCart" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <FontAwesomeIcon icon={faShoppingCart} /> Panier
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownCart">
                                <li><Link className="dropdown-item" to="/cart">Voir le Panier</Link></li>
                                <li><Link className="dropdown-item" to="/orders">Commandes</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/reviews">
                                <FontAwesomeIcon icon={faComments} /> Avis
                            </Link>
                        </li>
                        {user ? (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={faUserPlus} /> {user.username} <FontAwesomeIcon icon={faSignOutAlt} />
                                </span>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to='/parametre'>
                                            <FontAwesomeIcon icon={faUserAlt} /> Paramétre du compte
                                        </Link>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={onLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to="/login"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FontAwesomeIcon icon={faSignInAlt} /> Connexion
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/login">
                                            <FontAwesomeIcon icon={faSignInAlt} /> Connexion
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/register">
                                            <FontAwesomeIcon icon={faUserPlus} /> Créer un compte
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
