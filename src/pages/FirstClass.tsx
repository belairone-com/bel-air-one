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
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-8xl font-medium tracking-[0.18em] normal-case">
              First class
            </h1>
            <p className="font-editorial text-xl md:text-2xl text-[#c9a35d]/85 mt-10 max-w-3xl mx-auto leading-relaxed">
              First Class réunit nos pièces les plus abouties.<br />
              Confectionnées avec précision, en séries très limitées,<br />
              pour préserver l'essence originale de chaque création.
              <br />
              <br />
              Depuis sa création, 5 pièces de Class 1 ont vu le jour.
            </p>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#c9a35d]">
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-medium tracking-[0.18em] normal-case">
            First class
          </h1>
          <p className="font-editorial text-xl md:text-2xl text-[#c9a35d]/85 mt-10 max-w-3xl mx-auto leading-relaxed">
            First Class réunit nos pièces les plus abouties.<br />
            Confectionnées avec précision, en séries très limitées,<br />
            pour préserver l'essence originale de chaque création.
            <br />
            <br />
            Depuis sa création, 5 pièces de Class 1 ont vu le jour.
          </p>
        </motion.div>
      </section>
    </div>
  );
}