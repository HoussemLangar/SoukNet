import React, { useEffect, useState } from "react";
import { db, auth } from '../firebase'; 
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, Link, useNavigate } from "react-router-dom"; 
import { onAuthStateChanged } from "firebase/auth"; 
import '../css/style.css'; 
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); 
  const [newReview, setNewReview] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [reviewErrorMessage, setReviewErrorMessage] = useState(""); 
  const { addToCart } = useCart(); 
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState('');


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, "Produits", id);
        const productSnapshot = await getDoc(productDoc);
  
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setErrorMessage("Produit introuvable !");
        }
      } catch (error) {
        setErrorMessage("Erreur lors de la récupération du produit.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const productsCollection = collection(db, "Produits");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList); 
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, "Avis");
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsList = reviewsSnapshot.docs
          .filter(doc => doc.data().id_produit === id)
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      setUser(user); 
    });

    fetchProduct();
    fetchAllProducts();
    fetchReviews();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.quantite) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const submitReview = async () => {
    if (!user) {
      navigate('/login'); 
      return;
    }

    if (rating < 1 || rating > 5 || newReview.trim() === "") {
      setReviewErrorMessage("Veuillez fournir une note valide et un commentaire.");
      return;
    }

    try {
      const newReviewDoc = {
        id_produit: id,
        id_utilisateur: user.uid,
        nom_utilisateur: user.displayName || "Utilisateur anonyme",
        commentaire: newReview,
        note: rating,
        date_creation: serverTimestamp(),
      };
      await addDoc(collection(db, "Avis"), newReviewDoc);
      setReviews(prevReviews => [...prevReviews, newReviewDoc]);
      setNewReview(""); 
      setRating(0); 
      setReviewErrorMessage(""); 
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis : ", error);
      setReviewErrorMessage("Erreur lors de l'ajout de l'avis.");
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

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity); 
        setMessage(`Ajouté au panier: ${product.nom}, Quantité: ${quantity}`);
        setMessageType('success');
        setTimeout(() => {
            setMessage("");
        }, 10000);
    }
};

const handleGoToCart = () => {
  navigate('/cart');
};

  return (
    <div className="product-detail-page container py-5">
      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
          {messageType === "success" && (
            <button 
              onClick={handleGoToCart} 
              className="btn-go-to-cart"
            >
              Voir le panier
            </button>
          )}
        </div>
      )}

      {/* Produit Principal */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
          <div className="col-md-6">
                {product.images && product.images.length > 0 ? (
                <div id="productImages" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        {product.images.map((image, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <img
                                src={product.images[0] || 'https://via.placeholder.com/400x300'}
                                alt={product.nom}
                                className="img-fluid product-image"
                                style={{ cursor: "pointer", maxWidth: '100%', height: 'auto' }} 
                                onClick={() => window.open(image, "_blank")} 
                            />
                        </div>
                        ))}
                    </div>
                    <a className="carousel-control-prev" href="#productImages" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Précédent</span>
                    </a>
                    <a className="carousel-control-next" href="#productImages" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Suivant</span>
                    </a>
                </div>
            ) : (
            <img
                src="https://via.placeholder.com/400x300"
                alt={product.nom}
                className="img-fluid product-image"
                style={{ cursor: "pointer", maxWidth: '100%', height: 'auto' }} 
                onClick={() => window.open("https://via.placeholder.com/400x300", "_blank")} 
            />
        )}
    </div>
            <div className="col-md-6 product-info">
              <h2 className="product-name">{product.nom}</h2>
              <p className="product-price" style={{ fontSize: "24px", fontWeight: "bold" }}>
                Prix: {product.prix} DT
              </p>
              <p>Émetteur: {product.emetteur || "Non spécifié"}</p>
              <p>Date d'ajout: {product.date_creation?.toDate().toLocaleDateString() || "Non spécifiée"}</p>
              <p
                className="product-status"
                style={{ color: product.statut === "Disponible" ? "green" : "red" }}
              >
                {product.statut === "Disponible" ? "Disponible" : "Vendu"}
              </p>
              <p>Quantité disponible: {product.quantite}</p>

              {/* Input pour quantité */}
              <div className="input-group mb-3" style={{ maxWidth: "120px" }}>
                <div className="input-group-prepend">
                  <button onClick={decreaseQuantity} className="btn btn-outline-secondary">-</button>
                </div>
                <input type="text" className="form-control" value={quantity} readOnly />
                <div className="input-group-append">
                  <button onClick={increaseQuantity} className="btn btn-outline-secondary">+</button>
                </div>
              </div>
              {/* Boutons */}
              <div className="button-group">
              <button 
                className="btn btn-dark btn-lg" 
                onClick={handleAddToCart} 
                disabled={product.quantite === 0} 
              >
                Ajouter au panier
              </button>
              </div>
            </div>
          </div>

          {/* Description du produit */}
          <div className="product-description-section mt-4">
            <h3>Description</h3>
            <p>{product.description || "Aucune description disponible."}</p>
          </div>
        </div>
      </div>

      {/* Avis Section */}
      <div className="product-reviews-section card mb-4">
        <div className="card-body">
          <h3>Avis</h3>
          {reviewErrorMessage && (
            <div className="alert alert-danger">{reviewErrorMessage}</div>
          )}
          {!user && (
            <button 
              className="btn btn-primary mb-2" 
              onClick={() => navigate('/login')} 
            >
              Se connecter pour ajouter un avis
            </button>
          )}
          {user && (
            <div className="add-review">
              <div className="rating-input mt-2">
                {Array(5).fill(0).map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setRating(index + 1)}
                    style={{ cursor: "pointer", color: index < rating ? "gold" : "gray", fontSize: '20px' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Ajouter un avis"
                rows="3"
                className="form-control mt-2"
              ></textarea>
              <button className="btn btn-primary mt-2" onClick={submitReview}>
                Soumettre l'avis
              </button>
            </div>
          )}

          {/* Affichage des avis */}
          <div className="reviews-list mt-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p><strong>{review.nom_utilisateur}: </strong>{Array(5).fill(0).map((_, i) => (
                    <span key={i} style={{ color: i < review.note ? "gold" : "gray", fontSize: '16px' }}>★</span>
                  ))}</p>
                  <p>{review.commentaire}</p>
                </div>
              ))
            ) : (
              <p>Aucun avis disponible.</p>
            )}
          </div>
        </div>
      </div>

      {/* Affichage d'autres produits */}
      <div className="other-products-section">
        <h4>Autres produits</h4>
        <div className="row">
          {products
            .filter(otherProduct => otherProduct.id !== id)
            .map(otherProduct => (
              <div key={otherProduct.id} className="col-md-3 mb-4">
                <div className="card">
                  <img
                    src={otherProduct.images[0] || "https://via.placeholder.com/200x150"}
                    className="card-img-top"
                    alt={otherProduct.nom}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{otherProduct.nom}</h5>
                    <p className="card-text">
                      Prix: {otherProduct.prix} DT
                    </p>
                    <Link to={`/product/${otherProduct.id}`} className="btn btn-primary">
                      Voir Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
