const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const app = express();
app.use(express.json());
app.use(cors());

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/commandes', orderRoutes);
app.use('/api/orders', orderRoutes);

const fournisseursRoutes = require('./routes/fournisseurs');
app.use('/api/fournisseurs', fournisseursRoutes); // ✅ toutes les routes ici



app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/authRoutes'));




mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error(err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const produitRoutes = require('./routes/produits');
app.use('/api/produits', produitRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use('/uploads', express.static('uploads'));
