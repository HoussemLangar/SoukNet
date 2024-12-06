import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Adresses = () => {
  const [adresses, setAdresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdresse, setSelectedAdresse] = useState(null);
  const [selectedAdresseIds, setSelectedAdresseIds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchAdresses = async () => {
      try {
        const adressesCollection = collection(db, "Adresses");
        const adressesSnapshot = await getDocs(adressesCollection);
        const adressesData = adressesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdresses(adressesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdresses();
  }, []);

  const handleAdresseSelection = (id) => {
    setSelectedAdresseIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAdresseIds.length === adresses.length) {
      setSelectedAdresseIds([]);
    } else {
      setSelectedAdresseIds(adresses.map((adresseItem) => adresseItem.id));
    }
  };

  const deleteAdresse = async (id) => {
    try {
      const adresseDoc = doc(db, "Adresses", id);
      await deleteDoc(adresseDoc);
      setAdresses((prevAdresses) => prevAdresses.filter((adresse) => adresse.id !== id));
      setSelectedAdresseIds((prevIds) => prevIds.filter((id) => id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse :", error);
    }
  };

  const deleteSelectedAdresses = async () => {
    try {
      await Promise.all(
        selectedAdresseIds.map(async (id) => {
          const adresseDoc = doc(db, "Adresses", id);
          await deleteDoc(adresseDoc);
        })
      );
      setAdresses((prevAdresses) => prevAdresses.filter((adresse) => !selectedAdresseIds.includes(adresse.id)));
      setSelectedAdresseIds([]);
    } catch (error) {
      console.error("Erreur lors de la suppression des adresses sélectionnées :", error);
    }
  };

  const handleShowModal = (adresse) => {
    setSelectedAdresse(adresse);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdresse(null);
  };

  const handleShowDeleteConfirmation = (adresse) => {
    setSelectedAdresse(adresse);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setSelectedAdresse(null);
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
    <div className="adresses-container py-5">
      <h2 className="text-center mb-4">Liste des Adresses</h2>

      <Form.Check
        type="checkbox"
        label="Sélectionner toutes les adresses"
        checked={selectedAdresseIds.length === adresses.length}
        onChange={handleSelectAll}
        className="mb-3"
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Rue</th>
            <th>Code Postal</th>
            <th>Ville</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adresses.map((adresseItem, index) => (
            <tr key={adresseItem.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedAdresseIds.includes(adresseItem.id)}
                  onChange={() => handleAdresseSelection(adresseItem.id)}
                />
              </td>
              <td>{adresseItem.rue}</td>
              <td>{adresseItem.codePostal}</td>
              <td>{adresseItem.ville}</td>
              <td>{adresseItem.telephone}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(adresseItem)}
                >
                  Voir Détails
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowDeleteConfirmation(adresseItem)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour afficher les détails d'une adresse */}
      {selectedAdresse && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Détails de l'Adresse</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Rue :</strong> {selectedAdresse.rue}</p>
            <p><strong>Code Postal :</strong> {selectedAdresse.codePostal}</p>
            <p><strong>Ville :</strong> {selectedAdresse.ville}</p>
            <p><strong>Téléphone :</strong> {selectedAdresse.telephone}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal pour la confirmation de suppression */}
      {selectedAdresse && (
        <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Êtes-vous sûr de vouloir supprimer cette adresse ?</p>
            <p><strong>Rue :</strong> {selectedAdresse.rue}</p>
            <p><strong>Code Postal :</strong> {selectedAdresse.codePostal}</p>
            <p><strong>Ville :</strong> {selectedAdresse.ville}</p>
            <p><strong>Téléphone :</strong> {selectedAdresse.telephone}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteAdresse(selectedAdresse.id);
                handleCloseDeleteConfirmation();
              }}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Button to delete all selected adresses */}
      {selectedAdresseIds.length > 0 && (
        <Button
          variant="danger"
          className="mt-3"
          onClick={deleteSelectedAdresses}
        >
          Supprimer toutes les adresses sélectionnées
        </Button>
      )}
    </div>
  );
};

export default Adresses;
