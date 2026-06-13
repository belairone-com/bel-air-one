import { motion } from 'framer-motion';

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
    code: '---J--O---',
    price: 'xx*x CHF',
  },
  {
    name: 'Robe Jour Blanc',
    code: '--U---R--',
    price: 'x*xx CHF',
  },
  {
    name: 'Portefeuille Signature',
    code: '---B--L---',
    price: '*xxx CHF',
  },
  {
    name: 'Veste Première',
    code: '--A--N--C',
    price: 'xxx* CHF',
  },
];

export default function Home() {
  const handleCategoryClick = (path: string) => {
    window.dispatchEvent(new CustomEvent('belairone:navigate', { detail: { path } }));
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <picture className="block h-full w-full">
            <source media="(max-width: 767px)" srcSet="/images/mobile-jour-blanc-hero.jpg" />
            <img 
              src="https://i.ibb.co/x8DqQJPm/Diferencia-en-tonos-fondo.png" 
              alt="BEL AIR ONE Campaign" 
              className="w-full h-full object-cover object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{ imageRendering: 'auto' }}
            />
          </picture>
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
          <div className="absolute inset-x-0 bottom-0 px-4 pb-5 pt-16 text-center text-white">
            <h3 className="text-[13px] md:text-[15px] tracking-[0.04em] normal-case">
              Malle Jour Blanc
            </h3>
            <p className="mt-2 text-[12px] md:text-sm text-white/80">8 900 CHF</p>
          </div>
        </motion.article>

        <div className="relative mx-auto mt-20 grid aspect-[1086/1448] max-w-[1180px] grid-cols-2 grid-rows-2 overflow-hidden bg-[#f8fbfd] md:aspect-auto md:grid-cols-4 md:grid-rows-none">
          <div
            className="absolute inset-0 bg-contain bg-top bg-no-repeat md:hidden"
            style={{ backgroundImage: "url('/images/jour-blanc-alpine-mobile.png')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-cover bg-center md:block"
            style={{ backgroundImage: "url('/images/jour-blanc-alpine-panorama.png')" }}
            aria-hidden="true"
          />
          {jourBlancProducts.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className="group relative overflow-hidden"
            >
              <div className="h-full md:aspect-[4/5]" />
              <div className="absolute inset-x-0 bottom-0 px-2 pb-5 pt-12 text-center text-[#243346] md:px-4 md:pb-5 md:pt-16">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#06111f] [text-shadow:0_1px_6px_rgba(255,255,255,0.95)] md:text-[11px]">{product.code}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#06111f] [text-shadow:0_1px_6px_rgba(255,255,255,0.95)] md:text-sm">{product.price}</p>
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

        </motion.div>
      </section>
    </div>
  );
}
