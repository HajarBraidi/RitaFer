import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const FournisseurStats = () => {
  const { id } = useParams();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/fournisseurs/${id}/ventes`)
      .then(res => setStats(res.data));
  }, [id]);

  // Reformatter les données pour la courbe
  const chartData = stats.map(stat => ({
    semaine: `S${stat._id.semaine}-${stat._id.annee}`,
    total: stat.totalVentes
  }));

  return (
    <div className="flex-1">
        <Header />
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white">
        <FournisseurSidebar />
      </div>

      {/* Contenu principal */}
      
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl h-[90%] overflow-auto">
  
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Statistiques Hebdomadaires</h2>

          {/* Tableau des statistiques */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden mb-10">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-50 text-indigo-700 text-left">
                <tr>
                  <th className="px-6 py-4">Semaine</th>
                  <th className="px-6 py-4">Année</th>
                  <th className="px-6 py-4">Commandes</th>
                  <th className="px-6 py-4">Total Ventes (MAD)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{stat._id.semaine}</td>
                    <td className="px-6 py-4">{stat._id.annee}</td>
                    <td className="px-6 py-4 font-semibold">{stat.commandes}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">{stat.totalVentes.toFixed(2)} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Courbe des ventes */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Évolution des Ventes</h3>
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

export default FournisseurStats;
