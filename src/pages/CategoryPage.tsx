import { Link } from 'react-router-dom';

type CategoryKey = 'pret-a-porter' | 'maroquinerie' | 'robes' | 'accessoires';

type PretAPorterAudience = 'homme' | 'femme';

const categoryContent: Record<CategoryKey, {
  title: string;
  phrase: string;
}> = {
  'pret-a-porter': {
    title: 'Prêt-à-Porter',
    phrase: 'Développé et réalisé à Genève. Chaque pièce reçoit le temps, l’attention et le savoir-faire qu’elle mérite.',
  },
  maroquinerie: {
    title: 'Maroquinerie',
    phrase: 'Chaque création est réalisée en Italie, pièce par pièce, par des artisans spécialisés en maroquinerie.',
  },
  robes: {
    title: 'Robes',
    phrase: 'Des silhouettes rares, entre tension, mouvement et retenue.',
  },
  accessoires: {
    title: 'Accessoires',
    phrase: 'Développés entre la Suisse et l’Italie. Chaque accessoire est créé avec une attention particulière portée aux matières, aux détails et aux finitions.',
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
            {category === 'pret-a-porter' && (
              <p className="mx-auto mt-8 max-w-3xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
                Développé et réalisé à Genève. Chaque pièce reçoit le temps, l’attention et le savoir-faire qu’elle mérite.
              </p>
            )}
            {category === 'maroquinerie' && (
              <p className="mx-auto mt-8 max-w-3xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
                Chaque création est réalisée en Italie, pièce par pièce, par des artisans spécialisés en maroquinerie.
              </p>
            )}
            {category === 'accessoires' && (
              <p className="mx-auto mt-8 max-w-3xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
                Développés entre la Suisse et l’Italie. Chaque accessoire est créé avec une attention particulière portée aux matières, aux détails et aux finitions.
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

          <div className="min-h-[45vh]" />
        </div>
      </section>
    </div>
  );
}
