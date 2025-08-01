const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom : { type: String, },
    prenom : {type: String, },
    description : {type: String},
    telephone: {type: String},
    localisation: {type: String},
    email: { type: String, required:true, unique:true },
    password: { type: String, required: true},
    role: { type: String, enum: ['admin' , 'client' , 'fournisseur'], default : 'client'},
    fournisseurId: { type: String},
    actif: { type: Boolean, default: true }
});

    module.exports = mongoose.model('User', userSchema)