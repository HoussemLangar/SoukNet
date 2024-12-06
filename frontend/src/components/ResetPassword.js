import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { auth } from '../firebase'; 
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth"; 
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from '../firebase'; 

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!validateEmail(email)) {
            setError("Veuillez entrer un email valide.");
            setLoading(false);
            return;
        }

        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            setError("L'email n'est' pas associé à aucun compte.");
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Un email de réinitialisation a été envoyé.");
        } catch (error) {
            setError("Une erreur s'est produite lors de l'envoi de l'email.");
        } finally {
            setLoading(false);
        }
    };

    const checkEmailExists = async (email) => {
        const usersRef = collection(db, "Utilisateurs");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSocialLogin = async (provider) => {
        let authProvider;
        if (provider === 'Google') {
            authProvider = new GoogleAuthProvider();
        } else if (provider === 'Facebook') {
            authProvider = new FacebookAuthProvider();
        }

        try {
            await signInWithPopup(auth, authProvider);
            setSuccess(`${provider} login réussi!`);
        } catch (error) {
            setError(`Erreur lors de la connexion avec ${provider}.`);
        }
    };

    return (
        <section className="resetSection">
            <div className="container">
                <h2 className="text-center mb-4">Réinitialiser le Mot de Passe</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="reset-card">
                            <form id="resetForm" onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email-reset" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email-reset" 
                                        placeholder="Entrez votre email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                {loading && <div className="alert alert-info">Envoi en cours...</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}
                                <button type="submit" className="btn btn-primary w-100">Réinitialiser le mot de passe</button>
                                <div className="mt-4 text-center">
                                    <p className="cnnct">Ou connectez-vous avec </p>
                                    <div>
                                        <button type="button" className="btn btn-danger" onClick={() => handleSocialLogin('Google')}>
                                            <FontAwesomeIcon icon={faGoogle} /> Google
                                        </button>
                                        <button type="button" className="btn btn-primary mx-2" onClick={() => handleSocialLogin('Facebook')}>
                                            <FontAwesomeIcon icon={faFacebook} /> Facebook
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => handleSocialLogin('Microsoft')}>
                                            <FontAwesomeIcon icon={faMicrosoft} /> Microsoft
                                        </button>
                                    </div>
                                </div>
                                <a href="/login" className="text-muted form-link">
                                    <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
                                    Retour à la connexion
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
