const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Produit = require('../models/produits');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Donne un nom unique
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});



// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const upload = multer({ storage });



router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { nom, famille, types, prix } = req.body;

    const newProduit = new Produit({
      nom,
      famille,
      types: types.split(',').map(t => t.trim()),
      prix,
      image: req.file ? `/uploads/${req.file.filename}` : '', // chemin accessible depuis frontend
    });

    await newProduit.save();
    res.json(newProduit);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { nom, famille, types, prix } = req.body;

    const updatedFields = {
      nom,
      famille,
      types: types.split(',').map(t => t.trim()),
      prix,
    };

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    const produit = await Produit.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur (update)' });
  }
});
// ➕ Ajouter un produit
router.post('/', async (req, res) => {
  try {
    const nouveauProduit = new Produit(req.body);
    await nouveauProduit.save();
    res.status(201).json(nouveauProduit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Modifier un produit
router.put('/:id', async (req, res) => {
  try {
    const updated = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
