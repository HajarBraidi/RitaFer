// routes/fournisseurs.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// GET profil fournisseur
router.get('/:id', async (req, res) => {
  try {
    const fournisseur = await User.findById(req.params.id);
    if (!fournisseur || fournisseur.role !== 'fournisseur') {
      return res.status(404).json({ message: "Fournisseur introuvable" });
    }
    res.json(fournisseur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT modifier profil
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/fournisseurs/:id/ventes
router.get('/:id/ventes', async (req, res) => {
  console.log("🧪 ID reçu :", req.params.id);
  try {
    const stats = await Order.aggregate([
      { $match: { fournisseurId: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: {
            semaine: { $isoWeek: "$createdAt" },
            annee: { $isoWeekYear: "$createdAt" },
          },
          totalVentes: { $sum: "$total" },
          commandes: { $sum: 1 }
        }
      },
      { $sort: { "_id.annee": -1, "_id.semaine": -1 } },
      { $limit: 4 }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/fournisseurs/:id/commandes
router.get('/:id/commandes', async (req, res) => {
  try {
    const commandes = await Order.find({ fournisseurId: req.params.id })
      .populate('clientId', 'nom prenom email')  // pour afficher infos client
      .sort({ createdAt: -1 });

    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:orderId/vu
router.put('/orders/:orderId/vu', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.orderId, { vuParFournisseur: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;