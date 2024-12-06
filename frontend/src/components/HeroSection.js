import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/products?name=${searchTerm}`);
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        <h1>Bienvenue à SoukNet</h1>
        <p>Trouvez les meilleurs produits au meilleur prix</p>

        <form onSubmit={handleSearch} className="d-flex search-bar mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Rechercher un produit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ borderRadius: '0.25rem 0 0 0.25rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 0.25rem 0.25rem 0' }}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
