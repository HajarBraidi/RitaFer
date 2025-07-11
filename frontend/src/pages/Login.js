import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);

    const user = res.data.user;
    const userToStore = {
      ...user,
      _id: user._id || user.id
    };

    localStorage.setItem('user', JSON.stringify(userToStore));

    alert(`Connecté en tant que ${user.role}`);
    const role = user.role;

    if (role === 'client') navigate('/client');
    else if (role === 'fournisseur') {
      const id = user._id || user.id;
      navigate(`/fournisseur/${id}/statistiques`);
    }
    else if (role === 'admin') { 
      const id = user._id || user.id;
      navigate(`/admin/${id}/dashboard`); // ← corrigé : backticks ajoutés ici
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Erreur lors de la connexion");
  }
};


  
  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-blue-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage: `url("/construction.jpg")`,
          }}
        >
          <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
          <div className="w-full max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Bienvenue chez <span className="text-red-600">Rita Fer</span>
            </div>
            <div className="sm:text-sm xl:text-md text-black-500 font-normal">
              Connectez-vous. Acteur de référence dans la distribution
des matériaux de construction.
            </div>
          </div>
          <ul className="circles">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
        </div>

        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Connexion</h2>
              <p className="mt-2 text-sm text-gray-500">Veuillez entrer vos identifiants</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
                Se connecter
              </button>
              {message && (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
    {message}
  </div>
)}
              {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}
              <div className="text-sm text-gray-600 text-center">
  Pas encore de compte ?{' '}
  <a href="/register" className="text-blue-600 hover:underline">S'inscrire</a>
  <span className="mx-2 text-gray-400">|</span>
  <a href="/forgot-password" className="text-blue-600 hover:underline">Mot de passe oublié ?</a>
</div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;