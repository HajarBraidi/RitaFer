import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  UserCircle,
  LayoutDashboard,
  Users,
  Package
} from 'lucide-react';

const AdminSidebar = () => {
  const { id } = useParams();
  const location = useLocation();

  const links = [
    { label: 'Profil', path: `/admin/${id}/profil`, icon: <UserCircle size={18} /> },
    { label: 'Tableau de bord', path: `/admin/${id}/dashboard`, icon: <LayoutDashboard size={18} /> },
    { label: 'Utilisateurs', path: `/admin/${id}/utilisateurs`, icon: <Users size={18} /> },
    { label: 'Produits', path: `/admin/${id}/produits`, icon: <Package size={18} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-indigo-600 text-white p-4 shadow-lg">
      <nav className="space-y-2">
        {links.map((link, i) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={i}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-inner'
                  : 'hover:bg-indigo-500/70 text-indigo-100'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
