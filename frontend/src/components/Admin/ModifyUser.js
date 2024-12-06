import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyUser = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [nomUtilisateur, setNomUtilisateur] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(""); 
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "Utilisateurs", id));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setNomUtilisateur(userData.nom_utilisateur);
                    setEmail(userData.email);
                    setRole(userData.role);
                } else {
                    setErrorMessage("Utilisateur non trouvé");
                }
            } catch (error) {
                setErrorMessage("Erreur lors du chargement de l'utilisateur");
            }
        };
        
        fetchUserData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nomUtilisateur || !email || !role) {
            setErrorMessage("Tous les champs sont requis.");
            return;
        }

        const updatedUser = {
            nom_utilisateur: nomUtilisateur,
            email,
            role,
        };

        try {
            await updateDoc(doc(db, "Utilisateurs", id), updatedUser);
            setSuccessMessage("Utilisateur modifié avec succès !");
            setTimeout(() => {
                navigate('/dashboard/utilisateurs');
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de la modification de l'utilisateur : ", error);
            setErrorMessage("Erreur lors de la modification de l'utilisateur.");
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/utilisateurs');
    };

    return (
        <div className="add-user-container py-5" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
        }}>
            <div className="form-card" style={{
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                width: '100%', 
                maxWidth: '500px'
            }}>
            <h2 className="add-user-title text-center" style={{ marginBottom: '20px' }}>Modifier un Utilisateur</h2>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>} 
            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>} 
            <form onSubmit={handleSubmit} className="add-user-form">
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faUser} /> Nom d'Utilisateur</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={nomUtilisateur} 
                                onChange={(e) => setNomUtilisateur(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                            <input 
                                type="email" 
                                className="input-field" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faLock} /> Mot de Passe (optionnel)</label>
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="Laisser vide si non modifié" 
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="form-field">
                            <label className="label">Rôle</label>
                            <select 
                                className="input-field" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Sélectionner un rôle</option>
                                <option value="User">Utilisateur</option>
                                <option value="Admin">Administrateur</option>
                            </select>
                </div>
                <div className="button-group d-flex justify-content mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="submit" className="btn-submit">Modifier</button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>Annuler</button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default ModifyUser;
