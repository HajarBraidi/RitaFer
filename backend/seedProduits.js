// backend/seedProduits.js

const mongoose = require('mongoose');
const Produit = require('./models/Produits');



const produitsParFamille = {
  "BÂTIMENT & TRAVAUX PUBLICS": [
    {
      nom: "Rond à béton",
      types: ["06 mm", "08 mm", "10 mm", "12 mm", "14 mm", "16 mm", "20 mm", "25 mm", "32 mm"],
      image: "",
      prix: "111 dh/unité"
    },
    {
      nom: "Rond à béton Fe E500 en couronnes",
      types: ["06 mm", "08 mm", "10 mm", "12 mm"],
      image: "",
      prix: "111 dh/unité"
    },
    {
      nom: "Treillis soudés",
      types: ["T.S Standard", "T.S spécial"],
      image: "",
      prix: "111 dh/m²"
    },
    { nom: "Ciment", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Hourdis", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Brique", types: [], image: "", prix: "111 dh/unité" },
    { nom: "agglos", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Fil d'attache", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Colle à carrelage", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Pavés", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Buse en béton", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Bordures", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Tubes pvc", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Pehd assainissement", types: [], image: "", prix: "111 dh/unité" }
  ],
  "Bois et panneaux de coffrage": [
    { nom: "Poutrelle H20", types: [], image: "", prix: "111 dh/unité" },
    { nom: "Planche de coffrage", types: [], image: "", prix: "111 dh/m²" },
    { nom: "Madrier", types: [], image: "", prix: "111 dh/m²" },
    { nom: "Contre plaqué bakélisé", types: [], image: "", prix: "111 dh/m²" },
    { nom: "Tricapa", types: [], image: "", prix: "111 dh/m²" }
  ]
};

async function seed() {
  try {
    await Produit.deleteMany(); // facultatif : pour vider avant insertion
    const produits = [];

    for (const [famille, produitsFamille] of Object.entries(produitsParFamille)) {
      produitsFamille.forEach(produit => {
        produits.push({
          ...produit,
          famille
        });
      });
    }

    await Produit.insertMany(produits);
    console.log("✅ Produits insérés avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
}

seed();
