import { useEffect, useState } from 'react';
//import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import API from '../../axiosInstance';

const FournisseurDocuments = () => {
  const { id } = useParams();
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await API.get(`/api/fournisseurs/${id}/commandes`);
        setCommandes(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des commandes :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, [id]);

  // Marquer comme vues automatiquement
  useEffect(() => {
    commandes.forEach((cmd) => {
      if (!cmd.vuParFournisseur) {
        API
          .put(`/api/fournisseurs/orders/${cmd._id}/vu`)
          .then(() => console.log(`Commande ${cmd._id} marquée comme vue`))
          .catch((err) => console.error('Erreur maj commande vue:', err));
      }
    });
  }, [commandes]);

  const today = new Date().toISOString().slice(0, 10);
  
  const filteredCommandes = (commandesList) => {
    return commandesList.filter(cmd => {
      if (!searchTerm) return true;
      if (!cmd.clientId) return 'client supprimé'.includes(searchTerm.toLowerCase());
      const clientName = `${cmd.clientId.nom || ''} ${cmd.clientId.prenom || ''}`.toLowerCase();
      return clientName.includes(searchTerm.toLowerCase());
    });
  };

  const commandesAujourdhui = filteredCommandes(
    commandes.filter(cmd => new Date(cmd.createdAt).toISOString().slice(0, 10) === today)
  );
  
  const autresCommandes = filteredCommandes(
    commandes.filter(cmd => new Date(cmd.createdAt).toISOString().slice(0, 10) !== today)
  );

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
        <FournisseurSidebar className="w-64 bg-indigo-700 text-white min-h-screen fixed" />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Bons de commande</h1>
                <p className="text-gray-600 mt-1">
                  {commandes.length} {commandes.length === 1 ? 'commande' : 'commandes'} au total
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

            {commandes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
                <p className="mt-1 text-gray-500">Aucun bon de commande disponible</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Aujourd'hui
                  </h2>
                  
                  {commandesAujourdhui.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Aucune commande aujourd'hui</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {commandesAujourdhui.map((cmd, i) => (
                        <CommandeCard key={i} cmd={cmd} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Archives
                  </h2>
                  
                  {autresCommandes.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Aucune autre commande</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {autresCommandes.map((cmd, i) => (
                        <CommandeCard key={i} cmd={cmd} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const CommandeCard = ({ cmd }) => {
  const pdfUrl = `${process.env.REACT_APP_API_URL}${cmd.bonCommandeUrl}`;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
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

        <div className="mt-6 flex justify-end">
          {cmd.bonCommandeUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le PDF
            </a>
          ) : (
            <span className="flex items-center text-sm text-red-600 font-medium">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aucun PDF disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FournisseurDocuments;