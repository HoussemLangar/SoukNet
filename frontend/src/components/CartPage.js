import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems = [], removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }), {})
  );

  const validCartItems = cartItems.filter(item => item && (item.images || item.nom));

  const totalPrice = validCartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.prix) || 0;
    const itemQuantity = quantities[item.id] || 1;

    if (!itemPrice) {
      console.error(`Prix invalide pour l'article: ${item.nom}`);
    }

    return total + itemPrice * itemQuantity;
  }, 0);

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 0) {
      const updatedQuantities = { ...quantities, [id]: quantity };
      setQuantities(updatedQuantities);
      localStorage.setItem('quantity', JSON.stringify(updatedQuantities));
    }
  };

  const handleClearCart = () => {
    clearCart();
    localStorage.removeItem('product');
    localStorage.removeItem('quantity');
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      const savedQuantities = JSON.parse(localStorage.getItem('quantity')) || {};
      setQuantities(savedQuantities);
    }
  }, [cartItems]);

  return (
    <div className="cart-page container py-5" style={{ marginTop: '50px', marginBottom: '50px' }}>
      {isLoading ? (
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
      ) : (
        <div>
          <h2 className="mb-4 text-center">Votre Panier</h2>
          {validCartItems.length === 0 ? (
            <p className="text-center alert alert-danger">Votre panier est vide.</p>
          ) : (
            <div>
              <ul className="list-group mb-4">
                {validCartItems.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 p-3 shadow-sm">
                    <div className="d-flex align-items-center">
                      <img
                        src={(Array.isArray(item.images) && item.images[0]) || item.images || "https://via.placeholder.com/200x150"}
                        alt={item.nom || "Article sans nom"}
                        className="img-thumbnail me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div>
                        <h5 className="mb-1">{item.nom}</h5>
                        <small>{item.prix || "0.00"} DT</small>
                        <div className="d-flex align-items-center mt-2">
                          <button className="btn btn-secondary btn-sm me-2" onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}>-</button>
                          <span>{quantities[item.id] || 1}</span>
                          <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}>+</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="fw-bold text-success">
                        {(item.prix * (quantities[item.id] || 1)).toFixed(2)} DT
                      </span>
                      <button className="btn btn-danger ms-3" onClick={() => removeFromCart(item.id)} title="Supprimer">
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-right">Total: <span className="text-success">{totalPrice.toFixed(2)} DT</span></h4>
                <Link to="/adresse" className="btn btn-success btn-lg">Valider la commande</Link>
              </div>
              <button className="btn btn-danger" onClick={handleClearCart}>Vider le panier</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
