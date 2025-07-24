const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');





const app = express();

app.use(cors({
    origin:  ['http://192.168.56.1:3000'],
    credentials: true
}));

app.use(express.json());
//app.use(cors());



const orderRoutes = require('./routes/orderRoutes');
app.use('/api/commandes', orderRoutes);
app.use('/api/orders', orderRoutes);
const fournisseursRoutes = require('./routes/fournisseurs');
app.use('/api/fournisseurs', fournisseursRoutes); // ✅ toutes les routes ici
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/authRoutes'));
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const produitRoutes = require('./routes/produits');
app.use('/api/produits', produitRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//app.use(express.static(path.join(__dirname,'build')));
//app.get('*',(req,res)=> {
 //   res.sendFile(path.join(__dirname,'build', 'index.html'));
//});



mongoose.connect('mongodb://localhost:27017/ritaferdb')
 .then(()=> console.log('mongodb connecte'))
 .catch((err)=> console.error('erreur de connecxion mongodb:',err));


const PORT = 3001;
app.listen(PORT, '0.0.0.0' ,() => console.log(`Serveur lancé sur le port ${PORT}`));

