import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';

const FournisseurDocuments = () => {
  const { id } = useParams();
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/fournisseurs/${id}/commandes`)
      .then((res) => setCommandes(res.data))
      .catch((err) =>
        console.error('Erreur lors de la récupération des commandes :', err)
      );
  }, [id]);

  // Marquer comme vues automatiquement
  useEffect(() => {
    commandes.forEach((cmd) => {
      if (!cmd.vuParFournisseur) {
        axios
          .put(`http://localhost:5000/api/fournisseurs/orders/${cmd._id}/vu`)
          .then(() => console.log(`Commande ${cmd._id} marquée comme vue`))
          .catch((err) =>
            console.error('Erreur maj commande vue:', err)
          );
      }
    });
  }, [commandes]);

  const today = new Date().toISOString().slice(0, 10);
  const commandesAujourdhui = commandes.filter(
    (cmd) => new Date(cmd.createdAt).toISOString().slice(0, 10) === today
  );
  const autresCommandes = commandes.filter(
    (cmd) => new Date(cmd.createdAt).toISOString().slice(0, 10) !== today
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <FournisseurSidebar />

        <div className="w-full h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl h-[90%] overflow-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
              Bons de commande
            </h2>

            {commandes.length === 0 ? (
              <p className="text-gray-500">Aucune commande trouvée.</p>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">📅 Aujourd'hui</h3>
                {commandesAujourdhui.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-6">Aucune commande aujourd'hui.</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {commandesAujourdhui.map((cmd, i) => (
                      <CommandeCard key={i} cmd={cmd} />
                    ))}
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-700 mb-2">📁 Autres jours</h3>
                {autresCommandes.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune autre commande.</p>
                ) : (
                  <div className="space-y-4">
                    {autresCommandes.map((cmd, i) => (
                      <CommandeCard key={i} cmd={cmd} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant d'affichage des commandes
const CommandeCard = ({ cmd }) => {
  const pdfUrl = `http://localhost:5000${cmd.bonCommandeUrl}`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      <div>
        {cmd.clientId ? (
          <>
            <p className="font-medium text-gray-700">
              👤 Client : {cmd.clientId.nom} {cmd.clientId.prenom}
            </p>
            <p className="text-sm text-gray-500">{cmd.clientId.email}</p>
          </>
        ) : (
          <p className="font-medium text-red-600">⚠️ Client supprimé</p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Date : {new Date(cmd.createdAt).toLocaleDateString()}
        </p>
      </div>

      {cmd.bonCommandeUrl ? (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📄 Télécharger PDF
        </a>
      ) : (
        <span className="text-sm text-red-500 font-medium">
          Aucun PDF disponible
        </span>
      )}
    </div>
  );
};

export default FournisseurDocuments;
