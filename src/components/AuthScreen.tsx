import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function AuthScreen() {
  const { login, register, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const result = mode === 'register' ? await register({ name, email, password }) : await login(email, password);
    setIsSubmitting(false);
    if (!result.ok) {
      setMessage(result.message ?? 'Une erreur est survenue.');
    }
  };

  return (
    <main className="relative min-h-screen text-[#19110b] flex items-center justify-center px-6 py-12 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://i.ibb.co/x8DqQJPm/Diferencia-en-tonos-fondo.png"
          alt="Fond BEL AIR ONE"
          className="w-full h-full object-cover object-center scale-105 blur-[6px]"
        />
        <div className="absolute inset-0 bg-[#f7f6f2]/78 backdrop-blur-sm" />
      </div>

      <button
        onClick={continueAsGuest}
        className="fixed right-6 top-6 z-20 text-[#19110b] hover:opacity-50 transition-opacity"
        aria-label="Fermer et accéder au site"
      >
        <X size={26} strokeWidth={1.1} />
      </button>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[420px] text-center"
      >
        <h1 className="text-3xl md:text-4xl font-medium tracking-[0.28em] mb-12">BEL AIR ONE</h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {mode === 'register' && (
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278] mb-2">Nom</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent border-b border-[#19110b]/30 py-3 outline-none focus:border-[#19110b] transition-colors"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278] mb-2">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent border-b border-[#19110b]/30 py-3 outline-none focus:border-[#19110b] transition-colors"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278] mb-2">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent border-b border-[#19110b]/30 py-3 outline-none focus:border-[#19110b] transition-colors"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </label>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[#7a1f1f] pt-2"
            >
              {message}
            </motion.p>
          )}

          <button disabled={isSubmitting} className="w-full bg-[#19110b] text-white py-4 mt-6 text-[11px] uppercase tracking-[0.24em] hover:bg-black transition-colors disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Veuillez patienter' : mode === 'register' ? 'Créer mon compte' : 'Entrer'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'register' ? 'login' : 'register');
            setMessage('');
          }}
          className="mt-8 text-sm text-[#6f675f] hover:text-[#19110b] transition-colors"
        >
          {mode === 'register' ? 'Déjà inscrit ? Se connecter' : 'Créer un compte'}
        </button>

      </motion.section>
    </main>
  );
}
