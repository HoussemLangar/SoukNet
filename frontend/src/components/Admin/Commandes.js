import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Button, Table, Badge, Modal, Form } from "react-bootstrap";

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmation de suppression
  const [selectedCommandes, setSelectedCommandes] = useState([]); // Liste des commandes sélectionnées
  const [selectAll, setSelectAll] = useState(false); // Etat de la case "Sélectionner tout"
  const [commandeToDelete, setCommandeToDelete] = useState(null); // Commande à supprimer

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const commandesCollection = collection(db, "Commandes");
        const commandesSnapshot = await getDocs(commandesCollection);
        const commandesData = commandesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommandes(commandesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const updateStatutCommande = async (id, nouveauStatut) => {
    try {
      const commandeDoc = doc(db, "Commandes", id);
      await updateDoc(commandeDoc, {
        statutCommande: nouveauStatut,
        date_modification: new Date(),
      });
      setCommandes((prevCommandes) =>
        prevCommandes.map((commande) =>
          commande.id === id ? { ...commande, statutCommande: nouveauStatut } : commande
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const deleteCommande = async (id) => {
    try {
      const commandeDoc = doc(db, "Commandes", id);
      await deleteDoc(commandeDoc);
      setCommandes((prevCommandes) => prevCommandes.filter((commande) => commande.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCommandes([]);
    } else {
      setSelectedCommandes(commandes.map((commande) => commande.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCommande = (id) => {
    setSelectedCommandes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((commandeId) => commandeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedCommandes) {
        await deleteCommande(id);
      }
      setSelectedCommandes([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Erreur lors de la suppression des commandes sélectionnées:", error);
    }
  };

  const handleRowClick = (commande) => {
    setSelectedCommande(commande);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCommande(null);
  };

  const handleShowDeleteModal = (id) => {
    setCommandeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCommandeToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (commandeToDelete) {
      deleteCommande(commandeToDelete);
      setShowDeleteModal(false);
      setCommandeToDelete(null);
    }
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
    <div className="commandes-container py-5">
      <h2 className="text-center mb-4">Liste des Commandes</h2>

      {/* Bouton supprimer les commandes sélectionnées */}
      <Button
        variant="danger"
        onClick={handleDeleteSelected}
        disabled={selectedCommandes.length === 0}
        className="mb-3"
      >
        Supprimer les commandes sélectionnées
      </Button>

      {/* Table des commandes */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                label="Sélectionner tout"
              />
            </th>
            <th>#</th>
            <th>Nom</th>
            <th>Date</th>
            <th>Total</th>
            <th>Méthode de Paiement</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande, index) => (
            <tr key={commande.id} onClick={() => handleRowClick(commande)}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedCommandes.includes(commande.id)}
                  onChange={() => handleSelectCommande(commande.id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{commande.userName}</td>
              <td>
                {commande.date && commande.date.seconds
                  ? new Date(commande.date.seconds * 1000).toLocaleString()
                  : "Date non disponible"}
              </td>
              <td>{commande.total}</td>
              <td>{commande.paymentMethod}</td>
              <td>
                <Badge
                  bg={
                    commande.statutCommande === "En cours"
                      ? "warning"
                      : commande.statutCommande === "Livrée"
                      ? "success"
                      : "danger"
                  }
                >
                  {commande.statutCommande}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatutCommande(commande.id, "Confirmée");
                  }}
                >
                  Confirmer
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatutCommande(commande.id, "Livrée");
                  }}
                >
                  Livrée
                </Button>
                <Button
                  variant="danger"
                  className="me-2"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatutCommande(commande.id, "Annulée");
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  className="me-2"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDeleteModal(commande.id); // Afficher le modal de confirmation
                  }}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de détails */}
      {selectedCommande && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Détails de la Commande</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Nom : </strong>{selectedCommande.userName}</p>
            <p><strong>Adresse : </strong>{selectedCommande.adresse?.rue}, {selectedCommande.adresse?.ville}, {selectedCommande.adresse?.codePostal}</p>
            <p><strong>Téléphone : </strong>{selectedCommande.adresse?.telephone}</p>
            <p><strong>Montant : </strong>{selectedCommande.total} DT</p>
            <p><strong>Date : </strong>{new Date(selectedCommande.date.seconds * 1000).toLocaleString()}</p>
            <p><strong>Statut : </strong>{selectedCommande.statutCommande}</p>
            <p><strong>Méthode de Paiement : </strong>{selectedCommande.paymentMethod}</p>
            <p><strong>Produits : </strong><ul>
              {selectedCommande.cartItems?.map((item, idx) => (
                <li key={idx}>
                  {item.nom} - Quantité : {item.quantity} - Prix : {item.prix}
                </li>
              ))}
            </ul>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Commandes;
