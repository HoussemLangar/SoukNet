import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { auth , db } from '../firebase'; 
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup , sendEmailVerification} from "firebase/auth"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import '../App.css';

    const Register = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [name, setName] = useState('');
        const [message, setMessage] = useState(null); 
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [messageType, setMessageType] = useState(''); 
        const [isLoading, setIsLoading] = useState(false);
    


  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
        setMessage("Les mots de passe ne correspondent pas.");
        setMessageType('danger');
        return;
    }

try {
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "Utilisateurs"), {
            email: email,
            nom_utilisateur: name,
            role: 'User', 
            date_creation: new Date(),
            date_modification: new Date()
        });

        await sendEmailVerification(auth.currentUser);
        setMessage("Inscription réussie !");
        setMessageType('success');

        setTimeout(() => {
            navigate("/", { state: { message: "Inscription réussie \nEt un email du validation envoyé!" } });
        }, 2);

    } catch (error) {
        const errorMessage = error.code.split('/')[1];
        setMessageType('danger');
        setMessage(errorMessage.replace(/-/g, ' '));
    } finally {
        setIsLoading(false);
    }
  };
 
  const handleSocialLogin = async (provider) => {
    let authProvider;

    if (provider === 'Google') {
        authProvider = new GoogleAuthProvider();
    } else if (provider === 'Facebook') {
        authProvider = new FacebookAuthProvider();
    } else {
        return; 
    }
    setIsLoading(true);

    try {
        await signInWithPopup(auth, authProvider);


        setMessage("Inscription réussie !");
        setMessageType('success');

        setTimeout(() => {
            navigate("/", { state: { message: "Inscription réussie !" } });
        }, 2);

    } catch (error) {
        const errorMessage = error.code.split('/')[1];
        setMessageType('danger');
        setMessage(errorMessage.replace(/-/g, ' '));
    } finally {
        setIsLoading(false);
    }
};


    return (
        <section className="registerSection">
            <div className="container">
                <h2 className="text-center mb-4">Créer un Compte</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="register-card">
                            {message && (
                                <div className={`alert alert-${messageType || 'success'} text-center`} role="alert">
                                {message}
                            </div>
                            )}
                            <form id="registerForm" onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nom</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                        placeholder="Entrez votre nom" 
                                        required 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        aria-label="Nom"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email-register" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email-register" 
                                        placeholder="Entrez votre email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        aria-label="Email"
                                    />
                                </div>
                                <div className="mb-3 position-relative"> 
                                    <label htmlFor="password-register" className="form-label">Mot de passe</label>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        id="password-register" 
                                        placeholder="Entrez un mot de passe" 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        aria-label="Mot de passe"
                                    />
                                    <span 
                                        className="position-absolute" 
                                        style={{ right: '10px', top: '40px', cursor: 'pointer' }} 
                                        onClick={() => setShowPassword(!showPassword)} 
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                                <div className="mb-3 position-relative"> 
                                    <label htmlFor="password-confirm" className="form-label">Confirmer le mot de passe</label>
                                    <input 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        id="password-confirm" 
                                        placeholder="Confirmez le mot de passe" 
                                        required 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        aria-label="Confirmer le mot de passe"
                                    />
                                    <span 
                                        className="position-absolute" 
                                        style={{ right: '10px', top: '40px', cursor: 'pointer' }} 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    >
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Créer un compte</button>
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
            {/* Loading Modal */}
            {isLoading && (
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
            )}
        </section>
    );
};
export default Register;
