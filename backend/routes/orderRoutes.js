const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');

// 📁 Configurer dossier de stockage PDF
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/bons';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  console.log("Requête PDF reçue !", req.file, req.body);
  
  try {
    const { clientId, fournisseurId, produits, total } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier PDF reçu" });
    }

    const bonCommandeUrl = `/uploads/bons/${req.file.filename}`;

    const newOrder = new Order({
      clientId,
      fournisseurId,
      produits: JSON.parse(produits), // stringifié côté frontend
      total,
      bonCommandeUrl
    });

    await newOrder.save();
    res.status(201).json({ message: 'Commande enregistrée avec PDF', order: newOrder });
  } catch (err) {
    console.error("Erreur backend PDF :", err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement PDF', error: err.message });
  }
})

// ✅ Route classique : POST /api/commandes
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Route spéciale PDF : POST /api/commandes/pdf


module.exports = router;
