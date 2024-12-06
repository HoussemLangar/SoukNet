import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const productCollection = collection(db, "Produits");
            const productSnapshot = await getDocs(productCollection);
            const productList = productSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        };
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        if (productToDelete) {
            await deleteDoc(doc(db, "Produits", productToDelete.id));
            setProducts(products.filter(product => product.id !== productToDelete.id));
            setProductToDelete(null);
        }
        setShowModal(false);
    };

    const handleModalShow = (product) => {
        setProductToDelete(product);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="crud-container">
            <h2 className="crud-title">Liste des Produits</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.nom}</td>
                            <td>{product.description}</td>
                            <td>{product.prix} DT</td>
                            <td>
                                <button className="btn btn-warning" style={{ marginLeft: "10px" }}>
                                    <Link 
                                        className="nav-link" 
                                        to={`/dashboard/modifier/${product.id}`}
                                        style={{ color: "inherit", textDecoration: "none" }}
                                    >
                                        Modifier
                                    </Link>
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={() => handleModalShow(product)} 
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
                    Êtes-vous sûr de vouloir supprimer ce produit ?
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

export default Product;
