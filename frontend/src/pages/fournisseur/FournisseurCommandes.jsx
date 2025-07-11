import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import { useParams } from 'react-router-dom';

const FournisseurCommandes = () => {
  const { id } = useParams();
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fournisseurs/${id}/commandes`);
        setCommandes(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, [id]);

  const filteredCommandes = commandes.filter(cmd => {
    // Si pas de terme de recherche, on montre tout
    if (!searchTerm) return true;
    
    // Si client supprimé, on vérifie si le terme correspond à "client supprimé"
    if (!cmd.clientId) {
      return 'client supprimé'.includes(searchTerm.toLowerCase());
    }
    
    // Sinon on vérifie dans le nom et prénom
    const clientName = `${cmd.clientId.nom || ''} ${cmd.clientId.prenom || ''}`.toLowerCase();
    return clientName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <FournisseurSidebar className="w-64 bg-indigo-700 text-white min-h-screen" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Commandes des clients</h1>
                <p className="text-gray-600 mt-1">
                  {filteredCommandes.length} {filteredCommandes.length === 1 ? 'commande trouvée' : 'commandes trouvées'}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {filteredCommandes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Aucun résultat pour votre recherche' : 'Aucune commande disponible pour ce fournisseur'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCommandes.map((cmd, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="mb-4 md:mb-0">
                          {cmd.clientId ? (
                            <>
                              <h3 className="text-lg font-semibold text-indigo-600 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {cmd.clientId.nom} {cmd.clientId.prenom}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {cmd.clientId.email}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Client supprimé
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(cmd.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Produits commandés</h4>
                        <ul className="space-y-3">
                          {cmd.produits.map((prod, index) => (
                            <li key={index} className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-0">
                              <div>
                                <p className="font-medium text-gray-900">{prod.nom}</p>
                                <p className="text-sm text-gray-500">{prod.famille}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-700">{prod.quantite} × {prod.prixUnitaire} MAD</p>
                                <p className="text-sm text-gray-500">Total: {(prod.quantite * prod.prixUnitaire).toFixed(2)} MAD</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {cmd.produits.length} {cmd.produits.length === 1 ? 'produit' : 'produits'}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          Total: {cmd.total.toFixed(2)} MAD
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FournisseurCommandes;