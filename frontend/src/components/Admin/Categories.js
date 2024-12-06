import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryCollection = collection(db, "Categories");
            const categorySnapshot = await getDocs(categoryCollection);
            const categoryList = categorySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoryList);
        };
        fetchCategories();
    }, []);

    const handleDelete = async () => {
        if (categoryToDelete) {
            await deleteDoc(doc(db, "Categories", categoryToDelete.id));
            setCategories(categories.filter(category => category.id !== categoryToDelete.id));
            setCategoryToDelete(null);
        }
        setShowModal(false);
    };

    const handleModalShow = (category) => {
        setCategoryToDelete(category);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCategoryToDelete(null);
    };

    return (
        <div className="crud-container">
            <h2 className="crud-title">Liste des Catégories</h2>
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.nom}</td>
                            <td>
                                <button className="btn btn-warning" style={{ marginLeft: "10px" }}>
                                    <Link
                                        className="nav-link"
                                        to={`/dashboard/modifier-categorie/${category.id}`}
                                        style={{ color: "inherit", textDecoration: "none" }}
                                    >
                                        Modifier
                                    </Link>
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleModalShow(category)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Supprimer
                                </button>
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
                    Êtes-vous sûr de vouloir supprimer cette catégorie ?
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

export default Categories;
