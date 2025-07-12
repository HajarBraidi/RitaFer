import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const ClientHome = () => {
  
const [client, setClient] = useState(null);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showProduits, setShowProduits] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProduits, setFilteredProduits] = useState([]);
  const navigate = useNavigate();
  const calculTotal = () => {
  return panier.reduce((total, item) => total + item.total, 0);
  };

  
const [produits, setProduits] = useState([]);


useEffect(() => {
  if (showProduits) {
    axios.get('http://localhost:5000/api/produits')
      .then(res => setProduits(res.data))
      .catch(err => console.error("Erreur mise à jour produits", err));
  }
}, [showProduits]);


useEffect(() => {
  
  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/produits');
      setProduits(res.data);
    } catch (err) {
      console.error('Erreur chargement produits', err);
    }
  };

  fetchProduits();
}, []);

  useEffect(() => {
    // Filtrer les produits lorsque le terme de recherche ou la liste change
    const filtered = produits.filter(produit =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProduits(filtered);
  }, [searchTerm, produits]);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };


const handleValiderCommande = async () => {

    console.log("👤 client:", client);
    console.log("🆔 client._id:", client?._id);
    console.log("🏭 fournisseurSelectionné:", fournisseurSelectionné);
    console.log("🛒 panier:", panier);

  if (!client || !client._id || !fournisseurSelectionné || panier.length === 0) {
    alert("Client ou fournisseur manquant, ou panier vide.");
    return;
  }

    const dataCommande = {
      clientId: client._id,  // ✅ C'était manquant !
      fournisseurId: fournisseurSelectionné._id,
      produits: panier,
      total: calculTotal()
   };

  try {
    console.log("📦 Données envoyées :", dataCommande);

    navigate('/bon-de-commande', {
      state: {
        fournisseur: fournisseurSelectionné,
        panier: panier
      }
    });
  } catch (err) {
    console.error("❌ Erreur axios :", err.response ? err.response.data : err.message);
    alert("Une erreur est survenue lors de l'enregistrement de la commande.");
  }
};

    console.log("📦 client dans handleValiderCommande :", client);



  const supprimerDuPanier = (indexASupprimer) => {
  const nouveauPanier = panier.filter((_, index) => index !== indexASupprimer);
  setPanier(nouveauPanier);
  };


  const [fournisseurSelectionné, setFournisseurSelectionné] = useState(() => {
    const saved = localStorage.getItem('fournisseur');
    return saved ? JSON.parse(saved) : null;
  });

  const [panier, setPanier] = useState(() => {
    const savedPanier = localStorage.getItem('panier');//localStorage est une fonctionnalité du navigateur web qui permet de stocker des données localement sur l’ordinateur de l'utilisateur
    return savedPanier ? JSON.parse(savedPanier) : [];
  });

  const ajouterAuPanier = (produit, type, quantite) => {
    if (!quantite || quantite <= 0) {
      alert("Veuillez saisir une quantité valide.");
      return;
    }
  const prixUnitaire = parseFloat(produit.prix) || 0;
  const item = {
      nom: produit.nom,
      type: type || "standard",
      quantite,
      prixUnitaire,
      total: prixUnitaire * quantite,
      famille: produit.famille || "Autres"
      };
      console.log("🛒 Produit ajouté :", item);
      setPanier((prev) => [...prev, item]);
      };

      // Sauvegarde panier localStorage
     useEffect(() => {
     localStorage.setItem('panier', JSON.stringify(panier));
     }, [panier]);

  // Sauvegarde fournisseur localStorage
     useEffect(() => {
     if (fournisseurSelectionné) {
      localStorage.setItem('fournisseur', JSON.stringify(fournisseurSelectionné));
    }
    }, [fournisseurSelectionné]);


  
  // Récupérer l’utilisateur connecté et les fournisseurs
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setClient(JSON.parse(storedUser));
    }

    axios.get('http://localhost:5000/api/users?role=fournisseur')
      .then(res => setFournisseurs(res.data))
      .catch(err => console.error(err));
    }, []);

  // Mettre à jour fournisseurSelectionné dès que selectedId change
  useEffect(() => {
    const found = fournisseurs.find(f => f._id === selectedId);
    if (found) {
      setFournisseurSelectionné(found);
    }
    }, [selectedId, fournisseurs]);

   const produitsParFamille = filteredProduits.reduce((acc, produit) => {
   const famille = produit.famille || 'Autres';
   if (!acc[famille]) acc[famille] = [];
   acc[famille].push(produit);
   return acc;
   }, {});


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Nos Fournisseurs Partenaires</h1>
          <p className="mt-2 text-lg text-gray-600">Choisissez votre fournisseur et composez votre commande</p>
        </div>

        {/* Section Fournisseurs */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fournisseurs.map((f) => {
              const isExpanded = expandedId === f._id;
              return (
                <div
                  key={f._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg ${
                    selectedId === f._id ? 'ring-2 text-blue-600 border-blue-300' : ''
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="fournisseur"
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={selectedId === f._id}
                        onChange={() => setSelectedId(f._id)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {f.prenom} {f.nom}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-blue-600">
                            ID: {f.fournisseurId}
                          </span>
                        </div>
                        
                        <p className={`mt-1 text-sm text-gray-600 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                          {f.description || "Aucune description disponible"}
                        </p>
                        
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : f._id)}
                          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          {isExpanded ? 'Réduire' : 'Voir plus'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bouton Voir les produits */}
        {selectedId && !showProduits && (
          <div className="text-center mb-12">
            <button
              onClick={() => setShowProduits(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Voir les produits disponibles
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}

        {/* Section Produits */}
        {showProduits && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Liste des produits */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                   <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Rechercher par nom..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {Object.entries(produitsParFamille).map(([famille, produitsFamille]) => (
                <div key={famille} className="mb-10">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{famille}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {produitsFamille.map((produit) => (
                      <div key={produit.nom} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        {produit.image && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={`http://localhost:5000${produit.image}`}
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="p-5">
                          <h4 className="text-lg font-medium text-gray-900 mb-1">{produit.nom}</h4>
                          <p className="text-blue-600 font-semibold mb-3">{produit.prix} MAD</p>
                          
                          {produit.types?.length > 0 ? (
                            produit.types.map((type) => (
                              <div key={type} className="flex items-center justify-between mb-2 last:mb-0">
                                <span className="text-sm font-medium text-gray-700">{type}</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    placeholder="Qté"
                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                    min="1"
                                    id={`qty-${produit.nom}-${type}`}
                                  />
                                  <button
                                    onClick={() => {
                                      const input = document.getElementById(`qty-${produit.nom}-${type}`);
                                      ajouterAuPanier(produit, type, parseInt(input.value));
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Ajouter
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Standard</span>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  placeholder="Qté"
                                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  min="1"
                                  id={`qty-${produit.nom}`}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`qty-${produit.nom}`);
                                    ajouterAuPanier(produit, null, parseInt(input.value));
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Ajouter
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Panier */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">Votre Panier</h3>
                </div>
                
                <div className="p-6">
                  {panier.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h4 className="mt-2 text-sm font-medium text-gray-900">Panier vide</h4>
                      <p className="mt-1 text-sm text-gray-500">Ajoutez des produits pour commencer</p>
                    </div>
                  ) : (
                    <>
                      <div className="flow-root">
                        <ul className="-my-4 divide-y divide-gray-200">
                          {panier.map((item, index) => (
                            <li key={index} className="py-4 flex">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.nom} {item.type && `(${item.type})`}
                                </p>
                                <p className="text-sm text-gray-500">{item.quantite} × {item.prixUnitaire} MAD</p>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <span className="text-sm font-semibold text-gray-900 mr-3">
                                  {item.total} MAD
                                </span>
                                <button
                                  onClick={() => supprimerDuPanier(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>                     
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total</p>
                          <p>{calculTotal()} MAD</p>
                        </div>
                        
                        <div className="mt-6">
                          <button
                            onClick={handleValiderCommande}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-500"
                          >
                            Valider la commande
                            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHome;