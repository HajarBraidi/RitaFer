import React from "react";
import Header from '../components/Header';

const Accueil = () => {
  return (
    <div className="bg-white font-sans text-gray-800 scroll-smooth">
      <Header />
      <section id="accueil" className="min-h-screen py-16 px-4 text-center flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2">Mot du Directeur</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded" />
        <img
          src="/logo.jpeg"
          alt="Logo RITA FER"
          className="mx-auto w-32 h-32 object-contain mb-6 rounded-full"
        />
        <div className="max-w-3xl mx-auto text-justify text-gray-700 space-y-4">
          <p>
            Filiale du groupe MESO INVEST, RITA FER se positionne aujourd’hui comme un acteur de référence dans la distribution
            des matériaux de construction au Maroc.
          </p>
          <p>
            Notre entreprise tire sa force de son histoire de savoir-faire et du respect de ses engagements.
            Les professionnels du secteur BTP sont au cœur de notre stratégie de développement, du choix des matériaux
            de construction jusqu’à leur livraison.
          </p>
          <p>
            Disposant de 8 sites de distribution implantés pour être au plus proche de nos clients, où qu’ils soient.
          </p>
          <p>
            Mes pensées vont vers ces hommes et ces femmes qui ont fait vivre RITA FER pendant toutes ces années,
            s’y investissant au quotidien, y laissant empreinte.
          </p>
          <p>
            Je tiens à remercier nos clients qui nous ont fait confiance, nous mettant parfois à l’épreuve, nous faisant progresser.
          </p>
        </div>
        <div className="text-right mt-6 italic font-semibold text-gray-600">
          Abdelkamel Belmehdi
        </div>
      </section>

      <section id="GAMME DES PRODUITS" className="min-h-screen py-16 px-4 text-center flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2">Gammes des Produits</h2>
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
       
       <section id="reseaux" className="min-h-screen py-16 px-4 text-center flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2">Nos Réseaux</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mb-8 rounded" />
        <div className="max-w-3xl mx-auto">
    <ul className="relative border-l border-gray-300 pl-6">
      {[
        {
          nom: "RitaFer Meknès",
          adresse: "Lot N° 39 Zone industrielle Mejjat"
        },
        {
          nom: "RitaFer Casablanca",
          adresse: "Douare Lehlalate, Almajjatia, Oulad Taleb, Mediouna"
        },
        {
          nom: "RitaFer Marrakech",
          adresse: "Propriété El Bour Dr Ait Messoud, Route Tamensourt, Harbil, Marrakech"
        },
        {
          nom: "RitaFer Ouarzazate",
          adresse: "Quartier Industriel, Ouarzazate"
        },
        {
          nom: "RitaFer Errachidia",
          adresse: "PK6, Route principale de Meknès, Errachidia"
        },
        {
          nom: "Fourat Metal",
          adresse: "Houara Oulad Raho Route de Missour ZR, Guercif"
        },
        {
          nom: "RitaFer Oujda",
          adresse: "Lot N° 35, Technopole, Route de Saidia, Oujda"
        },
        {
          nom: "RitaFer Nador",
          adresse: "Parc Industriel, Lot N° 1-2-3, Selouane, Nador"
        }
      ].map((item, index) => (
        <li key={index} className="mb-10 ml-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 mt-1.5"></div>
          <h3 className="text-lg font-semibold text-red-500">{item.nom}</h3>

          <p className="text-gray-600">{item.adresse}</p>
        </li>
      ))}
    </ul>
  </div>
</section>

   <section id="Contact" className="py-16 px-4 text-center bg-white text-gray-800">
  <h2 className="text-2xl font-bold mb-2">Contact</h2>
  <div className="w-20 h-1 bg-blue-500 mx-auto mb-8 rounded" />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-lg font-medium">

    {/* Adresse */}
    <div className="flex flex-col items-center">
      <img src="/cc.avif" alt="Adresse" className="h-20 w-20 mb-10" />
      <p>Lot 39 Zone Industrielle Mejjat<br />Meknès, Maroc</p>
    </div>

    {/* Email */}
    <div className="flex flex-col items-center">
      <img src="/email.avif" alt="Email" className="h-20 w-20 mb-10" />
      <p>contact@ritafer.ma</p>
    </div>

    {/* Téléphone */}
    <div className="flex flex-col items-center">
      <img src="/ccc.webp" alt="Téléphone" className="h-20 w-20 mb-10" />
      <p>05 35 52 46 29</p>
    </div>

  </div>
</section>



      {/* Sections "gallery", "reseaux", "contact" à créer ici si besoin */}
    </div>
  );
};

export default Accueil;
