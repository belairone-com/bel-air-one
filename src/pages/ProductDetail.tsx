import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';

type AccordionItem = {
  title: string;
  content: string;
};

const productData = {
  maison: 'BEL AIR ONE',
  reference: 'REF. BAO-894002',
  title: 'Sac Alpine',
  price: '3 850 CHF',
  material: 'Cuir de veau grainé',
  color: 'Noir profond',
  size: '28 x 20 x 12 cm',
  images: [
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1800&auto=format&fit=crop',
  ],
  accordions: [
    {
      title: 'Materials',
      content:
        "Le Sac Alpine incarne l'approche silencieuse de BEL AIR ONE : une construction nette, des proportions équilibrées et une présence qui se révèle dans le détail.",
    },
    {
      title: 'Product Care',
      content:
        'Fermeture discrète, finitions en métal brossé, intérieur structuré et marquage intérieur de la Maison. Chaque pièce est vérifiée individuellement avant livraison.',
    },
    {
      title: 'Delivery & Returns',
      content:
        "Cuir de veau pleine fleur, doublure en agneau plongé, éléments métalliques finition palladium. Sélection des matières effectuée selon les standards de la Maison.",
    },
    {
      title: 'Sustainability',
      content:
        "Les pièces sont préparées sur demande. Un conseiller de la Maison confirme la disponibilité et les délais estimés après votre demande de réservation.",
    },
    {
      title: 'Find in Store',
      content:
        "Préserver la pièce de l'humidité prolongée, de la chaleur directe et des frottements abrasifs. Conserver dans son écrin lorsque la pièce n'est pas portée.",
    },
    {
      title: 'Gifts',
      content:
        "Chaque pièce peut être préparée dans un écrin signature BEL AIR ONE, avec message personnalisé sur demande auprès de la Maison.",
    },
  ] as AccordionItem[],
};

function Accordion({ item, defaultOpen = false }: { item: AccordionItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#e8e2da] last:border-b">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[15px] tracking-[0.04em] text-[#19110b]">{item.title}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.2}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <p className="font-editorial pb-6 text-lg leading-relaxed text-[#6f675f]">
          {item.content}
        </p>
      </motion.div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-[#19110b] pt-[60px]">
      <div className="lg:hidden">
        <section className="bg-[#f6f5f2] border-b border-[#dedbd5]">
          <img
            src="https://i.postimg.cc/3wMQDq6z/Captura-de-pantalla-2026-05-19-a-las-18-44-48.png"
            alt={productData.title}
            className="h-[58vh] min-h-[420px] w-full object-contain object-center px-6 pt-8 pb-6"
          />
        </section>

        <section className="px-6 py-8 bg-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#19110b] mb-4">{productData.reference}</p>
              <h1 className="text-3xl font-light tracking-[0.02em] normal-case mb-4">{productData.title}</h1>
              <p className="text-xl tracking-[0.04em] mb-8">{productData.price}</p>
            </div>
            <button aria-label="Ajouter à la liste d'envies" className="pt-1">
              <Heart size={30} strokeWidth={1.4} />
            </button>
          </div>

          <div className="mb-8 border-y border-[#e8e2da] py-5">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Matière</span>
              <span className="text-[#6f675f]">{productData.material}</span>
            </div>
          </div>

          <button className="w-full rounded-full bg-black py-5 text-lg text-white tracking-[0.04em] mb-8">
            WhatsApp concierge
          </button>

          <p className="text-xl leading-[1.8] text-[#6f675f] mb-8">
            Pour plus d'informations sur cette pièce et sa disponibilité, contactez la Maison par WhatsApp. Chaque demande est traitée personnellement par notre service concierge.
          </p>

          <p className="text-lg leading-[1.8] text-[#8a8278] mb-10">
            {productData.title} est confectionné selon les codes de BEL AIR ONE : matières sélectionnées, proportions silencieuses et finitions précises.
          </p>

          <div>
            {productData.accordions.map((item) => (
              <Accordion key={item.title} item={item} />
            ))}
          </div>
        </section>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2">
        <aside className="order-2 lg:order-1 px-6 md:px-10 lg:px-16 py-12 lg:py-0 bg-white">
          <div className="lg:sticky lg:top-[60px] lg:min-h-[calc(100vh-60px)] lg:py-12 flex flex-col justify-center">
            <div className="max-w-[500px] mx-auto w-full">
              <Link to="/" className="block text-[11px] uppercase tracking-[0.32em] text-[#8a8278] mb-8">
                {productData.maison}
              </Link>

              <p className="text-[10px] uppercase tracking-[0.24em] text-[#9a9288] mb-4">
                {productData.reference}
              </p>

              <h1 className="text-3xl md:text-4xl font-medium tracking-[0.12em] normal-case mb-5">
                {productData.title}
              </h1>

              <p className="font-editorial text-xl text-[#19110b] mb-10">{productData.price}</p>

              <div className="space-y-5 mb-10 text-sm text-[#6f675f]">
                <div className="flex justify-between border-b border-[#eee9e2] pb-3">
                  <span>Matière</span>
                  <span className="text-[#19110b]">{productData.material}</span>
                </div>
                <div className="flex justify-between border-b border-[#eee9e2] pb-3">
                  <span>Couleur</span>
                  <span className="text-[#19110b]">{productData.color}</span>
                </div>
                <div className="flex justify-between border-b border-[#eee9e2] pb-3">
                  <span>Taille</span>
                  <span className="text-[#19110b]">{productData.size}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <button className="w-full bg-black py-4 text-[11px] uppercase tracking-[0.24em] text-white hover:bg-[#2a2520] transition-colors">
                  Réserver la pièce
                </button>
                <button className="w-full border border-[#19110b] py-4 text-[11px] uppercase tracking-[0.24em] text-[#19110b] hover:bg-[#f7f6f2] transition-colors">
                  Contacter la Maison
                </button>
              </div>

              <p className="font-editorial text-lg leading-relaxed text-[#6f675f] mb-10">
                Pour connaître la disponibilité de cette pièce, contactez la Maison.
              </p>

              <div>
                {productData.accordions.map((item, index) => (
                  <Accordion key={item.title} item={item} defaultOpen={index === 0} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="order-1 lg:order-2 bg-white">
          <div className="flex flex-col gap-1">
            {productData.images.map((image, index) => (
              <motion.figure
                key={image}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="bg-[#f4f2ee]"
              >
                <img
                  src={image}
                  alt={`${productData.title} - Vue ${index + 1}`}
                  className="h-[72vh] min-h-[520px] w-full object-cover object-center lg:h-screen"
                />
              </motion.figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}