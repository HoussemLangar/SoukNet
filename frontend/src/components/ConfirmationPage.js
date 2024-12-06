import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faShoppingCart, faFilePdf, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const { cartItems, clearCart } = useCart();
  const [adresse, setAdresse] = useState({ rue: '', ville: '', codePostal: '', telephone: '' });
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [paymentMethod] = useState(localStorage.getItem('paymentMethod') || 'Carte de crédit');
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchNomUtilisateur(user.email);
      fetchAdresse(user.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNomUtilisateur = async (email) => {
    const utilisateursRef = collection(db, 'Utilisateurs');
    const q = query(utilisateursRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        setUserName(doc.data().nom_utilisateur || 'Client');
      });
    }
  };

  const fetchAdresse = async (userId) => {
    const adressesRef = collection(db, 'Adresses');
    const q = query(adressesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        setAdresse(doc.data());
      });
    }
    setLoading(false);
  };

  const saveOrderToFirestore = async () => {
    if (userId && userName && adresse) {
      const orderDetails = {
        userId,
        userName,
        adresse,
        paymentMethod,
        cartItems,
        total: cartItems.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2),
        date: new Date(),
        statutCommande: 'En cours'
      };

      try {
        const docRef = await addDoc(collection(db, 'Commandes'), orderDetails);
        console.log("Document written with ID: ", docRef.id);
        setOrderId(docRef.id);
        return docRef.id; 
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    return null; 
  };

  const sustractionProduit = async () => {
    if (!orderId) return; 
    try {
      await Promise.all(cartItems.map(async (item) => {
        const productRef = doc(db, 'Produits', item.id);
        const productSnapshot = await getDocs(query(collection(db, 'Produits'), where('id', '==', item.id)));

        if (!productSnapshot.empty) {
          productSnapshot.forEach(async (doc) => {
            const currentQuantity = doc.data().quantite;
            const updatedQuantity = currentQuantity - item.quantity;

            await updateDoc(productRef, { quantite: updatedQuantity });
          });
        }
      }));
    } catch (e) {
      console.error("Error updating product quantities: ", e);
    }
  };

  const generatePDF = async () => { 
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  
    const logoPath = `${process.env.PUBLIC_URL}/logo512.png`; 
    doc.addImage(logoPath, 'PNG', 10, 10, 20, 20);
  
    doc.setFontSize(18);
    doc.text("Document de Facturation", 110, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`SoukNet`, 110, 30, null, null, "center");
  
    doc.text(`Date: ${formattedDate}`, 150, 40);
    doc.text(`Nom du client: ${userName}`, 14, 50);
    doc.text(`Méthode de paiement: ${paymentMethod}`, 14, 60);
  
    doc.setFontSize(14);
    doc.text("Adresse de Livraison :", 14, 70);
  
    autoTable(doc, {
      startY: 75,
      head: [['Rue', 'Ville', 'Code Postal', 'Téléphone']],
      body: [[adresse.rue, adresse.ville, adresse.codePostal, adresse.telephone]],
      margin: { horizontal: 14 },
    });
  
    doc.text("Contenu du Panier :", 14, doc.lastAutoTable.finalY + 10);
    const cartData = cartItems.map(item => [item.nom, item.quantity, (item.prix * item.quantity).toFixed(2) + ' DT']);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Produit', 'Quantité', 'Prix (DT)']],
      body: cartData,
      margin: { horizontal: 14 },
    });
  
    const total = cartItems.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2);
    doc.text(`Total: ${total} DT`, 14, doc.lastAutoTable.finalY + 10);
  
    doc.save('document_facturation.pdf');
    
    await sustractionProduit(); 
    clearCart();
    
    navigate('/'); 
  };

  useEffect(() => {
    const createOrder = async () => {
      const id = await saveOrderToFirestore(); 
      if (id) {
        setOrderId(id); 
      }
    };

    if (!loading) {
      createOrder();
    }
  }, [userId, userName, adresse, loading]); 

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            clearCart(); 
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, [clearCart]);

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="container py-5">
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 className="text-success">Commande confirmée</h2>
        <p>Un email de confirmation a été envoyé.</p>

        <div className="table-responsive my-4">
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

        <div className="table-responsive my-4">
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
                cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nom}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.prix * item.quantity).toFixed(2)} DT</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">Aucun produit dans le panier</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="my-4">
          <h4><FontAwesomeIcon icon={faCreditCard} /> Méthode de paiement : {paymentMethod}</h4>
        </div>

        <div className="my-4">
          <p>SVP télécharger votre facture pour tous cas d'erreur</p>
          <button className="btn btn-primary" onClick={generatePDF}>
            <FontAwesomeIcon icon={faFilePdf} /> Télécharger la facture
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
