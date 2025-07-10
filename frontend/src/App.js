import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientHome from './pages/ClientHome';
import Accueil from "./pages/Accueil";
import BonDeCommande from "./pages/BonDeCommande";
import FournisseurProfil from './pages/fournisseur/FournisseurProfil';
import FournisseurStats from './pages/fournisseur/FournisseurStats';
import FournisseurCommandes from './pages/fournisseur/FournisseurCommandes';
import FournisseurDocuments from './pages/fournisseur/FournisseurDocuments';
import AdminDashboard from './pages/admine/AdminDashboard';
import AdminProfil from './pages/admine/AdminProfil';
import AdminProduits from './pages/admine/AdminProduits';
import AdminUtilisateurs from './pages/admine/AdminUtilisateurs';


function App() {
  return (
    

    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<ClientHome />} />
        <Route path="/bon-de-commande" element={<BonDeCommande />} />
        {/* Ajoute les autres routes ici */}
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/fournisseur/:id/profil" element={<FournisseurProfil />} />
        <Route path="/fournisseur/:id/statistiques" element={<FournisseurStats />} />
        <Route path="/fournisseur/:id/commandes" element={<FournisseurCommandes />} />
        <Route path="/fournisseur/:id/documents" element={<FournisseurDocuments />} />
        <Route path="/admin/:id/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/:id/profil" element={<AdminProfil />} />
        <Route path="/admin/:id/produits" element={<AdminProduits />} />
        <Route path="/admin/:id/utilisateurs" element={<AdminUtilisateurs />} />
      </Routes>
    </Router>

    
  );
}

export default App;
