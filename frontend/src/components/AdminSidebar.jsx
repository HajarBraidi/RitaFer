// components/AdminSidebar.jsx
import React from 'react';
import { Link, useParams,  } from 'react-router-dom';

const AdminSidebar = () => {
    const { id } = useParams();
    
  return (
    <div className="h-full p-6">
      
      <nav className="space-y-4">
        <Link to={`/admin/${id}/profil`} className="block text-white hover:underline"> Profil</Link>
        <Link to={`/admin/${id}/dashboard`} className="block text-white hover:underline"> Tableau de bord</Link>
        <Link to={`/admin/${id}/utilisateurs`} className="block text-white hover:underline">
  Utilisateurs
</Link>
        <Link to={`/admin/${id}/produits`} className="block text-white hover:underline"> Produits</Link>
      
      
      </nav>
    </div>
  );
};

export default AdminSidebar;
