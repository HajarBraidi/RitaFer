import { useEffect, useState } from 'react';
//import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../axiosInstance';

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', famille: '', types: '', prix: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProduits();
  }, []);

  useEffect(() => {
    const filtered = produits.filter(produit =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProduits(filtered);
  }, [searchTerm, produits]);

  const fetchProduits = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/api/produits');
      setProduits(res.data);
      setFilteredProduits(res.data);
    } catch (err) {
      alert('Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
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
    formData.append('types', form.types);
    formData.append('prix', form.prix);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      setIsLoading(true);
      if (editingId) {
        await API.put(`/api/produits/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.post('/api/produits', formData, {
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
    } finally {
      setIsLoading(false);
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
      try {
        setIsLoading(true);
        await API.delete(`/api/produits/${id}`);
        fetchProduits();
      } catch (err) {
        alert("Erreur lors de la suppression");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-700 text-white min-h-screen fixed">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Produits</h1>
                <p className="text-gray-600 mt-1">
                  {filteredProduits.length} {filteredProduits.length === 1 ? 'produit trouvé' : 'produits trouvés'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Rechercher un produit..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter un produit
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {isLoading && !showForm ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProduits.map(produit => (
                  <div key={produit._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    {produit.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`${process.env.REACT_APP_API_URL}${produit.image}`}
                          alt={produit.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{produit.nom}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">{produit.famille}</span>
                        <span className="font-medium text-gray-900">{produit.prix}</span>
                      </div>
                      {produit.types?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {produit.types.map((type, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(produit)}
                          className="flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(produit._id)}
                          className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Sidebar */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
                <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
                      </h2>
                      <button 
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                        <input
                          name="nom"
                          value={form.nom}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Famille</label>
                        <input
                          name="famille"
                          value={form.famille}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Types (séparés par virgule)</label>
                        <input
                          name="types"
                          value={form.types}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                        <input
                          name="prix"
                          value={form.prix}
                          onChange={handleChange}
                          placeholder="ex: 111 dh/unité"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex items-center">
                          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span>Choisir une image</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleFileChange} 
                              className="sr-only" 
                            />
                          </label>
                          {imageFile && (
                            <span className="ml-3 text-sm text-gray-500">{imageFile.name}</span>
                          )}
                        </div>
                        {imageFile && (
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Aperçu"
                            className="mt-2 h-32 rounded-lg object-contain"
                          />
                        )}
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {editingId ? 'Mise à jour...' : 'Création...'}
                            </>
                          ) : (
                            editingId ? 'Mettre à jour' : 'Ajouter'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProduits;