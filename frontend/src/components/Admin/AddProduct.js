import React, { useState, useEffect } from 'react';
import { db, Timestamp } from '../../firebase'; 
import { addDoc, collection, getDocs, doc, query, where } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTags, faClipboardList, faDollarSign, faPhone, faIdCard, faMoneyBillWave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';


const AddProduct = () => {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [emetteur, setEmetteur] = useState(""); 
    const [id_categorie, setIdCategorie] = useState("");
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]); 
    const [prix, setPrix] = useState("");
    const [quantite, setQuantite] = useState("");
    const [methodRemboursement, setMethodRemboursement] = useState(""); 
    const [cin, setCin] = useState(""); 
    const [telephone, setTelephone] = useState(""); 
    const [rib, setRib] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userRef, setUserRef] = useState(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryCollection = collection(db, "Categories");
            const categorySnapshot = await getDocs(categoryCollection);
            const categoryList = categorySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoryList);
        };

        const fetchUserName = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userEmail = user.email;
                const userQuery = query(collection(db, "Utilisateurs"), where("email", "==", userEmail));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setEmetteur(userData.nom_utilisateur);
                    setUserRef(doc(db, "Utilisateurs", userSnapshot.docs[0].id)); 
                }
            } else {
                setErrorMessage("Aucun utilisateur connecté.");
            }
        };

        fetchCategories();
        fetchUserName();
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setImages(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nom || !description || !emetteur || !id_categorie || !prix || !quantite || !methodRemboursement || (methodRemboursement === 'par_mondat' && (!cin || !telephone)) || (methodRemboursement === 'par_rib' && (!telephone || !rib))) {
            setErrorMessage("Tous les champs sont requis.");
            return;
        }

        const dateCreation = Timestamp.now();
        const dateModification = Timestamp.now();
        const categoryRef = doc(db, "Categories", id_categorie);
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null; 

        const newProduct = {
            nom,
            description,
            emetteur,
            id_categorie: categoryRef,
            images,
            prix: parseFloat(prix),
            quantite: parseInt(quantite),
            statut: "Disponible",
            date_creation: dateCreation,
            date_modification: dateModification,
            methodRemboursement,
            cin,
            telephone,
            rib,
            userId: userId, 
        };

        try {
            await addDoc(collection(db, "Produits"), newProduct);
            setSuccessMessage("Produit créé avec succès !");
            setTimeout(() => {
                navigate('/produits');
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de l'ajout du produit : ", error);
            setErrorMessage("Erreur lors de l'ajout du produit.");
        }
    };

    const handleImageRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="add-product-container py-5" style={{ marginTop: '50px' , marginBottom: '50px' }}>
            <h2 className="add-product-title text-center">Ajouter un Produit</h2>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>} 
            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>} 
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-grid">
                    <div className="form-column">
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faTags} /> Nom du Produit</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={nom} 
                                onChange={(e) => setNom(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faClipboardList} /> Description</label>
                            <textarea 
                                className="input-field" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faImage} /> Émetteur</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={emetteur} 
                                readOnly 
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faImage} /> Images</label>
                            <input 
                                type="file" 
                                className="input-field" 
                                accept="image/*" 
                                multiple 
                                onChange={handleImageUpload} 
                            /> 
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faTags} /> Catégorie</label>
                            <select 
                                className="input-field" 
                                value={id_categorie} 
                                onChange={(e) => setIdCategorie(e.target.value)} 
                                required
                            >
                                <option value="">Sélectionnez une catégorie</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.nom}
                                    </option>
                                ))}
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                    <Link className="dropdown-item" to="/add-category-request">
                                        <FontAwesomeIcon icon={faPlusCircle} /> Demande d'ajout d'une catégorie
                                    </Link>
                                    </li>
                                </ul>

                            </select>
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faDollarSign} /> Prix</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                value={prix} 
                                onChange={(e) => setPrix(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faMoneyBillWave} /> Quantité</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                value={quantite} 
                                onChange={(e) => setQuantite(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-field">
                            <label className="label"><FontAwesomeIcon icon={faMoneyBillWave} /> Méthode de Remboursement</label>
                            <select 
                                className="input-field" 
                                value={methodRemboursement} 
                                onChange={(e) => setMethodRemboursement(e.target.value)} 
                                required
                            >
                                <option value="">Sélectionnez une méthode</option>
                                <option value="par_mondat">Par Mandat</option>
                                <option value="par_rib">Par RIB</option>
                            </select>
                        </div>
                        {methodRemboursement && (
                            <>
                                <div className="form-field">
                                    <label className="label"><FontAwesomeIcon icon={faPhone} /> Téléphone</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={telephone} 
                                        onChange={(e) => setTelephone(e.target.value)} 
                                        required 
                                    />
                                </div>
                                {methodRemboursement === 'par_rib' && (
                                    <div className="form-field">
                                        <label className="label"><FontAwesomeIcon icon={faIdCard} /> RIB</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={rib} 
                                            onChange={(e) => setRib(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                )}
                                {methodRemboursement === 'par_mondat' && (
                                    <div className="form-field">
                                        <label className="label"><FontAwesomeIcon icon={faIdCard} /> CIN</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            value={cin} 
                                            onChange={(e) => setCin(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {images.length > 0 && (
                <div className="uploaded-images">
                    {images.map((image, index) => (
                        <div key={index} className="uploaded-image">
                            <img src={image} alt={`Upload ${index}`} />
                            <button type="button" onClick={() => handleImageRemove(index)}>Supprimer</button>
                        </div>
                    ))}
                </div>
            )}
                </div>

                <div className="button-group d-flex justify-content-end mt-4">
                    <button type="submit" className="btn-submit">Créer</button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
