import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import { useParams } from 'react-router-dom';

const FournisseurCommandes = () => {
  const { id } = useParams();
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/fournisseurs/${id}/commandes`)
      .then(res => setCommandes(res.data));
  }, [id]);

  return (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <div className="flex">
      <FournisseurSidebar />

      <div className="p-8 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2"> Commandes des Clients</h2>

        {commandes.length === 0 ? (
          <p className="text-gray-600 text-lg">Aucune commande trouvée pour ce fournisseur.</p>
        ) : (
          <div className="grid gap-6">
            {commandes.map((cmd, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <div className="mb-4">
                  {cmd.clientId ? (
                    <>
                      <h3 className="text-xl font-semibold text-blue-700">
                        👤 Client : {cmd.clientId.nom} {cmd.clientId.prenom}
                      </h3>
                      <p className="text-sm text-gray-500">{cmd.clientId.email}</p>
                    </>
                  ) : (
                    <h3 className="text-xl font-semibold text-red-700">⚠️ Client supprimé</h3>
                  )}

                  <p className="text-sm text-gray-600 mt-1">
                     Date de commande : {new Date(cmd.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2"> Produits commandés :</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    {cmd.produits.map((prod, index) => (
                      <li key={index}>
                        <span className="font-medium">{prod.famille}</span> – {prod.nom} × {prod.quantite} →{' '}
                        <span className="text-green-600 font-semibold">{prod.prixUnitaire} MAD</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 text-right">
                  <p className="text-lg font-bold text-gray-900"> Total : {cmd.total} MAD</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

}
export default FournisseurCommandes;
