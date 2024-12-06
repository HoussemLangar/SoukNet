import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaArrowLeft } from 'react-icons/fa';

const MyProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'Produits', id);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          const productData = { id: productSnapshot.id, ...productSnapshot.data() };
          setProduct(productData);

          const categoryRef = productData.id_categorie;
          if (categoryRef) {
            const categoryId = categoryRef.id.split('/').pop();
            const categoryDoc = doc(db, 'Categories', categoryId);
            const categorySnapshot = await getDoc(categoryDoc);

            if (categorySnapshot.exists()) {
              setCategory(categorySnapshot.data().nom); 
            } else {
              setCategory('Non spécifiée');
            }
          } else {
            setCategory('Non spécifiée');
          }
        } else {
          setErrorMessage('Produit non trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        setErrorMessage('Erreur lors de la récupération du produit');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'Produits', id));
      navigate('/my-products');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      setErrorMessage('Erreur lors de la suppression du produit');
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Non spécifiée';
    const date = timestamp.toDate();
    return date ? date.toLocaleDateString('fr-FR') : 'Non spécifiée';
  };

  const formatRefundMethod = (method) => {
    if (!method) return 'Non spécifiée';
    switch (method) {
      case 'par_mondat':
        return 'Par Mondat';
      case 'par_rib':
        return 'Par RIB';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  if (isLoading) {
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
    <div className="my-product-details-page container py-5">
    <Modal 
      show={showModal}
      onHide={handleCloseModal}
      dialogClassName="custom-modal custom-product-modal"
      onExited={() => setShowModal(false)}
    >
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title className="custom-modal-title">Confirmation de Suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button variant="secondary" onClick={handleCloseModal}>
          Annuler
        </Button>
        <Button variant="danger" onClick={() => { handleDelete(); handleCloseModal(); }}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
      {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
      {product && (
        <>
          <div className="text-start mb-4">
            <Button variant="light" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" /> Retour
            </Button>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">{product.nom || 'Non spécifié'}</h2>
              
              <div className="row">
                <div className="d-flex justify-content-center align-items-center">
                  <img 
                    src={product.images[0] || 'https://via.placeholder.com/300x200'} 
                    alt={product.nom} 
                    className="img-fluid rounded" 
                    style={{ width: '300px', height: '200px' }} 
                  />
                </div>
                <div className="col-md-6">
                  <h5>Description</h5>
                  <p>{product.description || 'Aucune description disponible.'}</p>
                  <h5>Prix</h5>
                  <p>{product.prix ? `${product.prix} DT` : 'Non spécifié'}</p>
                  <h5>Quantité</h5>
                  <p>{product.quantite || 'Non spécifiée'}</p>

                  {product.methodRemboursement === 'par_mondat' ? (
                    <>
                      <h5>CIN</h5>
                      <p>{product.cin || 'Non spécifié'}</p>
                    </>
                  ) : (
                    <>
                      <h5>RIB</h5>
                      <p>{product.rib || 'Non spécifié'}</p>
                    </>
                  )}
                  <h5>Téléphone</h5>
                  <p>{product.telephone || 'Non spécifié'}</p>
                  <h5>Statut</h5>
                  <p>{product.statut || 'Non spécifié'}</p>
                </div>
                <div className="col-md-6">
                  <h5>Emetteur</h5>
                  <p>{product.emetteur || 'Non spécifié'}</p>
                  <h5>Catégorie</h5>
                  <p>{category || 'Non spécifiée'}</p>
                  <h5>Méthode de Remboursement</h5>
                  <p>{formatRefundMethod(product.methodRemboursement)}</p>
                  <h5>Date de Création</h5>
                  <p>{formatDate(product.date_creation)}</p>
                  <h5>Date de Modification</h5>
                  <p>{formatDate(product.date_modification)}</p>
                </div>
              </div>

              <div className="text-center">
                <Link to={`/edit-product/${product.id}`} className="btn btn-warning me-2">Modifier le Produit</Link>
                <Button variant="danger" onClick={handleShowModal}>Supprimer le Produit</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProductDetailsPage;
