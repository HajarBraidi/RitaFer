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
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin', form);
      setSuccess("✅ Administrateur créé avec succès !");
      setForm({ nom: '', prenom: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p className="font-bold">Erreur</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!admin) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
        <p>Aucun administrateur trouvé</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="flex">
        <AdminSidebar className="w-64 bg-indigo-700 text-white min-h-screen" />
        
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Profil Admin */}
            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-indigo-800">Profil Administrateur</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Administrateur
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                    <p className="text-gray-900 font-medium">{admin.nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                    <p className="text-gray-900 font-medium">{admin.prenom}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{admin.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
                    <p className="text-gray-900 font-medium">{admin._id}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Création d'un admin */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-6">Créer un nouvel administrateur</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      id="nom"
                      type="text"
                      placeholder="Entrez le nom"
                      value={form.nom}
                      onChange={e => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      id="prenom"
                      type="text"
                      placeholder="Entrez le prénom"
                      value={form.prenom}
                      onChange={e => setForm({ ...form, prenom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Entrez l'email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Entrez le mot de passe"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                  >
                    {loading ? 'Création en cours...' : 'Créer l\'administrateur'}
                  </button>
                  
                  {success && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{success}</span>
                    </div>
                  )}
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfil;