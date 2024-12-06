import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import '../App.css';

const Avis = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsCollection = collection(db, "Avis");
                const reviewsSnapshot = await getDocs(reviewsCollection);
                const reviewsList = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const updatedReviews = await Promise.all(reviewsList.map(async review => {
                    let productDoc = null;
                    let productName = "Produit inconnu"; // Valeur par défaut pour nom_produit
                    
                    if (review.id_produit) {
                        // Correction pour extraire correctement l'ID du produit
                        const productDocRef = doc(db, "Produits", review.id_produit.split('/')[2] || review.id_produit);
                        productDoc = await getDoc(productDocRef);

                        if (productDoc.exists()) {
                            productName = productDoc.data().nom || "Produit inconnu";
                        }
                    }

                    return {
                        ...review,
                        nom_produit: productName 
                    };
                }));

                setReviews(updatedReviews);
            } catch (error) {
                console.error("Erreur lors de la récupération des avis: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (numStars) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < numStars ? "text-warning" : "text-muted"}>★</span>
            );
        }
        return <div>{stars}</div>;
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString('fr-FR', { timeZone: 'UTC' });
        }
        return "Date inconnue";
    };

    return (
        <section className="reviews-section">
            <div className="container">
                <h2 className="text-center mb-4" style={{ marginTop: '40px' }}>Avis des Utilisateurs</h2> 
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Chargement...</span>
                        </div>
                        <p>Chargement des avis...</p>
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {reviews.length > 0 ? (
                                <div className="row">
                                    {reviews.map(review => (
                                        <div key={review.id} className="col-md-4 mb-4">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h5 className="card-title">{review.nom_utilisateur || "Utilisateur Anonyme"}</h5>
                                                    <div className="stars mb-2">
                                                        {renderStars(review.note || 0)} 
                                                    </div>
                                                    <p className="card-text">{review.commentaire || "Pas de texte disponible."}</p>
                                                    <p className="card-text">
                                                        <small className="text-muted">Produit: {review.nom_produit || "Produit inconnu"}</small>
                                                    </p>
                                                    <p className="card-text">
                                                        <small className="text-muted">Date: {formatDate(review.date_creation) || "Date inconnue"}</small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center">Aucun avis disponible.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Avis;
