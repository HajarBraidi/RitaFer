import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import FournisseurSidebar from '../../components/FournisseurSidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FournisseurDocuments = () => {
  const { id } = useParams();
  const [commandes, setCommandes] = useState([]);
  const location = useLocation();
  const { fournisseur, panier = [] } = location.state || {}; // éviter erreur si undefined
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/fournisseurs/${id}/commandes`)
      .then((res) => setCommandes(res.data))
      .catch((err) => console.error('Erreur lors de la récupération des commandes :', err));
  }, [id]);

  const genererPDF = () => {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('BON DE COMMANDE', 150, 15, { align: 'right' });

    // Nom entreprise
    doc.setTextColor(255, 0, 0);
    doc.text('Rita Fer', 14, 15);

    // Infos fournisseur
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Date : ${date}`, 14, 30);
    doc.text(`Nom : ${fournisseur?.nom || ''}`, 14, 40);
    doc.text(`Prénom : ${fournisseur?.prenom || ''}`, 100, 40);

    // Tableau produits
    autoTable(doc, {
      startY: 60,
      head: [['Modèle', 'Forme', 'Qté', 'Prix Unit.', 'Prix Total']],
      body: panier.map((item) => [
        item.nom,
        item.type || '-',
        item.quantite,
        `${item.prixUnitaire} dh`,
        `${item.total} dh`,
      ]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    const total = panier.reduce((sum, item) => sum + item.total, 0);
    doc.text(`Total de ma commande : ${total} dh`, 14, doc.lastAutoTable.finalY + 10);

    doc.save('BonDeCommande.pdf');
  };

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
              <div className="space-y-4">
                {commandes.map((cmd, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      {cmd.clientId ? (
                        <>
                          <p className="font-medium text-gray-700">
                            👤 Client : {cmd.clientId.nom} {cmd.clientId.prenom}
                          </p>
                          <p className="text-sm text-gray-500">{cmd.clientId.email}</p>
                        </>
                      ) : (
                        <p className="font-medium text-red-600">
                          ⚠️ Client supprimé
                        </p>
                      )}

                      <p className="text-sm text-gray-400 mt-1">
                        Date : {new Date(cmd.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={genererPDF}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      📄 Télécharger PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurDocuments;
