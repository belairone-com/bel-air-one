import { motion } from 'framer-motion';

export default function Maison() {
  return (
    <div className="min-h-screen bg-white text-[#19110b] pt-[60px]">
      <section className="min-h-[calc(100vh-60px)] flex items-center justify-center px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#8a8278]">BEL AIR ONE</p>
            <h1 className="mb-10 text-3xl md:text-5xl font-medium tracking-[0.14em] uppercase leading-tight">
              Notre Histoire
            </h1>
            <div className="font-editorial space-y-6 text-xl leading-relaxed text-[#6f675f]">
              <p>
                Un jour, alors que j'étais encore enfant, j'ai remarqué la même scène, encore et encore : les mêmes Nike, le même noir, les mêmes codes. Cette envie silencieuse de ressembler aux autres, simplement pour en faire partie.
              </p>
              <p>
                J'ai essayé, moi aussi. Mais ce n'était jamais vraiment moi. Comme ce moment que beaucoup connaissent, où l'on porte ce que tout le monde porte sans jamais vraiment s'y reconnaître.
              </p>
              <p>
                Avec le temps, cette sensation a laissé place à une conviction : celle de créer quelque chose de différent. Quelque chose de nouveau. Des pièces que très peu de personnes porteraient.
              </p>
              <p>
                C'est de cette conviction qu'est née BEL AIR ONE.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#8a8278]">BEL AIR ONE</p>
            <h2 className="mb-10 text-3xl md:text-5xl font-medium tracking-[0.14em] uppercase leading-tight">
              Savoir-faire
            </h2>
            <div className="font-editorial space-y-6 text-xl leading-relaxed text-[#6f675f]">
              <p>
                Toutes les pièces BEL AIR ONE sont conçues entre la Suisse et l'Italie.
              </p>
              <p>
                Nous travaillons avec des ateliers sélectionnés pour leur savoir-faire, leur exigence et l'attention portée à chaque détail.
              </p>
              <p>
                Nous ne produisons pas en masse. Chaque pièce est fabriquée en quantités très limitées, toujours sur commande, afin de préserver son exclusivité.
              </p>
              <p>
                Toutes nos créations sont numérotées individuellement, faisant de chaque pièce une part de l'histoire de BEL AIR ONE.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white px-8 py-28 md:py-40 text-[#19110b]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#8a8278]">BEL AIR ONE</p>
          <h2 className="mb-12 text-3xl md:text-5xl font-medium tracking-[0.14em] uppercase leading-tight">
            Le Rythme de la Maison
          </h2>
          <div className="font-editorial mx-auto max-w-2xl space-y-5 text-xl md:text-2xl leading-relaxed text-[#6f675f]">
            <p>Deux saisons rythment l'année.</p>
            <p>
              De septembre à mars.<br />
              De mars à septembre.
            </p>
            <p>Chaque saison révèle une sélection de pièces dont le nombre varie.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, delay: 0.12, ease: 'easeOut' }}
          className="mx-auto mt-28 max-w-5xl"
        >
          <h3 className="mb-12 text-center text-xl md:text-2xl font-medium tracking-[0.18em] uppercase">
            Nos Prochaines Saisons
          </h3>

          <div className="border-y border-[#e8e2da]">
            {[
              ['JOUR BLANC', 'Septembre 2026', 'Mars 2027'],
              ['AZUR', 'Mars 2027', 'Septembre 2027'],
              ['NUIT ÉTOILÉE', 'Septembre 2027', 'Mars 2028'],
            ].map(([season, start, end]) => (
              <div
                key={season}
                className="grid grid-cols-1 gap-3 border-b border-[#e8e2da] py-8 text-center last:border-b-0 md:grid-cols-3 md:items-center md:text-left"
              >
                <p className="text-sm md:text-base uppercase tracking-[0.22em] text-[#19110b]">{season}</p>
                <p className="font-editorial text-lg md:text-xl text-[#6f675f] md:text-center">{start}</p>
                <p className="font-editorial text-lg md:text-xl text-[#6f675f] md:text-right">{end}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}