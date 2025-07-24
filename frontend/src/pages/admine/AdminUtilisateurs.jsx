import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../axiosInstance';

const AdminUtilisateurs = () => {
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/api/admin/users');
        const allUsers = res.data;
        
        setAdmins(allUsers.filter(u => u.role === 'admin'));
        setClients(allUsers.filter(u => u.role === 'client'));
        setFournisseurs(allUsers.filter(u => u.role === 'fournisseur'));
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error('Erreur chargement utilisateurs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Supprimer (désactiver) un utilisateur
  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      await API.delete(`/api/admin/users/${userId}`);
      // Recharger la liste après suppression
      const res = await API.get('/api/admin/users');
      const allUsers = res.data;
      setAdmins(allUsers.filter(u => u.role === 'admin'));
      setClients(allUsers.filter(u => u.role === 'client'));
      setFournisseurs(allUsers.filter(u => u.role === 'fournisseur'));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // Fonction pour afficher une liste d'utilisateurs
  const renderUserList = (users) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prénom
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.nom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.prenom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-600 text-white overflow-auto fixed">
          <AdminSidebar />
        </div>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Consultez et gérez tous les utilisateurs de la plateforme
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Administrateurs</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {admins.length} {admins.length === 1 ? 'admin' : 'admins'}
                  </span>
                </div>
                {admins.length > 0 ? renderUserList(admins) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                    Aucun administrateur trouvé
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {clients.length} {clients.length === 1 ? 'client' : 'clients'}
                  </span>
                </div>
                {clients.length > 0 ? renderUserList(clients) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                    Aucun client trouvé
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Fournisseurs</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {fournisseurs.length} {fournisseurs.length === 1 ? 'fournisseur' : 'fournisseurs'}
                  </span>
                </div>
                {fournisseurs.length > 0 ? renderUserList(fournisseurs) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                    Aucun fournisseur trouvé
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUtilisateurs;