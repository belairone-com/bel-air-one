import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const categories = [
  {
    title: "Prêt-à-Porter",
    image: "https://i.ibb.co/W4Vd4zdj/4-C696078-8-E57-43-E2-9-A82-D7-DCA127-AE91.png",
    link: "/pret-a-porter"
  },
  {
    title: "Maroquinerie",
    image: "/images/baul-bel-air-one-exacto.jpg",
    link: "/maroquinerie"
  },
  {
    title: "Robes",
    image: "https://i.postimg.cc/Y9mmV5qq/40FD4DCB-2798-41B0-94D1-0E39903BA05B.png",
    link: "/robes"
  },
  {
    title: "Accessoire",
    image: "https://i.postimg.cc/FHQVscxG/A401B2D6-581B-495D-A640-ED092B5EE301.png",
    link: "/accessoires"
  }
];

const jourBlancProducts = [
  {
    name: 'Malle Bel Air One',
    price: '8 900 CHF',
    image: '/images/malle-jour-blanc.jpg',
  },
  {
    name: 'Robe Jour Blanc',
    price: '2 400 CHF',
    image: 'https://i.postimg.cc/Y9mmV5qq/40FD4DCB-2798-41B0-94D1-0E39903BA05B.png',
  },
  {
    name: 'Portefeuille Signature',
    price: '540 CHF',
    image: 'https://i.postimg.cc/FHQVscxG/A401B2D6-581B-495D-A640-ED092B5EE301.png',
  },
  {
    name: 'Veste Première',
    price: '2 950 CHF',
    image: 'https://i.ibb.co/W4Vd4zdj/4-C696078-8-E57-43-E2-9-A82-D7-DCA127-AE91.png',
  },
];

