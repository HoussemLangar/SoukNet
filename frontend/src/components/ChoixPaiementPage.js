import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faShoppingCart, faCreditCard, faTruck } from '@fortawesome/free-solid-svg-icons';

const ChoixPaiementPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [adresse, setAdresse] = useState({ rue: '', ville: '', codePostal: '', telephone: '' });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchAdresse(user.uid);
    }
  }, []);

  const fetchAdresse = async (userId) => {
    const adressesRef = collection(db, 'Adresses');
    const q = query(adressesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        setAdresse(doc.data());
      });
    }
  };

  const handlePaiementEnLigne = () => {
    localStorage.setItem('paymentMethod', 'Paiement en ligne');
    navigate('/paiement');
};

const handlePaiementLivraison = () => {
    localStorage.setItem('paymentMethod', 'Paiement à la livraison');
    navigate('/confirmation');
};


  const totalPanier = cartItems.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container text-center py-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 className="mb-4">Choisissez votre méthode de paiement</h2>
        
        <div className="table-responsive mb-4">
          <h4><FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse de livraison :</h4>
          <table className="table table-bordered mx-auto" style={{ width: '80%' }}>
            <thead>
              <tr>
                <th>Rue</th>
                <th>Ville</th>
                <th>Code Postal</th>
                <th>Téléphone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{adresse.rue}</td>
                <td>{adresse.ville}</td>
                <td>{adresse.codePostal}</td>
                <td>{adresse.telephone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-responsive mb-4">
          <h4><FontAwesomeIcon icon={faShoppingCart} /> Contenu du panier :</h4>
          <table className="table table-bordered mx-auto" style={{ width: '80%' }}>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nom}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.prix * item.quantity).toFixed(2)} DT</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">Votre panier est vide.</td>
                </tr>
              )}
            </tbody>
          </table>

          {cartItems.length > 0 && (
            <div className="text-end me-4">
              <h5>Total du panier : {totalPanier} DT</h5>
            </div>
          )}
        </div>

        <h4>Choisissez votre type de paiement :</h4>
        <br />
        <div className="d-flex justify-content-around mb-4">
          <button className="btn btn-primary" onClick={handlePaiementLivraison}>
            <FontAwesomeIcon icon={faTruck} /> Paiement à la livraison
          </button>
          <button className="btn btn-primary" onClick={handlePaiementEnLigne}>
            <FontAwesomeIcon icon={faCreditCard} /> Paiement en ligne
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoixPaiementPage;
