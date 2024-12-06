import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); // Assurez-vous que le spinner est bien utilisé uniquement lors du chargement
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchUserOrders(currentUser.uid);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchUserOrders = async (userId) => {
        try {
            setLoading(true);
            const ordersCollection = collection(db, "Commandes");
            const q = query(ordersCollection, where("userId", "==", userId));
            const ordersSnapshot = await getDocs(q);
            const ordersList = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setOrders(ordersList);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setModalMessage("Êtes-vous sûr de vouloir annuler cette commande ?");
        setModalVisible(true);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;
        setActionLoading(true);
        try {
            const orderDoc = doc(db, "Commandes", selectedOrderId);
            await deleteDoc(orderDoc);
            setOrders(orders.filter(order => order.id !== selectedOrderId));
            setModalMessage("Commande annulée avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'annulation de la commande : ", error);
            setModalMessage("Impossible d'annuler la commande. Veuillez réessayer.");
        } finally {
            setActionLoading(false);
            setSelectedOrderId(null);
        }
    };

    return (
        <div className="container py-5">
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h2 className="text-center mb-4">Mes Commandes</h2>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-3">Chargement des commandes...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="alert alert-warning text-center" role="alert">
                        Aucune commande trouvée.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Produits</th>
                                    <th scope="col">Quantité</th>
                                    <th scope="col">Prix Total</th>
                                    <th scope="col">Statut</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            {order.cartItems && order.cartItems.length > 0
                                                ? order.cartItems.map(item => item.nom).join(', ')
                                                : 'Aucun produit'}
                                        </td>
                                        <td>
                                            {order.cartItems && order.cartItems.length > 0
                                                ? order.cartItems.reduce((total, item) => total + item.quantity, 0)
                                                : 0}
                                        </td>
                                        <td>{order.total} DT</td>
                                        <td>
                                            <span
                                                className={` ${
                                                    order.statutCommande === 'En cours' ? 'alert-warning' :
                                                    order.statutCommande === 'Annulé' ? 'alert-danger' :
                                                    order.statutCommande === 'Livré' ? 'alert-success' :
                                                    'alert-secondary' 
                                                }`}
                                            >
                                                {order.statutCommande}
                                            </span>
                                        </td>
                                        <td>
                                            {order.statutCommande === 'En cours' && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleOpenCancelModal(order.id)}
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalVisible && (
                <div className={`modal fade ${modalVisible ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation</h5>
                                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{modalMessage}</p>
                            </div>
                            <div className="modal-footer">
                                {selectedOrderId ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setModalVisible(false)}
                                            disabled={actionLoading}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleCancelOrder}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Annulation...' : 'Confirmer'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setModalVisible(false)}
                                    >
                                        Fermer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
