import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import { useParams } from 'react-router-dom';

const FournisseurProfil = () => {
  const { id } = useParams();
  const [profil, setProfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/fournisseurs/${id}`).then(res => {
      setProfil(res.data);
      setForm(res.data);
    });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/fournisseurs/${id}`, form);
      setProfil(form);
      setEditMode(false);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (!profil) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <FournisseurSidebar />
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl h-[90%] overflow-auto flex flex-col md:flex-row items-start">
            {!editMode ? (
              <>
                {/* Photo + Nom + Bouton */}
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-10 text-center">
                  <h2 className="text-xl font-bold text-indigo-800 mt-4">
                    {profil.nom} {profil.prenom}
                  </h2>
                  <p className="text-gray-600">Fournisseur</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                  >
                    Modifier mon profil
                  </button>
                </div>

                {/* Détails */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">À propos</h3>
                    <p className="text-gray-700">
                      {profil.description || "Aucune description fournie."}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {(profil.skills || []).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">Contact</h3>
                    <p className="text-gray-700"><strong>Email:</strong> {profil.email}</p>
                    <p className="text-gray-700"><strong>Téléphone:</strong> {profil.telephone || 'Non renseigné'}</p>
                    <p className="text-gray-700"><strong>Localisation:</strong> {profil.localisation || 'Non précisée'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Modifier mes informations</h2>
                <div className="space-y-4">
                  {['nom', 'prenom', 'email', 'description', 'telephone', 'localisation'].map((field) => (
                    <div key={field}>
                      <label className="block text-gray-700 font-medium capitalize mb-1">{field}</label>
                      <input
                        type="text"
                        name={field}
                        value={form[field] || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setForm(profil);
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurProfil;
