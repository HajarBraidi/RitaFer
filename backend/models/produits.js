const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  famille: { type: String, required: true },
  types: [{ type: String }],
  image: { type: String },
  prix: { type: String }
});

module.exports = mongoose.model('Produit', produitSchema);
