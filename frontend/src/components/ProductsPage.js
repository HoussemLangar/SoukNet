import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom'; 

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('name'); 
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'Produits'));
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        
        const minPrice = Math.min(...productsList.map(product => product.prix));
        const maxPrice = Math.max(...productsList.map(product => product.prix));
        setPriceRange([minPrice, maxPrice]);
        
        setFilteredProducts(productsList);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des produits');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'Categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        const categoryIdFromDb = product.id_categorie.id; 
        return selectedCategories.includes(categoryIdFromDb); 
      });
    }

    filtered = filtered.filter(
      product => product.prix >= priceRange[0] && product.prix <= priceRange[1]
    );

    if (statusFilter) {
      filtered = filtered.filter(product => product.statut === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategories, priceRange, statusFilter, products, searchTerm]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(cat => cat !== value) : [...prev, value]
    );
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
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
  </div> )
    } 

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="products-page container py-5">
      <div className="row">
        {/* Sidebar - Filtres */}
        <div className="col-md-3">
          <div className="filters-container shadow-sm p-4 rounded">
            <h3>Filtres</h3>

            {/* Filtrer par catégorie */}
            <div className="filter-section mb-3">
              <h5>Catégories</h5>
              {categories.map(category => (
                <div key={category.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={category.id}
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCategoryChange}
                  />
                  <label className="form-check-label" htmlFor={category.id}>{category.nom}</label>
                </div>
              ))}
            </div>

            {/* Filtrer par prix */}
            <div className="filter-section mb-3">
              <h5>Prix Maximum</h5>
              <input
                type="range"
                className="form-range"
                min={priceRange[0]} 
                max="10000"
                value={priceRange[1]}
                onChange={handlePriceChange}
              />
              <span>{priceRange[1]} DT</span>
            </div>

            {/* Filtrer par statut */}
            <div className="filter-section mb-3">
              <h5>Statut</h5>
              <select className="form-select" value={statusFilter} onChange={handleStatusChange}>
                <option value="">Tous les statuts</option>
                <option value="Disponible">Disponible</option>
                <option value="Vendu">Vendu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="col-md-9">
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
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
                      <Link to={`/product/${product.id}`} className="btn btn-primary">Voir Détails</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">Aucun produit trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
