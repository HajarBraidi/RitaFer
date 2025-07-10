// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Récupérer les utilisateurs (ex : ?role=fournisseur)
router.get('/', async (req, res) => {
  const { role } = req.query;
  try {
    const users = await User.find(role ? { role } : {});
    res.json(users);
  } 
  
  
  catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
