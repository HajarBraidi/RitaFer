import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';

const AdminProfil = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    axios.get(`http://localhost:5000/api/admin/${id}`)
      .then(res => setAdmin(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/admin', form);
      setSuccess("✅ Nouvel admin créé avec succès !");
      setForm({ nom: '', prenom: '', email: '', password: '' });
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Erreur : {error}</div>;
  if (!admin) return <div className="text-center mt-10">Aucun admin trouvé.</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <div className="w-64 bg-indigo-600 text-white min-h-screen">
          <AdminSidebar  />
        </div>

        <div className="w-full h-full flex items-center justify-center bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl">
            {/* Profil Admin */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4"> Profil Administrateur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Nom :</strong> {admin.nom}</p>
                <p><strong>Prénom :</strong> {admin.prenom}</p>
                <p><strong>Email :</strong> {admin.email}</p>
              </div>
            </div>

            {/* Création d’un admin */}
            <div>
              <h3 className="text-2xl font-bold text-indigo-800 mb-4"> Créer un nouvel admin</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={form.prenom}
                    onChange={e => setForm({ ...form, prenom: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
                >
                  Créer l'admin
                </button>
                {success && <p className="text-green-600 font-medium mt-2">{success}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfil;
