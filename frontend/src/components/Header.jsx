import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données locales
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Rediriger vers la page de login
    navigate('/login');
  };

  return (
    <header className="bg-black text-white p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="text-2xl font-bold">
        <span className="text-red-500">Rita Fer</span>
      </div>

      <nav className="space-x-6 text-sm font-semibold flex items-center">
        <Link to="/accueil" className="text-blue-600 hover:underline">ACCUEIL</Link>
        <a href="/accueil#GAMME DES PRODUITS" className="text-blue-600 hover:underline">GAMME DES PRODUITS</a>
        <a href="/accueil#reseaux" className="text-blue-600 hover:underline">RÉSEAUX</a>
        <a href="/accueil#Contact" className="text-blue-600 hover:underline">CONTACT</a>

        <button
          onClick={()=> navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          RETOUR
        </button>


        <button
          onClick={handleLogout}
          className="text-blue-600 hover:underline"
        >
          DÉCONNEXION
        </button>
      </nav>
    </header>
  );
};

export default Header;
