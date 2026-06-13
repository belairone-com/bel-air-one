import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

const firstClassSections = [
  {
    title: 'PROTOTYPES',
    text: "Chaque création commence par une idée. Cette section présente les croquis, les recherches, les matières, les essais et les prototypes qui donnent naissance aux futures pièces de Bel Air One.",
  },
  {
    title: 'DÉFILÉS',
    text: "Les défilés sont une manière de partager une vision. Retrouvez ici les présentations à venir, les images exclusives, les coulisses et les moments qui participent à l’histoire de la maison.",
  },
  {
    title: 'CRÉATIONS FUTURES',
    text: "Certaines créations ne sont pas encore disponibles publiquement. Cette section offre un aperçu des pièces actuellement en développement et destinées aux prochaines saisons de la maison.",
  },
  {
    title: 'JOURNAL',
    text: "Bel Air One évolue en permanence. Cet espace rassemble les inspirations, les réflexions, les décisions créatives et les étapes importantes qui façonnent la maison au fil du temps.",
  },
  {
    title: 'PRIVATE ACCESS',
    text: "Certaines créations, expériences et projets sont réservés aux membres de First Class. Vous y découvrirez des accès anticipés, des réservations privées et des initiatives exclusives de la maison.",
  },
];

export default function FirstClass() {
  const { currentUser } = useAuth();
  const hasAccess = currentUser?.role === 'admin' || currentUser?.vip;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-[#c9a35d]">
        <section className="min-h-screen flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-5xl font-medium tracking-[0.18em] normal-case">
              First class
            </h1>
            <p className="font-editorial text-lg md:text-xl text-[#c9a35d]/85 mt-8 max-w-xl mx-auto leading-relaxed">
              First Class réunit nos pièces les plus abouties.<br />
              Confectionnées avec précision, en séries très limitées,<br />
              pour préserver l'essence originale de chaque création.
            </p>
            <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-[#c9a35d]/55">
              Accès sur invitation
            </p>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#c9a35d]">
      <section className="relative px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mx-auto max-w-[1320px]"
        >
          <div className="mx-auto flex min-h-[58vh] max-w-[960px] flex-col items-center justify-center text-center">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#c9a35d]/62">
              Espace privé de la Maison
            </p>
            <h1 className="mt-8 text-4xl font-medium tracking-[0.24em] text-[#c9a35d] md:text-6xl">
              FIRST CLASS
            </h1>
            <p className="mt-12 max-w-[920px] font-editorial text-xl leading-loose text-[#c9a35d]/78 md:text-3xl">
              Cet espace est réservé à ceux qui souhaitent découvrir Bel Air One au-delà du prêt-à-porter. Vous y trouverez le développement des créations, les projets à venir, les défilés et l’évolution de la maison vue de l’intérieur.
            </p>
          </div>

          <div>
            {firstClassSections.map((section) => (
              <article
                key={section.title}
                className="flex min-h-[56vh] flex-col items-center justify-center border-t border-[#c9a35d]/18 px-0 py-20 text-center md:py-24"
              >
                <p className="text-[10px] uppercase tracking-[0.38em] text-[#c9a35d]/52">
                  BEL AIR ONE
                </p>
                <h2 className="mt-8 text-3xl font-medium tracking-[0.22em] text-[#c9a35d] md:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-10 max-w-[900px] font-editorial text-xl leading-loose text-[#c9a35d]/75 md:text-3xl">
                  {section.text}
                </p>
              </article>
            ))}
          </div>

          <div className="border-t border-[#c9a35d]/18 px-0 py-24 text-center">
            <p className="mx-auto max-w-[820px] font-editorial text-xl leading-loose text-[#c9a35d]/75 md:text-3xl">
              Vous serez informés personnellement de chaque évolution de la Maison.
            </p>
          </div>

          <div className="mt-16 text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a35d]/48">
              Accès accordé à {currentUser?.name}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