const transitionReveals = [
  {
    word: 'ESMERALDA',
    image: 'https://i.ibb.co/tP1sdM9W/Captura-de-pantalla-2026-05-27-a-la-s-18-16-09-1-removebg-preview.png',
    delay: 0,
    duration: 1.3,
  },
  {
    word: 'ESMERALDA',
    image: 'https://i.ibb.co/tP1sdM9W/Captura-de-pantalla-2026-05-27-a-la-s-18-16-09-1-removebg-preview.png',
    delay: 1.3,
    duration: 1.3,
  },
  {
    word: 'AURORE',
    image: 'https://i.ibb.co/gZbgXv5S/Captura-de-pantalla-2026-05-27-a-la-s-18-15-50-removebg-preview.png',
    delay: 2.6,
    duration: 1.4,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);

  const handleCategoryClick = (path: string) => {
    if (transitionTarget) return;
    setTransitionTarget(path);
    window.setTimeout(() => {
      navigate(path);
      setTransitionTarget(null);
    }, 4000);
  };

  return (
    <div className="bg-white">
      {transitionTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-[#fbfaf7]"
        >
          <div className="absolute inset-0 bg-[#fbfaf7]" />

          {transitionReveals.map((reveal) => (
            <motion.div
              key={`${reveal.word}-${reveal.delay}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: [0, 1, 1, 0], y: [16, 4, 12, 26] }}
              transition={{
                duration: reveal.duration,
                delay: reveal.delay,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.24, 0.78, 1],
              }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
            >
              <img
                src={reveal.image}
                alt=""
                aria-hidden="true"
                className="mb-10 h-[17vh] max-h-[180px] min-h-[90px] w-auto object-contain opacity-70"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 1. Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://i.ibb.co/x8DqQJPm/Diferencia-en-tonos-fondo.png" 
            alt="BEL AIR ONE Campaign" 
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ imageRendering: 'auto' }}
          />
          <div className="absolute inset-0 bg-white/10" />
        </div>
        <div className="absolute inset-x-0 top-[31%] z-10 flex justify-center px-6 md:top-[34%]">
          <p className="text-[11px] md:text-[13px] uppercase tracking-[0.34em] text-white/80 font-light">
            JOUR BLANC 26-27
          </p>
        </div>

      </section>

      <section className="bg-white px-6 py-20 md:py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-medium tracking-[0.18em] uppercase text-[#342f2a]"
        >
          Jour Blanc
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-[700px] text-center font-editorial text-lg md:text-xl italic leading-relaxed tracking-[0.02em] text-[#838383]"
        >
          <p>
            La première saison de la Maison. Une sélection de créations révélées progressivement entre septembre 2026 et mars 2027.
          </p>
          <p className="mt-5">
            Une saison inspirée par la lumière, l'altitude et la pureté des lignes.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          className="group relative mx-auto mt-16 max-w-[250px] overflow-hidden md:max-w-[310px]"
        >
          <div className="aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
            <img
              src="/images/malle-jour-blanc.jpg"
              alt="Malle Jour Blanc"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent px-4 pb-5 pt-16 text-center text-white">
            <h3 className="text-[13px] md:text-[15px] tracking-[0.04em] normal-case">
              Malle Jour Blanc
            </h3>
            <p className="mt-2 text-[12px] md:text-sm text-white/80">8 900 CHF</p>
          </div>
        </motion.article>

        <div className="mx-auto mt-20 grid max-w-[1600px] grid-cols-2 gap-0 md:grid-cols-4">
          {jourBlancProducts.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className="group relative overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent px-4 pb-5 pt-16 text-center text-white">
                <h3 className="text-[12px] md:text-[14px] tracking-[0.04em] normal-case">
                  {product.name}
                </h3>
                <p className="mt-2 text-[12px] md:text-sm text-white/80">{product.price}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 2. Exploration de la Maison */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-14 md:mb-18 max-w-4xl text-center"
        >
          <h2 className="text-[15px] md:text-[18px] font-normal leading-[1.7] tracking-[0.14em] uppercase text-[#342f2a]">
            EXPLOREZ LES CRÉATIONS DE LA MAISON
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-[700px] grid-cols-2 gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-20">
          {categories.map((category, index) => (
            <motion.div 
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, delay: index * 0.08, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              <button type="button" onClick={() => handleCategoryClick(category.link)} className="block w-full text-left">
                <div className="overflow-hidden bg-[#f4f2ee] aspect-[3/4]">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="mt-5 md:mt-6 text-center">
                  <p className="text-[12px] md:text-[15px] tracking-[0.04em] text-[#342f2a] normal-case group-hover:underline underline-offset-4 transition-all">
                    {category.title}
                  </p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-24 md:py-36" />

      <section className="bg-white px-6 py-28 md:py-40 text-[#19110b]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-2xl md:text-4xl font-medium tracking-[0.16em] uppercase text-[#342f2a]">
            Les Archives de la Maison
          </h2>
          <p className="mx-auto mt-10 max-w-2xl font-editorial text-xl md:text-2xl leading-relaxed text-[#6f675f]">
            Chaque création de BEL AIR ONE possède son propre numéro d'archive.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base leading-relaxed tracking-[0.03em] text-[#8a8278]">
            Les Archives de la Maison permettent de consulter l'enregistrement officiel d'une création et de confirmer son appartenance aux archives de BEL AIR ONE.
          </p>

          <div className="mx-auto mt-16 max-w-md">
            <input
              placeholder="Numéro d'archive"
              className="w-full bg-transparent border-b border-[#19110b]/30 pb-4 text-center text-sm tracking-[0.12em] outline-none placeholder:text-[#aaa39b] focus:border-[#19110b] transition-colors"
            />
            <button className="mt-10 text-[10px] uppercase tracking-[0.28em] border-b border-[#19110b] pb-2 hover:opacity-60 transition-opacity">
              Accéder aux archives
            </button>
          </div>

          <div className="mx-auto mt-20 max-w-md border-y border-[#e8e2da] py-10 text-center">
            <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-[#8a8278]">Pièce enregistrée</p>
            <div className="space-y-3 text-sm uppercase tracking-[0.2em] text-[#342f2a]">
              <p>BEL AIR ONE</p>
              <p>JOUR BLANC</p>
              <p>Pièce Nº 0001</p>
            </div>
            <p className="mx-auto mt-8 max-w-sm font-editorial text-lg leading-relaxed text-[#6f675f]">
              Cette création figure dans les archives officielles de la Maison.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
