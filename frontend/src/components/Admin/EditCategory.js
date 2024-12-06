import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({
    nom: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryDoc = doc(db, 'Categories', id);
        const categorySnapshot = await getDoc(categoryDoc);

        if (categorySnapshot.exists()) {
          setCategory(categorySnapshot.data());
        } else {
          setErrorMessage('Catégorie non trouvée.');
        }
      } catch (error) {
        setErrorMessage('Erreur lors du chargement de la catégorie.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryRef = doc(db, 'Categories', id);
      await updateDoc(categoryRef, {
        ...category,
        date_modification: serverTimestamp(),
      });
      navigate('/dashboard/categories');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      setErrorMessage('Erreur lors de la mise à jour de la catégorie.');
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
        <div className="add-user-container py-5edit-category-container py-5" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
        }}>
            <div className="form-card" style={{
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                width: '100%', 
                maxWidth: '500px'
            }}>
      <h2 style={{ marginTop: '10px', marginBottom: '50px', textAlign: 'center' }}>Modifier la Catégorie</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nom">
          <Form.Label>
            <FontAwesomeIcon icon={faTags} /> Nom
          </Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={category.nom}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mt-3">
          <Form.Label>
            <FontAwesomeIcon icon={faClipboardList} /> Description
          </Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={category.description}
            onChange={handleChange}
          />
        </Form.Group>

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
    </div>
  );
};

export default EditCategory;
