import React, { useState, useEffect } from "react";
import { addDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const CategoryForm = ({ category }) => {
  const [nom, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setName(category.nom || "");
      setDescription(category.description || "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (category) {
        const categoryDoc = doc(db, "Categories", category.id);
        await updateDoc(categoryDoc, {
          nom,
          description,
        });
      } else {
        await addDoc(collection(db, "Categories"), {
          nom,
          description,
        });
      }
      navigate("/dashboard/categories");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la catégorie :", error);
      setErrorMessage("Erreur lors de l'enregistrement de la catégorie.");
    }
  };

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
        <h2 style={{ marginTop: "10px", marginBottom: "50px", textAlign: "center" }}>
          {category ? "Modifier une Catégorie" : "Ajouter une Catégorie"}
        </h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nom">
            <Form.Label>
              <FontAwesomeIcon icon={faTags} /> Nom
            </Form.Label>
            <Form.Control
              type="text"
              value={nom}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label>
              <FontAwesomeIcon icon={faClipboardList} /> Description
            </Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </Form.Group>

          <div className="button-group d-flex justify-content-end mt-4">
            <Button variant="primary" type="submit" className="btn-submit me-2">
              {category ? "Mettre à jour" : "Ajouter"}
            </Button>
            <Button
              variant="secondary"
              className="btn-cancel"
              onClick={() => navigate("/dashboard/categories")}
            >
              Annuler
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CategoryForm;
