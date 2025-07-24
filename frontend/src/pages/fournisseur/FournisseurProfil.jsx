import { useEffect, useState } from 'react';
//import axios from 'axios';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import { useParams } from 'react-router-dom';
import API from '../../axiosInstance';

const FournisseurProfil = () => {
  const { id } = useParams();
  const [profil, setProfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/api/fournisseurs/${id}`);
        setProfil(res.data);
        setForm(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.put(`/api/fournisseurs/${id}`, form);
      setProfil(form);
      setEditMode(false);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Erreur</p>
          <p>Impossible de charger le profil</p>
        </div>
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
            {!editMode ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="md:flex">
                  {/* Section Info de base */}
                  <div className="md:w-1/3 bg-indigo-50 p-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-white shadow-md mb-4 flex items-center justify-center bg-indigo-100 text-indigo-600">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                      {profil.nom} {profil.prenom}
                    </h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      Fournisseur
                    </span>
                    
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-6 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier le profil
                    </button>
                  </div>

                  {/* Détails */}
                  <div className="md:w-2/3 p-8">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">À propos</h3>
                      <p className="text-gray-600">
                        {profil.description || "Aucune description fournie."}
                      </p>
                    </div>

                    <div className="mb-8">
                      
                      <div className="flex flex-wrap gap-2">
                        {(profil.skills || []).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Coordonnées</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">{profil.email}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-600">{profil.telephone || 'Non renseigné'}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600">{profil.localisation || 'Non précisée'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Modifier mes informations</h2>
                  <button 
                    onClick={() => {
                      setEditMode(false);
                      setForm(profil);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {['nom', 'prenom', 'email', 'telephone', 'localisation'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={form[field] || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setForm(profil);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FournisseurProfil;