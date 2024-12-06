import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'; 
import { auth } from '../firebase'; 
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation } from 'react-router-dom';


const Login = ({ setUser }) => { 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [message, setMessage] = useState(null);  
    const [messageType, setMessageType] = useState(''); 
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message; 
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
    
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid;

            const userEmail = user.email;
            const db = getFirestore();
            const usersRef = collection(db, 'Utilisateurs');
            const q = query(usersRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                setMessageType('danger');
                setMessage('Aucun utilisateur trouvé avec cet email.');
                setIsLoading(false);
                return;
            }
    
            const userData = querySnapshot.docs[0].data();
            const username = userData.nom_utilisateur || user.email; 
            const role = userData.role || "User"; 

            localStorage.setItem('user', JSON.stringify({ ...user, username, role, userId  }));
            
            setUser({ ...user, username, role, userId  }); 
    
            setMessage("Connexion réussie !");
            navigate(role === 'Admin' ? '/dashboard' : '/');
            window.location.reload();
            
        } catch (error) {
            setIsLoading(false);
            setMessageType('danger');
    
            switch (error.code) {
                case 'auth/wrong-password':
                    setMessage('Le mot de passe est incorrect.');
                    break;
                case 'auth/user-not-found':
                    setMessage('Aucun utilisateur trouvé avec cet email.');
                    break;
                default:
                    setMessage('Une erreur s\'est produite. Veuillez réessayer.');
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSocialLogin = (platform) => {
        let provider;
        if (platform === 'Google') {
            provider = new GoogleAuthProvider();
        } else if (platform === 'Facebook') {
            provider = new FacebookAuthProvider();
        }
        setIsLoading(true);

        if (provider) {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    const userEmail = user.email;
                    const userId = user.uid;

                    const db = getFirestore();
                    const usersRef = collection(db, 'Utilisateurs');
                    const q = query(usersRef, where('email', '==', userEmail));
                    return getDocs(q).then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            const userData = querySnapshot.docs[0].data();
                            const username = userData.nom_utilisateur || user.email;
                            const role = userData.role || "User"; 

                            localStorage.setItem('user', JSON.stringify({ ...user, username, role, userId }));

                            setUser({ ...user, username, role, userId  }); 
                            setMessageType('success');
                            setMessage(`${platform} Login successful`);
                            navigate(role === 'Admin' ? '/dashbord' : '/'); 
                            window.location.reload();                       }
                    });
                })
                .catch((error) => {
                    setMessageType('danger');
                    setMessage(`Erreur lors de la connexion avec ${platform}`);
                })
                .finally (() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <section className="login-section">
            <div className="container">
                <h1>Connexion à SoukNet</h1>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="login-card">
                            {(message || successMessage) && ( 
                                <div className={`alert alert-${messageType || 'success'} text-center`} role="alert">
                                    {message || successMessage}
                                </div>
                            )}
                            <form id="loginForm" onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        placeholder="Entrez votre email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3 position-relative"> 
                                    <label htmlFor="password" className="form-label">Mot de passe</label>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="form-control" 
                                        id="password" 
                                        placeholder="Entrez votre mot de passe" 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <span 
                                        className="position-absolute" 
                                        style={{ right: '10px', top: '40px', cursor: 'pointer' }} 
                                        onClick={() => setShowPassword(!showPassword)} 
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Se souvenir de moi</label>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Connexion</button>
                            </form>
                            <div className="mt-4 text-center">
                                <p className="cnnct">Ou connectez-vous avec </p>
                                <div>
                                    <button type="button" className="btn btn-danger" onClick={() => handleSocialLogin('Google')}>
                                        <FontAwesomeIcon icon={faGoogle} /> Google
                                    </button>
                                    <button type="button" className="btn btn-primary mx-2" onClick={() => handleSocialLogin('Facebook')}>
                                        <FontAwesomeIcon icon={faFacebook} /> Facebook
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <a href="/reset" className="text-muted form-link">
                                        <FontAwesomeIcon icon={faLock} style={{ marginRight: '5px' }} />
                                        Mot de passe oublié ?
                                    </a>
                                    <a href="/register" className="text-muted form-link">
                                        <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px' }} />
                                        Créer un compte
                                    </a>
                                </div>
                            </div>
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

export default Login;
