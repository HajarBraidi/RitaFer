import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Header from '../components/Header';
import autoTable from 'jspdf-autotable';

const BonDeCommande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fournisseur, panier } = location.state || {};
  const date = new Date().toLocaleDateString();

  // ✅ Vider le panier localStorage une fois arrivé ici
  useEffect(() => {
    localStorage.removeItem('panier');
  }, []);

  if (!fournisseur || !panier || panier.length === 0) {
    return (
      <div className="p-6 text-center text-red-600">
        Aucune commande à afficher.
      </div>
    );
  }

  const total = panier.reduce((sum, item) => sum + item.total, 0);
const genererPDF = async () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('BON DE COMMANDE', 150, 15, { align: 'right' });

  doc.setTextColor(255, 0, 0);
  doc.text('Rita Fer', 14, 15);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Date : ${date}`, 14, 30);
  doc.text(`Nom : ${fournisseur.nom || ''}`, 14, 40);
  doc.text(`Prénom : ${fournisseur.prenom || ''}`, 100, 40);

  autoTable(doc, {
    startY: 80,
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

  // ✅ Télécharger en local
  doc.save('BonDeCommande.pdf');

  // ✅ Convertir le PDF en blob
  const pdfBlob = doc.output('blob');

  // ✅ Envoyer au backend
  const formData = new FormData();
  formData.append('pdf', pdfBlob, `bon_commande_${Date.now()}.pdf`);
  formData.append('clientId', fournisseur.clientId); // ou à récupérer du localStorage / Auth context
  formData.append('fournisseurId', fournisseur.fournisseurId);
  formData.append('total', total);
  formData.append('produits', JSON.stringify(panier));

  try {
    const res = await fetch('http://localhost:5000/api/commandes/pdf', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert("Erreur lors de l'enregistrement du bon de commande PDF");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du PDF :", error);
    alert("Erreur de connexion au serveur.");
  }
};


  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Bon de Commande</h2>
        <p className="mb-1"> Date : <strong>{date}</strong></p>
        <p className="mb-1"> Fournisseur : <strong>{fournisseur.prenom} {fournisseur.nom}</strong></p>
        <p className="mb-1"> ID : <strong>{fournisseur.fournisseurId}</strong></p>
        <p className="mb-4"> Email : <strong>{fournisseur.email}</strong></p>

        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-2 py-1">Famille</th>
              <th className="text-left px-2 py-1">Produit</th>
              <th className="text-left px-2 py-1">Qté</th>
              <th className="text-left px-2 py-1">Prix Unitaire</th>
              <th className="text-left px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {panier.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-1">{item.famille}</td>
                <td className="px-2 py-1">{item.nom} ({item.type})</td>
                <td className="px-2 py-1">{item.quantite}</td>
                <td className="px-2 py-1">{item.prixUnitaire} dh</td>
                <td className="px-2 py-1">{item.total} dh</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold border-t">
              <td colSpan="4" className="text-right px-2 py-1">Total :</td>
              <td className="px-2 py-1">{total} dh</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 text-right">
          <button
            onClick={genererPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📄 Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BonDeCommande;
