import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const MyProductsPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserIdAndProducts = async () => {
      if (!user || !user.uid) {
        setErrorMessage('Utilisateur non valide.');
        setIsLoading(false);
        return;
      }

      try {
        const productsCollection = collection(db, 'Produits');
        const productsQuery = query(productsCollection, where('userId', '==', user.uid));
        const productsSnapshot = await getDocs(productsQuery);

        if (!productsSnapshot.empty) {
          const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Liste des produits récupérés:', productsList);
          setProducts(productsList);
        } else {
          setErrorMessage('Aucun produit trouvé pour cet utilisateur.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        setErrorMessage('Erreur lors de la récupération des produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserIdAndProducts();
  }, [user]);

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

  return (
    <div className="my-products-page container py-5" style={{ marginTop: '30px', marginBottom: '50px' }}>
      <h2 className="text-center mb-4">Vos Produits</h2>
      {errorMessage && <div className="text-center alert alert-danger" role="alert">{errorMessage}</div>} 
      
      {/* Button to add a product */}
      <div className="text-center mb-4">
        <Link to="/add-product" className="btn btn-success">Ajouter un Produit</Link>
      </div>
      
      <div className="row">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card product-card shadow-sm">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/300x200'}
                  className="card-img-top"
                  alt={product.nom || 'Produit sans nom'}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.nom || 'Produit sans nom'}</h5>
                  <p className="card-text">{product.description || 'Aucune description disponible.'}</p>
                  <p className="card-text">
                    <strong>Prix: {product.prix || 'N/A'} DT</strong>
                  </p>
                  <Link to={`/product-my-page/${product.id}`} className="btn btn-primary">Voir Détails</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center"></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductsPage;
