import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Modal, Button } from 'react-bootstrap';
import { getAuth, deleteUser } from 'firebase/auth'; 


const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [utilisateurToDelete, setUtilisateurToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'Utilisateurs');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleModalShow = (user) => {
    setUtilisateurToDelete(user);
    setShowModal(true); 
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (utilisateurToDelete) {
        try {
            const auth = getAuth();

            const userToDelete = await auth.getUserByEmail(utilisateurToDelete.email);
            await deleteUser(userToDelete);

            await deleteDoc(doc(db, "Utilisateurs", utilisateurToDelete.id));

            setUsers(users.filter(user => user.id !== utilisateurToDelete.id));
            setUtilisateurToDelete(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur : ", error);
        }
    }

    // Close the modal after the delete operation
    setShowModal(false);
};

  return (
    <div className="view-users-container py-5">
      <h2 style={{ marginTop: '10px', marginBottom: '50px', textAlign: 'center' }}>Voir Utilisateurs</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nom_utilisateur}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleModalShow(user)} 
                >
                  Supprimer
                </button>
                <Link to={`/dashboard/modifier-utilisateur/${user.id}`} className="btn btn-warning" style={{ marginLeft: '10px' }}>
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewUsers;
