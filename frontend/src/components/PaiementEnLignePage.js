import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { FaCreditCard, FaCalendarAlt, FaLock, FaUser } from 'react-icons/fa';
import { FaLock as FaLockIcon } from 'react-icons/fa'; 
import { useCart } from '../context/CartContext';
import { SiMastercard, SiVisa, SiPaypal } from 'react-icons/si';
import { BiMoney } from 'react-icons/bi';
import { getAuth } from 'firebase/auth';
import { Modal, Spinner } from 'react-bootstrap'; 


const PaiementEnLignePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { cartItems, calculateTotalAmount } = useCart();
  const auth = getAuth();
  const User = auth.currentUser;
  const userId = User ? User.uid : null; 
  const [isLoading, setIsLoading] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    cardHolderName: '',
    email: user?.email || '',
  });

  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [timer, setTimer] = useState(7200);
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState(0);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const fetchOrderCount = async () => {
      const ordersCollection = collection(db, 'Commandes');
      const orderDocs = await getDocs(ordersCollection);
      setOrderNumber(orderDocs.size + 1);
    };

    fetchOrderCount();

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleEmailCheckboxChange = (e) => {
    setIsEmailEnabled(e.target.checked);
    setCardDetails({
      ...cardDetails,
      email: e.target.checked ? '' : user?.email || '',
    });
  };

  const validateCardDetails = () => {
    let formErrors = {};
    const cardNumberRegex = /^[0-9]{16}$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    if (!cardNumberRegex.test(cardDetails.cardNumber.trim())) {
      formErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis).';
    }
    if (!cvvRegex.test(cardDetails.cvv.trim())) {
      formErrors.cvv = 'CVV invalide (3 ou 4 chiffres requis).';
    }
    if (!cardDetails.expirationMonth || !cardDetails.expirationYear) {
      formErrors.expirationDate = 'Date d\'expiration invalide.';
    }
    if (isEmailEnabled && !cardDetails.email.trim()) {
      formErrors.email = 'Veuillez fournir un email valide.';
    }
    if (!cardDetails.cardHolderName.trim()) {
      formErrors.cardHolderName = 'Nom du détenteur requis.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const fetchAdresseParUserId = async (userId) => {
    try {
      const adressesRef = collection(db, 'Adresses');
      const q = query(adressesRef, where('userId', '==', userId)); 
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); 
      } else {
        console.error('Aucune adresse trouvée pour cet utilisateur.');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      return null;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateCardDetails()) {
      setIsLoading(true); 
      try {
        const adresse = await fetchAdresseParUserId(userId);

        if (!adresse) {
          throw new Error('Adresse introuvable pour cet utilisateur.');
        }

        const isPaymentSuccessful = true;

        if (isPaymentSuccessful) {
          const response = await fetch('http://localhost:5000/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cardDetails.email,
              firstName: cardDetails.cardHolderName,
              cartItems,
              adresse,
              paymentMethod: 'Paiement En ligne',
            }),
          });

          if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi de l\'email.');
          }

          navigate('/confirmation');
        } else {
          throw new Error('Échec du paiement.');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        setPaymentError(error.message);
        setTimeout(() => navigate('/'), 6000);
      }finally {
        setIsLoading(false); 
      }
    }
  };

  const formatTime = () => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    return `${hours} h. ${minutes} min. ${seconds} sec.`;
  };

  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh', backgroundColor: '#f5f5f5' }}>
      {paymentError && (
        <div className="alert alert-danger" role="alert">
          {paymentError} 
        </div>
      )}
      <div className="payment-box p-4" style={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-3">
          <h2>Paiement en Ligne</h2>
          <p>Numéro de la commande <strong>№{orderNumber}</strong></p> 
          <p>Il reste jusqu'à la fin de la session <strong>{formatTime()}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <FaCreditCard className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#007bff' }} />
            <input
              type="text"
              name="cardNumber"
              className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
              value={cardDetails.cardNumber}
              onChange={handleChange}
              placeholder="Numéro de la carte"
              required
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <div className="mb-3 d-flex">
            <div className="me-2" style={{ flex: '1' }}>
              <div className="position-relative">
                <FaCalendarAlt className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#007bff' }} />
                <select
                  name="expirationMonth"
                  className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
                  value={cardDetails.expirationMonth}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '40px' }}
                >
                  <option value="">Mois</option>
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>{(index + 1).toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ flex: '1' }}>
              <div className="position-relative">
                <FaCalendarAlt className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#007bff' }} />
                <select
                  name="expirationYear"
                  className={`form-control ${errors.expirationDate ? 'is-invalid' : ''}`}
                  value={cardDetails.expirationYear}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '40px' }}
                >
                  <option value="">Année</option>
                  {[...Array(10)].map((_, index) => {
                    const year = new Date().getFullYear() + index;
                    return <option key={index} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="me-2" style={{ flex: '1' }}>
              <div className="position-relative">
                <FaLock className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#007bff' }} />
                <input
                  type="text"
                  name="cvv"
                  className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  placeholder="CVV"
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          </div>

          <div className="mb-3 position-relative">
            <FaUser className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#007bff' }} />
            <input
              type="text"
              name="cardHolderName"
              className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
              value={cardDetails.cardHolderName}
              onChange={handleChange}
              placeholder="Nom du Détenteur de la Carte"
              required
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="emailCheckbox"
                checked={isEmailEnabled}
                onChange={handleEmailCheckboxChange}
              />
              <label className="form-check-label" htmlFor="emailCheckbox">
                Email
              </label>
            </div>
            <input
              type="email"
              name="email"
              className="form-control mt-2"
              value={cardDetails.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              disabled={!isEmailEnabled} 
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Paiement - {calculateTotalAmount()} DT
          </button>
        </form>
        <div className="d-flex justify-content-between align-items-center mb-3" style={{marginTop :'20px'}} > 
          <div className="d-flex align-items-center">
            <FaLockIcon className="me-2" style={{ color: '#007bff' }} />
            <span>Paiement sécurisé</span>
          </div>
          <div className="d-flex">
            <SiVisa className="me-2" style={{ color: '#007bff', fontSize: '24px' }} />
            <SiMastercard className="me-2" style={{ color: '#007bff', fontSize: '24px' }} />
            <SiPaypal className="me-2" style={{ color: '#007bff', fontSize: '24px' }} />
            <BiMoney style={{ color: '#007bff', fontSize: '24px' }} /> {/* Monétique icon */}
          </div>
        </div>
      </div>
      {/* Modal de chargement */}
      <Modal show={isLoading} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-3">Traitement en cours...</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaiementEnLignePage;
