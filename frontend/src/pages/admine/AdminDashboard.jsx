import { useEffect, useState } from 'react';
//import axios from 'axios';
import Header from '../../components/Header';
import AdminSidebar from '../../components/AdminSidebar';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import API from '../../axiosInstance';


const AdminDashboard = () => {
  const [clients, setClients] = useState(0);
  const [fournisseurs, setFournisseurs] = useState(0);
  const [commandes, setCommandes] = useState(0);
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, fournisseursRes, commandesRes, evolutionRes] = await Promise.all([
          API.get('/api/admin/stats/clients'),
          API.get('/api/admin/stats/fournisseurs'),
          API.get('/api/admin/stats/commandes'),
          API.get('/api/admin/stats/evolution-commandes')
        ]);
        
        setClients(clientsRes.data.count);
        setFournisseurs(fournisseursRes.data.count);
        setCommandes(commandesRes.data.count);
        setEvolution(evolutionRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = evolution.map(stat => ({
    semaine: `S${stat._id.semaine}-${stat._id.annee}`,
    total: stat.totalCommandes
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-700 text-white min-h-screen fixed">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Administrateur</h1>
              <p className="text-gray-600 mt-2">Aperçu global des activités</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-50 mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clients</p>
                    <p className="text-3xl font-semibold text-gray-800">{clients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fournisseurs</p>
                    <p className="text-3xl font-semibold text-gray-800">{fournisseurs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50 mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Commandes</p>
                    <p className="text-3xl font-semibold text-gray-800">{commandes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Évolution des commandes</h2>
                  <p className="text-sm text-gray-500">Performance hebdomadaire</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-lg">Hebdomadaire</button>
                  <button className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg">Mensuelle</button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="semaine" 
                      tick={{ fill: '#6b7280' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#6366f1' }}
                      activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
                      name="Nombre de commandes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity (Placeholder) */}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;