import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Modal, Spinner } from 'react-bootstrap'; 


function DemandeAjoutCategorie({ user }) {
  const [nomCategorie, setNomCategorie] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);  

    try {
      if (user) {
        await addDoc(collection(db, 'demande_categorie'), {
          nomCategorie,
          description,
          userId: user.uid,
          email: user.email,
          date: Timestamp.now(),
        });

        const response = await fetch('http://localhost:5000/api/category-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nomCategorie,
            description,
            user,
          }),
        });

        setMessage("Votre demande a été envoyée avec succès.");
        setMessageType("success");
        setNomCategorie('');
        setDescription('');
        setTimeout(() => {
          navigate('/'); 
        }, 3000);
      } else {
        setMessage("Vous devez être connecté pour faire cette demande.");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
      setMessageType("danger");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="demande-ajout-categorie-container" style={{ marginTop: '50px', marginBottom: '50px' }}>
      <h2>Demande d'ajout d'une catégorie</h2>
      {message && <p className={`alert alert-${messageType}`}>{message}</p>}
      
      {/* Modal de chargement */}
      {isLoading && (
        <div className="loading-modal">
          <Modal show={isLoading} backdrop="static" keyboard={false} centered>
            <Modal.Body className="text-center">
              <Spinner animation="border" role="status" />
              <div className="mt-3">Traitement en cours...</div>
            </Modal.Body>
          </Modal>
        </div>
      )}

      <form onSubmit={handleSubmit} className="formulaire-demande">
        <div className="form-group">
          <label htmlFor="nomCategorie" className="form-label">
            Nom de la catégorie
          </label>
          <input
            type="text"
            id="nomCategorie"
            className="form-input"
            value={nomCategorie}
            onChange={(e) => setNomCategorie(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="button-group d-flex justify-content-end mt-4">
          <button type="submit" className="btn-submit">Envoyer</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default DemandeAjoutCategorie;
