import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

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
      <section className="relative min-h-screen px-6 pt-32 pb-20 md:px-10 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mx-auto max-w-[1180px]"
        >
          <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#c9a35d]/55">
                Salon privé
              </p>
              <h1 className="mt-7 text-4xl font-medium tracking-[0.16em] normal-case md:text-6xl">
                First class
              </h1>
            </div>
            <p className="font-editorial text-lg leading-relaxed text-[#c9a35d]/82 md:text-2xl">
              Cette sélection est réservée aux comptes approuvés par la Maison. Chaque pièce est présentée en avant-première aux membres First Class.
            </p>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden border border-[#c9a35d]/24 bg-[#c9a35d]/24 md:grid-cols-3">
            {[
              ['Class 1 — I', 'Pièce privée', 'Disponible sur invitation'],
              ['Class 1 — II', 'Édition limitée', 'Présentation confidentielle'],
              ['Class 1 — III', 'Archive active', 'Réservation par la Maison'],
            ].map(([title, type, status]) => (
              <article key={title} className="min-h-[260px] bg-black p-7 md:p-9">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#c9a35d]/50">{type}</p>
                <h2 className="mt-12 text-xl font-normal tracking-[0.16em] normal-case text-[#c9a35d] md:text-2xl">
                  {title}
                </h2>
                <p className="mt-6 font-editorial text-lg text-[#c9a35d]/72">{status}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-[#c9a35d]/20 pt-8 text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a35d]/55">
              Accès accordé à {currentUser?.name}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
