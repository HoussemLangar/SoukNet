import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';

const CategoryProductsPage = () => {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'Produits'));
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Liste des produits récupérés:', productsList);

        const filteredProducts = productsList.filter(product => {
          const categoryIdFromDb = product.id_categorie.id; 
          return categoryIdFromDb === categoryId; 
        });

        setProducts(filteredProducts);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

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

  return (
    <div className="products-page container py-5">
      <h2 className="text-center mb-4">Produits de la catégorie</h2>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card product-card shadow-sm">
                  <img
                    src={
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0] 
                        : typeof product.images === 'string' && product.images.trim()
                        ? product.images
                        : 'https://via.placeholder.com/300x200' 
                    }
                    className="card-img-top"
                    alt={product.nom || 'Produit sans nom'}
                  />
                    <div className="card-body">
                      <h5 className="card-title">{product.nom || 'Produit sans nom'}</h5>
                      <p className="card-text">{product.description || 'Aucune description disponible.'}</p>
                      <p className="card-text">
                        <strong>Prix: {product.prix || 'N/A'} DT</strong>
                      </p>
                      <Link to={`/product/${product.id}`} className="btn btn-primary">Voir Détails</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">Aucun produit trouvé dans cette catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
