import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';

const AdminUtilisateurs = () => {
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les utilisateurs
  useEffect(() => {
   

const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/users');
    const allUsers = res.data; // pas de  si c'est un tableau direct
    console.log("Utilisateurs récupérés:", allUsers);

    setAdmins(allUsers.filter(u => u.role === 'admin'));
    setClients(allUsers.filter(u => u.role === 'client'));
    setFournisseurs(allUsers.filter(u => u.role === 'fournisseur'));
    setLoading(false);
  } catch (err) {
    console.error('Erreur chargement utilisateurs', err);
    setLoading(false);
  }
}; 

fetchUsers(); // 👈 Très important : appel de la fonction
  }, []);



  // Supprimer (désactiver) un utilisateur
  const handleDelete = async (userId) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        // Recharger la liste après suppression
        const res = await axios.get('http://localhost:5000/api/admin/users');
        const allUsers = res.data;
        setAdmins(allUsers.filter(u => u.role === 'admin'));
        setClients(allUsers.filter(u => u.role === 'client'));
        setFournisseurs(allUsers.filter(u => u.role === 'fournisseur'));
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  // Fonction simple pour afficher une liste d’utilisateurs
  const renderUserList = (users) => (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border border-gray-300">Nom</th>
          <th className="p-2 border border-gray-300">Prénom</th>
          <th className="p-2 border border-gray-300">Email</th>
          <th className="p-2 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id} className="hover:bg-gray-100">
            <td className="p-2 border border-gray-300">{user.nom}</td>
            <td className="p-2 border border-gray-300">{user.prenom}</td>
            <td className="p-2 border border-gray-300">{user.email}</td>
            <td className="p-2 border border-gray-300 text-center">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDelete(user._id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex-1">
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-indigo-600 text-white">
          <AdminSidebar />
        </div>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Admins</h2>
        {admins.length > 0 ? renderUserList(admins) : <p>Aucun admin trouvé</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Clients</h2>
        {clients.length > 0 ? renderUserList(clients) : <p>Aucun client trouvé</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Fournisseurs</h2>
        {fournisseurs.length > 0 ? renderUserList(fournisseurs) : <p>Aucun fournisseur trouvé</p>}
      </section>
    </div>
    </div>
    </div>
    
  );
};

export default AdminUtilisateurs;
