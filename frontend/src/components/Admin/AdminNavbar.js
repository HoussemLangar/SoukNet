import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faUserAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ user, onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#384454' }}>
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
                    <img src="/favicon.ico" alt="SoukNet Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    SoukNet
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} /> {user.username}
                                </span>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to='/dashboard/parametreAdmin'>
                                            <FontAwesomeIcon icon={faUserAlt} /> Paramètre du compte
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <FontAwesomeIcon icon={faSignInAlt} /> Connexion
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
