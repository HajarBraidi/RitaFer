const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ REGISTER
exports.registerUser = async (req, res) => {
  const { nom, prenom, description, email, password, confirmPassword, role } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Utilisateur existe déjà' });

    const hashedPwd = await bcrypt.hash(password, 10);

     
    const generateFournisseurId = async () => {
      const count = await User.countDocuments({ role: 'fournisseur' });
      return `F${(count + 1).toString().padStart(3, '0')}`;
    };

    let newUserData = {
      nom,
      prenom,
      email,
      password: hashedPwd,
      role
    };

    // ✅ Ajouter les champs spécifiques au fournisseur
    if (role === 'fournisseur') {
      const fournisseurId = await generateFournisseurId();
      newUserData.description = description;
      newUserData.fournisseurId = fournisseurId;
    }

    const user = new User(newUserData);
    await user.save();

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);
    
   
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
