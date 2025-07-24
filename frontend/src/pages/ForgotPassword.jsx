import { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      return setMessage("Les mots de passe ne correspondent pas.");
    }

    try {
      const res = await API.put('/api/auth/reset-password', {
        email,
        newPassword
      });

      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Mot de passe oublié</h2>

        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
        >
          Réinitialiser
        </button>

        <button
                onClick={()=> navigate(-1)}
                type="button"
                className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full hover:from-blue-500 hover:to-indigo-600 transition duration-300"
              >
               Retour 
              </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
