import React, { useEffect, useState } from "react";
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from "react-router-dom"; 

const HomePage = () => {
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "Produits");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList.slice(0, 6)); 
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="home" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Produits Populaires</h2>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Chargement des produits...</p>
          </div>
        ) : (
          <div className="row">
            {products.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
                <Link to={`/product/${product.id}`}>
                  <div className="card product-card">
                    <img src={product.images[0] || "https://via.placeholder.com/300x200"} className="card-img-top" alt={product.nom} />
                    <div className="card-body">
                      <h5 className="card-title">{product.nom || "Produit sans nom"}</h5>
                      <p className="card-text">{product.description || "Aucune description disponible."}</p>
                      <p className="card-text"><strong>Prix: {product.prix || "N/A"} DT</strong></p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center">
          <Link to="/products" className="btn btn-primary mt-4">Voir tous les produits</Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
