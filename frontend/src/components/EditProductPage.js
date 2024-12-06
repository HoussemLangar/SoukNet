import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarTimes, faImage, faTags, faClipboardList, faDollarSign, faPhone, faIdCard, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    nom: '',
    description: '',
    prix: '',
    quantite: '',
    rib: '',
    telephone: '',
    statut: 'Disponible',
    emetteur: '',
    methodRemboursement: 'Par Mondat',
    cin: '',
  });
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'Produits', id);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setProduct({
            ...productData
          });
          setCategory(productData.category);
        } else {
          setErrorMessage('Produit non trouvé.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      let images = product.images;
  
      if (newImage) {
        const imageRef = ref(storage, `product_images/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        images = await getDownloadURL(imageRef);
      }
  
      const productRef = doc(db, 'Produits', id);
      await updateDoc(productRef, {
        ...product,
        images,
        date_modification: serverTimestamp(), 
      });
  
      navigate(`/my-products`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      setErrorMessage('Erreur lors de la mise à jour du produit');
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
    <div className="add-product-container py-5" style={{ marginTop: '50px', marginBottom: '50px' }}>
      <h2 style={{ marginTop: '10px', marginBottom: '50px', textAlign: 'center' }}>Modifier le Produit</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <div className="form-column">
          <Form.Group controlId="nom">
            <Form.Label><FontAwesomeIcon icon={faTags} /> Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={product.nom}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label><FontAwesomeIcon icon={faClipboardList} /> Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="prix">
            <Form.Label><FontAwesomeIcon icon={faDollarSign} /> Prix</Form.Label>
            <Form.Control
              type="number"
              name="prix"
              value={product.prix}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="quantite">
            <Form.Label><FontAwesomeIcon icon={faMoneyBillWave} /> Quantité</Form.Label>
            <Form.Control
              type="number"
              name="quantite"
              value={product.quantite}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="statut">
            <Form.Label><FontAwesomeIcon icon={faTags} /> Statut</Form.Label>
            <Form.Control
              as="select"
              name="statut"
              value={product.statut}
              onChange={handleChange}
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendu">Vendu</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="date_creation">
            <Form.Label><FontAwesomeIcon icon={faCalendarTimes} /> Date de création</Form.Label>
            <Form.Control
              type="text"
              name="date_creation"
              value={new Date(product.date_creation.seconds * 1000).toLocaleDateString()}
              readOnly
            />
          </Form.Group>
        </div>
        <div className="form-column">
          <Form.Group controlId="emetteur">
            <Form.Label><FontAwesomeIcon icon={faImage} /> Émetteur</Form.Label>
            <Form.Control
              type="text"
              name="emetteur"
              value={product.emetteur}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="methodRemboursement">
            <Form.Label><FontAwesomeIcon icon={faMoneyBillWave} /> Méthode de Remboursement</Form.Label>
            <Form.Control
              as="select"
              name="methodRemboursement"
              value={product.methodRemboursement}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une méthode</option>
              <option value="Par Mondat">Par Mondat</option>
              <option value="Par RIB">Par RIB</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="rib">
            <Form.Label><FontAwesomeIcon icon={faIdCard} /> RIB</Form.Label>
            <Form.Control
              type="text"
              name="rib"
              value={product.rib}
              onChange={handleChange}
              disabled={product.methodRemboursement === 'Par Mondat'}
            />
          </Form.Group>

          <Form.Group controlId="telephone">
            <Form.Label><FontAwesomeIcon icon={faPhone} /> Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="telephone"
              value={product.telephone}
              onChange={handleChange}
            />
          </Form.Group>

          {product.methodRemboursement === 'Par Mondat' && (
            <Form.Group controlId="cin">
              <Form.Label><FontAwesomeIcon icon={faIdCard} /> CIN</Form.Label>
              <Form.Control
                type="text"
                name="cin"
                value={product.cin}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Form.Group controlId="imageUrl">
            <Form.Label><FontAwesomeIcon icon={faImage} /> Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
            />
            {product.imageUrl && (
              <img src={product.imageUrl} alt="Produit" width="100" height="100" />
            )}
          </Form.Group>
        </div>
        <div className="button-group d-flex justify-content-end mt-4">
          <Button variant="primary" type="submit" className="btn-submit">
            Enregistrer les modifications
          </Button>
          <Button variant="secondary" className="btn-cancel" onClick={() => navigate(-1)}>
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProductPage;
