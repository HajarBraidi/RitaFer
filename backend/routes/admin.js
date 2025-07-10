// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');

// Nombre total de clients
router.get('/stats/clients', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'client' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Nombre total de fournisseurs
router.get('/stats/fournisseurs', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'fournisseur' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nombre total de commandes
router.get('/stats/commandes', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Évolution hebdomadaire des commandes
router.get('/stats/evolution-commandes', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            semaine: { $isoWeek: "$createdAt" },
            annee: { $isoWeekYear: "$createdAt" }
          },
          totalCommandes: { $sum: 1 }
        }
      },
      { $sort: { "_id.annee": 1, "_id.semaine": 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//  Créer un nouvel admin
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Nouvel admin créé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  affiche les utilisateurs 
router.get('/users', async (req, res) => {
  try {
    const utilisateurs = await User.find({ actif: true }); // récupère tous les rôles
    res.json(utilisateurs); // retourne un tableau directement
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Désactiver un utilisateur au lieu de le supprimer
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Mettre active à false au lieu de supprimer physiquement
    const user = await User.findByIdAndUpdate(userId, { actif: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Utilisateur désactivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
 try {
 const admin = await User.findById(req.params.id);
  if (!admin || admin.role !== 'admin') {
  return res.status(404).json({ message: 'Admin non trouvé' });
  }
  res.json(admin);
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
});


module.exports = router;
