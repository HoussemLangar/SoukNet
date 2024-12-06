import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaRoad, FaCity, FaEnvelope, FaPhone } from 'react-icons/fa';

const AdressePage = () => {
  const [adresse, setAdresse] = useState({ rue: '', ville: '', codePostal: '', telephone: '' });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchAdresse(user.uid);
      }else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdresse = async (userId) => {
    setLoading(true); 
    const adressesRef = collection(db, 'Adresses');
    const q = query(adressesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        setAdresse(doc.data());
      });
    } else {
      setAdresse({ rue: '', ville: '', codePostal: '', telephone: '' });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setAdresse({ ...adresse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error('ID de l\'utilisateur non disponible.');
      return;
    }

    setLoading(true);
    try {
      const adresseRef = doc(db, 'Adresses', userId);
      await setDoc(adresseRef, {
        ...adresse,
        userId,
      }, { merge: true });

      console.log('Adresse enregistrée avec succès.');
      navigate('/choix-methode');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'adresse:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      {loading && (
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
      <h2 className="mb-4 text-center">Votre Coordonnées</h2>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow" style={{ width: '400px' }}>
          <div className="mb-3">
            <label className="form-label"><FaRoad className="me-2" /> Rue</label>
            <input
              type="text"
              name="rue"
              className="form-control"
              value={adresse.rue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><FaCity className="me-2" /> Ville</label>
            <input
              type="text"
              name="ville"
              className="form-control"
              value={adresse.ville}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><FaEnvelope className="me-2" /> Code Postal</label>
            <input
              type="text"
              name="codePostal"
              className="form-control"
              value={adresse.codePostal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><FaPhone className="me-2" /> Numéro de Téléphone</label>
            <input
              type="tel"
              name="telephone"
              className="form-control"
              value={adresse.telephone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Valider l'adresse</button>
        </form>
      </div>
    </div>
  );
};

export default AdressePage;
