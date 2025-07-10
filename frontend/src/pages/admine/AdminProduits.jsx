// frontend/src/pages/AdminProduits.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', famille: '', types: '', prix: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/produits');
      setProduits(res.data);
    } catch (err) {
      alert('Erreur lors du chargement des produits');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nom', form.nom);
    formData.append('famille', form.famille);
    formData.append('types', form.types); // string, backend convert to array
    formData.append('prix', form.prix);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/produits/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:5000/api/produits', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setForm({ nom: '', famille: '', types: '', prix: '' });
      setImageFile(null);
      setEditingId(null);
      setShowForm(false);
      fetchProduits();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = produit => {
    setForm({
      nom: produit.nom,
      famille: produit.famille,
      types: produit.types?.join(', ') || '',
      prix: produit.prix,
    });
    setImageFile(null);
    setEditingId(produit._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ nom: '', famille: '', types: '', prix: '' });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async id => {
    if (window.confirm('Confirmer la suppression ?')) {
      await axios.delete(`http://localhost:5000/api/produits/${id}`);
      fetchProduits();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-indigo-600 text-white overflow-auto">
          <AdminSidebar />
        </div>

        <div className="flex flex-1 bg-gray-100 overflow-hidden">
          <div className={`p-6 overflow-auto transition-all duration-300 ${showForm ? 'w-2/3' : 'w-full'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestion des Produits</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  + Ajouter un produit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produits.map(produit => (
                <div key={produit._id} className="border p-4 rounded shadow bg-white">
                  {produit.image && (
                    <img
                      src={`http://localhost:5000${produit.image}`}
                      alt={produit.nom}
                      className="h-40 w-full object-cover mb-2 rounded"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{produit.nom}</h3>
                  <p className="text-sm text-gray-600">Famille: {produit.famille}</p>
                  <p className="text-sm text-gray-600">Prix: {produit.prix}</p>
                  {produit.types?.length > 0 && (
                    <p className="text-sm">Types: {produit.types.join(', ')}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(produit)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(produit._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showForm && (
            <div className="w-1/3 bg-white shadow-md rounded-l-lg p-6 overflow-auto max-h-screen">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Nom du produit"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="famille"
                  value={form.famille}
                  onChange={handleChange}
                  placeholder="Famille"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="types"
                  value={form.types}
                  onChange={handleChange}
                  placeholder="Types (séparés par virgule)"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="prix"
                  value={form.prix}
                  onChange={handleChange}
                  placeholder="Prix (ex: 111 dh/unité)"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Aperçu"
                    className="mt-2 h-32 rounded object-contain"
                  />
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  >
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProduits;
