import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [clients, setClients] = useState(0);
  const [fournisseurs, setFournisseurs] = useState(0);
  const [commandes, setCommandes] = useState(0);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats/clients').then(res => setClients(res.data.count));
    axios.get('http://localhost:5000/api/admin/stats/fournisseurs').then(res => setFournisseurs(res.data.count));
    axios.get('http://localhost:5000/api/admin/stats/commandes').then(res => setCommandes(res.data.count));
    axios.get('http://localhost:5000/api/admin/stats/evolution-commandes').then(res => setEvolution(res.data));
  }, []);

  const chartData = evolution.map(stat => ({
    semaine: `S${stat._id.semaine}-${stat._id.annee}`,
    total: stat.totalCommandes}));

  return (
    <div className="flex-1">
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-600 text-white">
          <AdminSidebar />
        </div>

        {/* Contenu principal */}
        <div className="w-full h-full p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800"> Tableau de bord Admin</h2>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-5xl font-bold text-indigo-600">{clients}</p>
                <p className="mt-2 text-gray-600">Clients</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-5xl font-bold text-indigo-600">{fournisseurs}</p>
                <p className="mt-2 text-gray-600">Fournisseurs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-5xl font-bold text-indigo-600">{commandes}</p>
                <p className="mt-2 text-gray-600">Commandes</p>
              </div>
            </div>

            {/* Courbe */}
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4"> Évolution des Commandes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semaine" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
