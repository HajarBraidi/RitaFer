import { Link, useParams, useLocation } from 'react-router-dom';
import { Home, BarChart2, FileText, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
//import axios from 'axios';
import API from '../axiosInstance';

const FournisseurSidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const [nonVues, setNonVues] = useState(0);

useEffect(() => {
  const fetchNonVues = async () => {  
    try {
      const res = await API.get(`/api/fournisseurs/${id}/commandes`);
      const commandesNonVues = res.data.filter(cmd => !cmd.vuParFournisseur);

      // Si on est sur la page documents, badge = 0
      if (location.pathname === `/fournisseur/${id}/documents`) {
        setNonVues(0);
      } else {
        setNonVues(commandesNonVues.length);
      }

    } catch (err) {
      console.error('Erreur chargement commandes :', err);
    }
  };

  fetchNonVues();
}, [id, location.pathname]); // très important



  const links = [
    { label: 'Profil', path: `/fournisseur/${id}/profil`, icon: <Home size={18} /> },
    { label: 'Statistiques', path: `/fournisseur/${id}/statistiques`, icon: <BarChart2 size={18} /> },
    { label: 'Commandes', path: `/fournisseur/${id}/commandes`, icon: <ShoppingCart size={18} /> },
    { label: 'Documents', path: `/fournisseur/${id}/documents`, icon: <FileText size={18} /> },
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
              <span className="flex items-center gap-2">
              {link.label}
              {link.label === 'Documents' && nonVues > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {nonVues}  
              </span>
               )}
              </span>
              {/* Badge exemple */}
              {/* {i === 2 && <span className="ml-auto text-xs bg-white text-indigo-700 px-2 py-0.5 rounded-full">5</span>} */}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default FournisseurSidebar;