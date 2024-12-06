import React, { useState } from 'react';
import { db, Timestamp, auth } from '../../firebase'; 
import { addDoc, collection } from 'firebase/firestore'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AddUser = () => {
    const [nomUtilisateur, setNomUtilisateur] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [role, setRole] = useState(""); 
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nomUtilisateur || !email || !password || !role) {
            setErrorMessage("Tous les champs sont requis.");
            return;
        }

        const dateCreation = Timestamp.now();
        const dateModification = Timestamp.now();

        const newUser = {
            nom_utilisateur: nomUtilisateur,
            email,
            password,
            role,
            date_creation: dateCreation,
            date_modification: dateModification,
        };

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await addDoc(collection(db, "Utilisateurs"), newUser);
            setSuccessMessage("Utilisateur ajouté avec succès !");
            setTimeout(() => {
                navigate('/dashboard/utilisateurs');
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
            setErrorMessage("Erreur lors de l'ajout de l'utilisateur.");
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
        }}>
            <div className="form-card" style={{
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                width: '100%', 
                maxWidth: '500px'
            }}>
                <h2 className="add-user-title text-center" style={{ marginBottom: '20px' }}>Ajouter un Utilisateur</h2>
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>} 
                {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>} 
                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="form-field" style={{ marginBottom: '20px' }}>
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
                    <div className="form-field" style={{ marginBottom: '20px' }}>
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
                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <label className="label"><FontAwesomeIcon icon={faLock} /> Mot de Passe</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div className="form-field" style={{ marginBottom: '20px' }}>
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
                        <button type="submit" className="btn-submit" style={{
                            backgroundColor: '#4CAF50', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer'
                        }}>Créer</button>
                        <button type="button" className="btn-cancel" onClick={handleCancel} style={{
                            backgroundColor: '#f44336', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer'
                        }}>Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
