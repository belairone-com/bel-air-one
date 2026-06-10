import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type CategoryKey = 'pret-a-porter' | 'maroquinerie' | 'robes' | 'accessoires';

type Product = {
  name: string;
  price: string;
  image: string;
};

type PretAPorterAudience = 'homme' | 'femme';

const categoryContent: Record<CategoryKey, {
  title: string;
  phrase: string;
  hero: string;
  products: Product[];
}> = {
  'pret-a-porter': {
    title: 'Prêt-à-Porter',
    phrase: 'Des lignes précises, pensées pour une présence silencieuse.',
    hero: 'https://i.ibb.co/W4Vd4zdj/4-C696078-8-E57-43-E2-9-A82-D7-DCA127-AE91.png',
    products: [
      { name: 'Manteau Belvédère', price: '2 950 CHF', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=900&auto=format&fit=crop' },
    ],
  },
  maroquinerie: {
    title: 'Maroquinerie',
    phrase: 'Chaque création est réalisée en Italie, pièce par pièce, par des artisans spécialisés en maroquinerie.',
    hero: '/images/malle-jour-blanc.jpg',
    products: [
      { name: 'Malle Bel Air One', price: '8 900 CHF', image: '/images/malle-jour-blanc.jpg' },
    ],
  },
  robes: {
    title: 'Robes',
    phrase: 'Des silhouettes rares, entre tension, mouvement et retenue.',
    hero: 'https://i.postimg.cc/Y9mmV5qq/40FD4DCB-2798-41B0-94D1-0E39903BA05B.png',
    products: [
      { name: 'Robe Class 1', price: '2 400 CHF', image: 'https://i.postimg.cc/Y9mmV5qq/40FD4DCB-2798-41B0-94D1-0E39903BA05B.png' },
      { name: 'Robe Épure', price: '1 850 CHF', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Minuit', price: '2 100 CHF', image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Atelier', price: '1 650 CHF', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Ligne Blanche', price: '1 980 CHF', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Soirée I', price: '2 750 CHF', image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Cachemire', price: '1 420 CHF', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=900&auto=format&fit=crop' },
      { name: 'Robe Signature', price: '2 250 CHF', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop' },
    ],
  },
  accessoires: {
    title: 'Accessoires',
    phrase: 'Les détails qui définissent une allure sans l’imposer.',
    hero: 'https://i.postimg.cc/FHQVscxG/A401B2D6-581B-495D-A640-ED092B5EE301.png',
    products: [
      { name: 'Collier Perle One', price: '540 CHF', image: 'https://i.postimg.cc/FHQVscxG/A401B2D6-581B-495D-A640-ED092B5EE301.png' },
    ],
  },
};

const pretAPorterProducts: Record<PretAPorterAudience, Product[]> = {
  homme: [
    { name: 'Veste Première Homme', price: '2 950 CHF', image: 'https://i.ibb.co/W4Vd4zdj/4-C696078-8-E57-43-E2-9-A82-D7-DCA127-AE91.png' },
  ],
  femme: [
    { name: 'Manteau Belvédère', price: '2 950 CHF', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=900&auto=format&fit=crop' },
  ],
};

export default function CategoryPage({ category, audience = 'femme' }: { category: CategoryKey; audience?: PretAPorterAudience }) {
  const content = categoryContent[category];
  const selectedProducts = category === 'pret-a-porter' ? pretAPorterProducts[audience] : content.products;

  return (
    <div className="bg-white text-[#19110b]">
      <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden">
        <motion.img
          src={content.hero}
          alt={content.title}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/25" />

      </section>

      <section id="selection" className="px-5 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#8a8278]">BEL AIR ONE</p>
            <h2 className="mt-5 text-2xl md:text-4xl font-medium tracking-[0.16em] uppercase">{content.title}</h2>
            {category === 'maroquinerie' && (
              <p className="mx-auto mt-8 max-w-2xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
                {content.phrase}
              </p>
            )}
            {category === 'pret-a-porter' && (
              <nav className="mt-10 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.28em] text-[#8a8278] md:gap-8">
                <Link
                  to="/pret-a-porter/homme"
                  className={`transition-colors hover:text-[#19110b] ${audience === 'homme' ? 'text-[#19110b]' : ''}`}
                >
                  Homme
                </Link>
                <span className="text-[#d3cec7]">/</span>
                <Link
                  to="/pret-a-porter/femme"
                  className={`transition-colors hover:text-[#19110b] ${audience === 'femme' ? 'text-[#19110b]' : ''}`}
                >
                  Femme
                </Link>
              </nav>
            )}
          </div>

          {category === 'robes' ? (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center font-editorial text-2xl md:text-3xl leading-relaxed text-[#342f2a]"
            >
              Robes bientôt dévoilés
            </motion.p>
          ) : (
            <motion.div
              key={category === 'pret-a-porter' ? audience : category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14"
            >
              {selectedProducts.map((product, index) => (
                <motion.article
                  key={product.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: (index % 4) * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${category}-${index + 1}`} className="block">
                    <div className="aspect-[4/5] overflow-hidden bg-[#f4f2ee]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-5 text-center">
                      <h3 className="text-[14px] tracking-[0.04em] normal-case">{product.name}</h3>
                      <p className="mt-2 text-sm text-[#6f675f]">{product.price}</p>
                      <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.22em] border-b border-[#19110b] pb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        Voir plus
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
