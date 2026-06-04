import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#19110b] pt-[60px]">
      <section className="px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-[760px]"
        >
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#8a8278]">Contact</p>
            <h1 className="mt-8 text-3xl font-medium tracking-[0.18em] md:text-5xl">
              BEL AIR ONE
            </h1>
            <p className="mx-auto mt-10 max-w-xl font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
              Pour toute demande privée, adressez un message à la Maison.
            </p>
          </div>

          <form
            action="https://formsubmit.co/belairone.ch@gmail.com"
            method="POST"
            className="mt-16 space-y-8"
          >
            <input type="hidden" name="_subject" value="Nouvelle demande BEL AIR ONE" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://www.belairone.com/?contact=envoye" />

            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Nom</span>
              <input
                name="name"
                required
                className="mt-3 w-full border-b border-[#19110b]/25 bg-transparent py-4 outline-none transition-colors focus:border-[#19110b]"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-3 w-full border-b border-[#19110b]/25 bg-transparent py-4 outline-none transition-colors focus:border-[#19110b]"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Message</span>
              <textarea
                name="message"
                required
                rows={6}
                className="mt-3 w-full resize-none border-b border-[#19110b]/25 bg-transparent py-4 outline-none transition-colors focus:border-[#19110b]"
              />
            </label>

            <button className="w-full border border-[#19110b] py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-[#19110b] hover:text-white md:w-auto md:px-16">
              Envoyer
            </button>
          </form>

          <p className="mt-12 text-center text-[11px] tracking-[0.12em] text-[#8a8278]">
            belairone.ch@gmail.com
          </p>
        </motion.div>
      </section>
    </div>
  );
}
