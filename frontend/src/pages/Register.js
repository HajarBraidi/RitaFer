import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...formData, role });
      alert('Inscription réussie ! Vous pouvez vous connecter.');
      window.location.href = '/login';
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de l’inscription';
      setMsg(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-10">
        <img src="/logo.jpeg" alt="RITA FER" className="h-16 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Créer un compte</h2>

        {!role ? (
          <div className="flex justify-center gap-6">
            <button
                onClick={() => setRole('client')}
                type="submit"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
                Je suis un client
              </button>
            <button
                onClick={() => setRole('fournisseur')}
                type="submit"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
                Je suis un fournisseur
              </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nom"
                placeholder="Nom"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <input
                name="prenom"
                placeholder="Prénom"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            {role === 'fournisseur' && (
              <textarea
                name="description"
                placeholder="Description de votre activité"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            )}

            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
               S'inscrire 
              </button>
              <button
                onClick={() => setRole('')}
                type="button"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
               Retour 
              </button>
            </div>
            {msg && <p className="text-red-500 text-center mt-2">{msg}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
