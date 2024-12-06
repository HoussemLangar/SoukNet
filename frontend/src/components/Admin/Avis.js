import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Table, Button, Modal, Badge, Form } from "react-bootstrap";

const Avis = () => {
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAvis, setSelectedAvis] = useState(null);
  const [selectedAvisIds, setSelectedAvisIds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const avisCollection = collection(db, "Avis");
        const avisSnapshot = await getDocs(avisCollection);
        const avisData = avisSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvis(avisData);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvis();
  }, []);

  const handleAvisSelection = (id) => {
    setSelectedAvisIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAvisIds.length === avis.length) {
      setSelectedAvisIds([]);
    } else {
      setSelectedAvisIds(avis.map((avisItem) => avisItem.id));
    }
  };

  const deleteAvis = async (id) => {
    try {
      const avisDoc = doc(db, "Avis", id);
      await deleteDoc(avisDoc);
      setAvis((prevAvis) => prevAvis.filter((avis) => avis.id !== id));
      setSelectedAvisIds((prevIds) => prevIds.filter((id) => id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
    }
  };

  const deleteSelectedAvis = async () => {
    try {
      await Promise.all(
        selectedAvisIds.map(async (id) => {
          const avisDoc = doc(db, "Avis", id);
          await deleteDoc(avisDoc);
        })
      );
      setAvis((prevAvis) => prevAvis.filter((avis) => !selectedAvisIds.includes(avis.id)));
      setSelectedAvisIds([]);
    } catch (error) {
      console.error("Erreur lors de la suppression des avis sélectionnés :", error);
    }
  };

  const handleShowModal = (avis) => {
    setSelectedAvis(avis);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAvis(null);
  };

  const handleShowDeleteConfirmation = (avis) => {
    setSelectedAvis(avis);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setSelectedAvis(null);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="avis-container py-5">
      <h2 className="text-center mb-4">Liste des Avis</h2>

      <Form.Check
        type="checkbox"
        label="Sélectionner tous les avis"
        checked={selectedAvisIds.length === avis.length}
        onChange={handleSelectAll}
        className="mb-3"
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Utilisateur</th>
            <th>Note</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {avis.map((avisItem, index) => (
            <tr key={avisItem.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedAvisIds.includes(avisItem.id)}
                  onChange={() => handleAvisSelection(avisItem.id)}
                />
              </td>
              <td>{avisItem.nom_utilisateur || "Utilisateur anonyme"}</td>
              <td>
                <Badge bg="info">{avisItem.note}</Badge>
              </td>
              <td>
                {avisItem.date_creation &&
                  new Date(avisItem.date_creation.seconds * 1000).toLocaleString()}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(avisItem)}
                >
                  Voir Détails
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowDeleteConfirmation(avisItem)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour afficher les détails d'un avis */}
      {selectedAvis && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Détails de l'Avis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Commentaire :</strong> {selectedAvis.commentaire || "Pas de commentaire"}</p>
            <p><strong>Date de création :</strong> {selectedAvis.date_creation && new Date(selectedAvis.date_creation.seconds * 1000).toLocaleString()}</p>
            <p><strong>ID Produit :</strong> {selectedAvis.id_produit}</p>
            <p><strong>ID Utilisateur :</strong> {selectedAvis.id_utilisateur}</p>
            <p><strong>Nom Utilisateur :</strong> {selectedAvis.nom_utilisateur}</p>
            <p><strong>Note :</strong> {selectedAvis.note}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal pour la confirmation de suppression */}
      {selectedAvis && (
        <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Êtes-vous sûr de vouloir supprimer cet avis ?</p>
            <p><strong>Utilisateur :</strong> {selectedAvis.nom_utilisateur}</p>
            <p><strong>Commentaire :</strong> {selectedAvis.commentaire}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteAvis(selectedAvis.id);
                handleCloseDeleteConfirmation();
              }}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Button to delete all selected avis */}
      {selectedAvisIds.length > 0 && (
        <Button
          variant="danger"
          className="mt-3"
          onClick={deleteSelectedAvis}
        >
          Supprimer tous les avis sélectionnés
        </Button>
      )}
    </div>
  );
};

export default Avis;
