import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Header from '../components/Header';
import autoTable from 'jspdf-autotable';
import API from '../axiosInstance';


const BonDeCommande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fournisseur, panier } = location.state || {};
  const date = new Date().toLocaleDateString();
  const [isSending, setIsSending] = useState(false);
  const utilisateur = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    localStorage.removeItem('panier');
  }, []);

  if (!fournisseur || !panier || panier.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Aucune commande à afficher</h3>
          <p className="mt-2 text-sm text-gray-500">Veuillez effectuer une commande avant d'accéder à cette page</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const total = panier.reduce((sum, item) => sum + item.total, 0);

  const genererPDF = () => {
    const doc = createPDFDocument();
    doc.save(`BonCommande_${date.replace(/\//g, '-')}.pdf`);
  };

  const envoyerAuFournisseur = async () => {
    if (!utilisateur || !utilisateur._id) {
      alert("Utilisateur non connecté.");
      return;
    }

    setIsSending(true);
    try {
      const doc = createPDFDocument();
      const pdfBlob = doc.output('blob');
      
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `bon_commande_${Date.now()}.pdf`);
      formData.append('clientId', utilisateur._id);
      formData.append('fournisseurId', fournisseur._id);
      formData.append('total', total);
      formData.append('produits', JSON.stringify(panier));

      const res = API.fetch('/api/commandes/pdf', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Le bon de commande a été envoyé au fournisseur avec succès !");
      } else {
        throw new Error("Erreur serveur");
      }
      } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur lors de l'envoi du bon de commande");
      } finally {
      setIsSending(false);
      }
      };

  const createPDFDocument = () => {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('BON DE COMMANDE', 150, 15, { align: 'right' });

  doc.setTextColor(255, 0, 0);
  doc.text('Rita Fer', 14, 15);

    // Informations client
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Client', 14, 40);
    doc.text(`Email: ${utilisateur?.email || ''}`, 14, 50);

    // Informations fournisseur
    doc.text(`Fournisseur: ${fournisseur.prenom || ''} ${fournisseur.nom || ''}`, 105, 40);
    doc.text(`ID: ${fournisseur.fournisseurId || ''}`, 105, 50);
    doc.text(`Date: ${date}`, 14, 60);

    // Tableau des produits
    autoTable(doc, {
      startY: 80,
      head: [['Famille', 'Produit', 'Type', 'Qté', 'Prix Unit.', 'Total']],
      body: panier.map((item) => [
        item.famille || '-',
        item.nom,
        item.type || '-',
        item.quantite,
        `${item.prixUnitaire} dh`,
        `${item.total} dh`,
      ]),
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    // Total
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${total} dh`, 160, doc.lastAutoTable.finalY + 15);

    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Merci pour votre confiance - Rita Fer', 105, 285, { align: 'center' });

    return doc;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* En-tête */}
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Bon de Commande</h2>
          </div>

          <div className="p-6">
            {/* Informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Client</h3>
                <p className="text-gray-600"><span className="font-medium">Email :</span> {utilisateur?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Fournisseur</h3>
                <p className="text-gray-600"><span className="font-medium">Nom :</span> {fournisseur.prenom} {fournisseur.nom}</p>
                <p className="text-gray-600"><span className="font-medium">ID :</span> {fournisseur.fournisseurId}</p>
                <p className="text-gray-600"><span className="font-medium">Email :</span> {fournisseur.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600"><span className="font-medium">Date :</span> {date}</p>
            </div>

            {/* Tableau des produits */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Famille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {panier.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.famille}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantite}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.prixUnitaire} dh</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total} dh</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{total} dh</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={genererPDF}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger PDF
              </button>
              
              <button
                onClick={envoyerAuFournisseur}
                disabled={isSending}
                className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isSending ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Envoyer au fournisseur
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonDeCommande;