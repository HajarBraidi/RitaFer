const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.post('/register', registerUser);
//router.post('/login', loginUser);
// POST /api/auth/login

router.put('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

if (!user.actif) {
      return res.status(403).json({ message: 'Compte désactivé par l\'administrateur.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
  { id: user._id, role: user.role },
  'secret_key', // 🛑 Remplace par une vraie clé secrète en .env si possible
  { expiresIn: '2h' }
);

res.json({
  token, // ✅ maintenant le token est défini
  user: {
    id: user._id,
    email: user.email,
    role: user.role
  }
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
