import React from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Accueil = () => {
  
    return (
        <section id="gammeDesPrduits" className="bg-white font-sans py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Gammes des Produits</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mb-8 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-lg font-medium">
          <div>Rond à Béton</div>
          <div>Treillis Soudés</div>
          <div>Bois</div>
          <div>Ciment & Briques</div>
          <div>Pointes & Fil d’attache</div>
          <div>Étanchéité</div>
          <div>Isolation</div>
          <div>Tôles & Panneaux sandwich</div>
        </div>
      </section>
    );
};

export default GammeDesProduits;