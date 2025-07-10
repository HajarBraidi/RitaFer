const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fournisseurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [
    {
      nom: String,
      quantite: Number,
      prixUnitaire: Number,
      bonCommandeUrl: String,
      famille: String
    }
  ],
  total: Number,
  bonCommandeUrl: String,
  createdAt: { type: Date, default: Date.now },
  vuParFournisseur: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);
