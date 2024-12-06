import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const AccountSettingsAdmin = () => {
    const [userData, setUserData] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messagePop, setMessagePop] = useState('');
    const [messageType, setMessageType] = useState('');
    const [messagePopType, setMessagePopType] = useState('');
    const [editingField, setEditingField] = useState(null);
    const [updatedNomUtilisateur, setUpdatedNomUtilisateur] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const pause = (duration) => {
        return new Promise((resolve) => setTimeout(resolve, duration));
    };


    useEffect(() => {
        const fetchUserDataAndAddresses = async () => {
            await pause(1000);
            const user = auth.currentUser;
            if (!user) {
                setMessageType('danger');
                setMessage('Utilisateur non connecté.');
                setLoading(false);
                return;
            }

            const db = getFirestore();
            const usersCollection = collection(db, 'Utilisateurs');
            const userQuery = query(usersCollection, where('email', '==', user.email));
            try {
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    setUserData(userData);
                    setUpdatedNomUtilisateur(userData.nom_utilisateur);

                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur ou adresses:", error);
                setMessageType('danger');
                setMessage('Erreur lors de la récupération des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndAddresses();
    }, []);


    const handleEditField = async (field) => {
        setLoading(true);
        try {
                if (field === 'nom_utilisateur') {
                    const userDocRef = collection(getFirestore(), 'Utilisateurs'); 
                    const q = query(userDocRef, where('email', '==', auth.currentUser.email)); 
    
                    const querySnapshot = await getDocs(q); 
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0]; 
                        
                        if (updatedNomUtilisateur) {
                            await updateDoc(userDoc.ref, {
                                nom_utilisateur: updatedNomUtilisateur, 
                            });
    
                            setMessageType('success');
                            setMessage(`Nom d'utilisateur mis à jour avec succès.`);
                        } else {
                            setMessageType('error');
                            setMessage(`Valeur de nom_utilisateur est manquante.`);
                        }
                    } else {
                        setMessageType('error');
                        setMessage(`Aucun utilisateur trouvé avec cet email.`);
                    }
                }
            } catch {
                setMessageType('error');
                setMessage(`Un probléme persiste.`);
            } 
            setEditingField(null);
            setLoading(false);
    };
    

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessagePopType('danger');
            setMessagePop(`Veuillez remplir tous les champs.`);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessagePopType('danger');
            setMessagePop(`Les mots de passe ne correspondent pas.`);
            return;
        }

        try {
            const user = auth.currentUser; 
            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }

            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential); 

            await updatePassword(user, newPassword);
            
            setMessageType('success');
            setMessage(`Mot de passe changé avec succès!`);
            setIsModalOpen(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessagePopType('danger');
            setMessagePop("Erreur: " + error.message);
        }
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    return (
        <div className="account-settings container py-5" style={{ marginTop: '50px', marginBottom: '50px', maxWidth: '800px' }}>
            <div className="card p-4 shadow-lg rounded">
                <h1 className="text-center mb-4" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Paramètres du Compte</h1>
                {loading ? (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-3">Veuillez patienter...</p>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <>
                        {message && (
                            <div className={`alert alert-${messageType} text-center`} role="alert">
                                {message}
                            </div>
                        )}
                        {userData ? (
                            <>
                                <div className="user-details mb-5 text-center">
                                    <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Détails de l'utilisateur</h2>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <div className="editable-field mb-3">
                                        <label><strong>Nom d'utilisateur:</strong></label>
                                        {editingField === 'nom_utilisateur' ? (
                                            <div className="d-flex justify-content-center mt-2">
                                                <input
                                                    type="text"
                                                    value={updatedNomUtilisateur}
                                                    onChange={(e) => setUpdatedNomUtilisateur(e.target.value)}
                                                    className="form-control w-50"
                                                />
                                                <button onClick={() => handleEditField('nom_utilisateur')} className="btn btn-primary ms-2">
                                                    <FontAwesomeIcon icon={faSave} />
                                                </button>
                                                <button onClick={() => setEditingField(null)} className="btn btn-secondary ms-2">
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="d-flex align-items-center justify-content-center">
                                                {userData.nom_utilisateur}
                                                <button onClick={() => { setEditingField('nom_utilisateur'); setUpdatedNomUtilisateur(userData.nom_utilisateur); }} className="btn btn-link ms-2">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                            </div>


                                <div className="text-center mb-5">
                                    <button onClick={() => setIsModalOpen(true)} className="btn btn-warning">Changer le mot de passe</button>
                                </div>

                                {isModalOpen && (
                                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-modal="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Changer le mot de passe</h5>
                                                    <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                                                </div>
                                                {messagePop && (
                                                        <div className={`alert alert-${messagePopType} text-center`} role="alert">
                                                            {messagePop}
                                                        </div>
                                                    )}
                                                <div className="modal-body">
                                                    <div className="mb-3">
                                                        <label className="form-label">Ancien mot de passe:</label>
                                                        <div className="input-group">
                                                            <input
                                                                type={passwordVisible.oldPassword ? 'text' : 'password'}
                                                                value={oldPassword}
                                                                onChange={(e) => setOldPassword(e.target.value)}
                                                                className="form-control"
                                                            />
                                                            <button className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('oldPassword')}>
                                                                <FontAwesomeIcon icon={passwordVisible.oldPassword ? faEyeSlash : faEye} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Nouveau mot de passe:</label>
                                                        <div className="input-group">
                                                            <input
                                                                type={passwordVisible.newPassword ? 'text' : 'password'}
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                className="form-control"
                                                            />
                                                            <button className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('newPassword')}>
                                                                <FontAwesomeIcon icon={passwordVisible.newPassword ? faEyeSlash : faEye} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Confirmer le mot de passe:</label>
                                                        <div className="input-group">
                                                            <input
                                                                type={passwordVisible.confirmPassword ? 'text' : 'password'}
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                className="form-control"
                                                            />
                                                            <button className="btn btn-outline-secondary" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                                                <FontAwesomeIcon icon={passwordVisible.confirmPassword ? faEyeSlash : faEye} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fermer</button>
                                                    <button type="button" className="btn btn-primary" onClick={handleChangePassword}>Changer le mot de passe</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountSettingsAdmin;
