import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isFirstClassTheme = new URLSearchParams(location.search).get('theme') === 'first-class';
  const pageClassName = isFirstClassTheme
    ? 'min-h-screen bg-black text-[#c9a35d] pt-[60px]'
    : 'min-h-screen bg-[#fbfaf7] text-[#19110b] pt-[60px]';
  const mutedText = isFirstClassTheme ? 'text-[#c9a35d]/62' : 'text-[#8a8278]';
  const editorialText = isFirstClassTheme ? 'text-[#c9a35d]/78' : 'text-[#6f675f]';
  const inputBorder = isFirstClassTheme ? 'border-[#c9a35d]/28 focus:border-[#c9a35d]' : 'border-[#19110b]/25 focus:border-[#19110b]';
  const buttonClassName = isFirstClassTheme
    ? 'w-full border border-[#c9a35d]/60 py-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a35d] transition-colors hover:bg-[#c9a35d] hover:text-black disabled:cursor-wait disabled:opacity-50 md:w-auto md:px-16'
    : 'w-full border border-[#19110b] py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-[#19110b] hover:text-white disabled:cursor-wait disabled:opacity-50 md:w-auto md:px-16';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formsubmit.co/ajax/belairone.ch@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      form.reset();
      navigate('/?contact=envoye');
    } catch {
      setErrorMessage("Votre message n'a pas pu être envoyé. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={pageClassName}>
      <section className="px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-[760px]"
        >
          <div className="text-center">
            <p className={`text-[10px] uppercase tracking-[0.34em] ${mutedText}`}>Contact</p>
            <h1 className="mt-8 text-3xl font-medium tracking-[0.18em] md:text-5xl">
              BEL AIR ONE
            </h1>
            <p className={`mx-auto mt-10 max-w-xl font-editorial text-xl leading-relaxed md:text-2xl ${editorialText}`}>
              Pour toute demande privée, adressez un message à la Maison.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-16 space-y-8"
          >
            <input type="hidden" name="_subject" value="Nouvelle demande BEL AIR ONE" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />

            <label className="block">
              <span className={`block text-[10px] uppercase tracking-[0.24em] ${mutedText}`}>Nom</span>
              <input
                name="name"
                required
                className={`mt-3 w-full border-b bg-transparent py-4 outline-none transition-colors ${inputBorder}`}
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className={`block text-[10px] uppercase tracking-[0.24em] ${mutedText}`}>Email</span>
              <input
                name="email"
                type="email"
                required
                data-formsubmit-replyto
                className={`mt-3 w-full border-b bg-transparent py-4 outline-none transition-colors ${inputBorder}`}
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className={`block text-[10px] uppercase tracking-[0.24em] ${mutedText}`}>Message</span>
              <textarea
                name="message"
                required
                rows={6}
                className={`mt-3 w-full resize-none border-b bg-transparent py-4 outline-none transition-colors ${inputBorder}`}
              />
            </label>

            {errorMessage && (
              <p className={`font-editorial text-lg ${editorialText}`}>
                {errorMessage}
              </p>
            )}

            <button
              disabled={isSending}
              className={buttonClassName}
            >
              {isSending ? 'Envoi' : 'Envoyer'}
            </button>
          </form>

          <p className={`mt-12 text-center text-[11px] tracking-[0.12em] ${mutedText}`}>
            belairone.ch@gmail.com
          </p>
        </motion.div>
      </section>
    </div>
  );
}
