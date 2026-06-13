import { Link } from 'react-router-dom';

type CategoryKey = 'pret-a-porter' | 'maroquinerie' | 'robes' | 'accessoires';

type PretAPorterAudience = 'homme' | 'femme';

const categoryContent: Record<CategoryKey, {
  title: string;
  phrase: string;
  opening: string;
}> = {
  'pret-a-porter': {
    title: 'Prêt-à-Porter',
    phrase: 'Développé et réalisé à Genève. Chaque pièce reçoit le temps, l’attention et le savoir-faire qu’elle mérite.',
    opening: "Les premières pièces seront disponibles à l'ouverture de la Maison.",
  },
  maroquinerie: {
    title: 'Maroquinerie',
    phrase: 'Chaque création est réalisée en Italie, pièce par pièce, par des artisans spécialisés en maroquinerie.',
    opening: "Les premières pièces seront disponibles à l'ouverture de la Maison.",
  },
  robes: {
    title: 'Robes',
    phrase: 'Des silhouettes rares, entre tension, mouvement et retenue.',
    opening: "Les premières pièces seront disponibles à l'ouverture de la Maison.",
  },
  accessoires: {
    title: 'Accessoires',
    phrase: 'Développés entre la Suisse et l’Italie. Chaque accessoire est créé avec une attention particulière portée aux matières, aux détails et aux finitions.',
    opening: "Les premières pièces seront disponibles à l'ouverture de la Maison.",
  },
};

export default function CategoryPage({ category, audience = 'femme' }: { category: CategoryKey; audience?: PretAPorterAudience }) {
  const content = categoryContent[category];

  return (
    <div className="bg-white text-[#19110b]">
      <section id="selection" className="px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#8a8278]">BEL AIR ONE</p>
            <h2 className="mt-5 text-2xl md:text-4xl font-medium tracking-[0.16em] uppercase">{content.title}</h2>
            <p className="mx-auto mt-8 max-w-3xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
              {content.phrase}
            </p>
            <p className="mx-auto mt-16 max-w-3xl text-[11px] uppercase tracking-[0.26em] text-[#8a8278] md:mt-20 md:text-xs">
              {content.opening}
            </p>
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

          <div className="min-h-[45vh]" />
        </div>
      </section>
    </div>
  );
}
