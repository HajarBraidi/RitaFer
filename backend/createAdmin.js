const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adapte ce chemin si ton modèle est ailleurs
require('dotenv').config(); // si tu utilises .env

// Connecte-toi à ta base de données
mongoose.connect('mongodb://localhost:27017/ritaferdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createAdmin() {
  const existing = await User.findOne({ email: 'admin@ritafer.com' });
  if (existing) {
    console.log('Un admin avec cet email existe déjà.');
    return mongoose.disconnect();
  }

  const hashedPwd = await bcrypt.hash('Haja1234', 10); // ← Ton mot de passe ici

  const admin = new User({
    nom: 'Admin',
    prenom: 'Super',
    email: 'admin@ritafer.ma',
    password: hashedPwd,
    role: 'admin'
  });

  await admin.save();
  console.log('✅ Admin créé avec succès.');
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
