import React, { useEffect, useState } from 'react';
import axios from 'axios'; //bibliothèque JavaScript qui permet de faire des requêtes HTTP depuis un navigateur matalan pour récuper les donner de puis la backend(c-a-d la base de donner)
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

  const ClientHome = () => {

  const [client, setClient] = useState(null);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showProduits, setShowProduits] = useState(false);
  
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

    await axios.post('http://localhost:5000/api/orders', dataCommande);

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

   const produitsParFamille = produits.reduce((acc, produit) => {
  const famille = produit.famille || 'Autres';
  if (!acc[famille]) acc[famille] = [];
  acc[famille].push(produit);
  return acc;
}, {});


  return (
    <div className="bg-gradient-to-bl bg-gray-100 min-h-screen font-sans">
      <Header />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nos Fournisseurs</h2>

        {/* Fournisseurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fournisseurs.map((f) => {
            const isExpanded = expandedId === f._id;
            return (
              <div
                key={f._id}
                className={`bg-white rounded-lg border shadow p-4 transition duration-300 hover:shadow-lg ${selectedId === f._id ? 'ring-2 ring-blue-500' : ''}`}>
                <label className="cursor-pointer block h-full">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="fournisseur"
                      className="mt-1 accent-blue-600"
                      checked={selectedId === f._id}
                      onChange={() => setSelectedId(f._id)}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">{f.prenom} {f.nom}</h3>
                      <p className="text-sm text-gray-600">ID: {f.fournisseurId}</p>
                      <p className={`text-gray-700 text-sm ${!isExpanded ? 'overflow-hidden text-ellipsis max-h-24' : ''}`}>
                        Informations: {f.description}
                      </p>
                      <div className="px-1 py-4">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : f._id)}
                          className="text-blue-500 hover:underline">
                          {isExpanded ? 'Masquer' : 'Voir détails'}
                        </button>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {/* Voir produits */}
        {selectedId && !showProduits && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowProduits(true)}
              className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300">
              Voir les produits
            </button>
          </div>
        )}

        {/* Section Produits */}
        {showProduits && (
          <div className="mt-10 flex gap-6">
            {/* Produits */}
            <div className="w-2/3">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Produits disponibles</h3>
              {Object.entries(produitsParFamille).map(([famille, produitsFamille]) => (

                <div key={famille} className="mb-10">
                  <h4 className="text-xl font-bold mb-4 text-blue-800">{famille}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                    {produitsFamille.map((produit) => (
                      <div key={produit.nom} className="bg-white p-4 rounded border shadow">
                        {produit.image && (
                          <img
                            src={`http://localhost:5000${produit.image}`}
                            alt={produit.nom}
                            className="w-full h-40 object-cover mb-3 rounded"
                          />
                        )}
                        <h5 className="text-lg font-semibold mb-2">{produit.nom}</h5>
                        <p className="text-sm text-gray-500 mb-2">{produit.prix}</p>

                        {produit.types?.length > 0 ? (
                          produit.types.map((type) => (
                            <div key={type} className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium w-24">{type}</span>
                              <input
                                type="number"
                                placeholder="Qté"
                                className="border p-1 w-20 text-sm rounded"
                                min="1"
                                id={`qty-${produit.nom}-${type}`}
                              />
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`qty-${produit.nom}-${type}`);
                                  ajouterAuPanier(produit, type, parseInt(input.value));
                                }}
                                className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 text-white text-sm px-3 py-1"
                              >
                                Ajouter
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="number"
                              placeholder="Qté"
                              className="border p-1 w-20 text-sm rounded"
                              min="1"
                              id={`qty-${produit.nom}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`qty-${produit.nom}`);
                                ajouterAuPanier(produit, null, parseInt(input.value));
                              }}
                              className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 text-white text-sm px-3 py-1"
                            >
                              Ajouter
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Panier */}
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit sticky top-[200px]">
              <h3 className="text-xl font-bold mb-4 text-gray-800">🛒 Panier</h3>
              {panier.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun produit ajouté.</p>
              ) : (
                <>
                  <table className="w-full text-sm mb-4">
                    <thead className="border-b font-semibold text-left">
                      <tr>
                        
                        <th>Produit</th>
                        <th>Qté</th>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                    {panier.map((item, index) => (
                    <tr key={index} className="border-b">
      
                    <td>
                    {item.nom} ({item.type})</td>
                    <td>{item.quantite}</td>
                    <td> <button
                    onClick={() => supprimerDuPanier(index)}
                    className="ml-2 text-red-600 hover:text-red-800 text-xs"
                    title="Supprimer"
                    >
                  Supprimer
                 </button>
               </td>
     
    </tr>
  ))}
</tbody>


                  </table>
                  <div className="text-right font-bold mb-2">
                    Total: {panier.reduce((sum, item) => sum + item.total, 0)} dh
                  </div>
                  <button
  className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 text-white text-sm px-3 py-1"
  onClick={handleValiderCommande}
>
  Valider la commande
</button>

                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHome;
