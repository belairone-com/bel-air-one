import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

type PublicArchive = {
  archive_code: string;
  product_name: string;
  season: string;
  description: string;
  image_paths: string[];
  certificate_path: string | null;
  created_at: string;
};

function normalizeArchiveCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '-');
}

export default function Archives() {
  const [archiveCode, setArchiveCode] = useState('');
  const [archive, setArchive] = useState<PublicArchive | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setArchive(null);
    setFileUrls({});

    const requestedCode = normalizeArchiveCode(archiveCode);
    if (!requestedCode) {
      setMessage("Veuillez saisir un numéro d'archive.");
      return;
    }

    if (!supabase) {
      setMessage("Les archives ne sont pas disponibles pour le moment.");
      return;
    }

    setIsSearching(true);
    const { data, error } = await supabase.rpc('maison_archive_public_lookup', {
      requested_archive_code: requestedCode,
    });
    setIsSearching(false);

    if (error || !data?.[0]) {
      setMessage("Aucune création active ne correspond à ce numéro d'archive.");
      return;
    }

    const foundArchive = data[0] as PublicArchive;
    setArchive(foundArchive);

    const paths = [
      ...foundArchive.image_paths,
      ...(foundArchive.certificate_path ? [foundArchive.certificate_path] : []),
    ];

    if (paths.length > 0) {
      const { data: signedUrls } = await supabase.storage.from('maison-archives').createSignedUrls(paths, 60 * 60);
      const nextUrls: Record<string, string> = {};
      signedUrls?.forEach((item) => {
        if (item.path && item.signedUrl) {
          nextUrls[item.path] = item.signedUrl;
        }
      });
      setFileUrls(nextUrls);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#342f2a] pt-[60px]">
      <section className="px-6 py-24 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-[980px] text-center"
        >
          <h1 className="text-4xl font-medium tracking-[0.28em] md:text-7xl">
            LES ARCHIVES DE LA MAISON
          </h1>
          <p className="mx-auto mt-16 max-w-3xl font-editorial text-2xl leading-relaxed text-[#746d66] md:text-4xl">
            Chaque création de BEL AIR ONE possède son propre numéro d'archive.
          </p>
          <p className="mx-auto mt-14 max-w-4xl text-lg leading-loose tracking-[0.08em] text-[#837c74] md:text-2xl">
            Les Archives de la Maison permettent de consulter l'enregistrement officiel d'une création et de confirmer son appartenance aux archives de BEL AIR ONE.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-28 max-w-[620px]">
            <input
              value={archiveCode}
              onChange={(event) => {
                setArchiveCode(event.target.value);
                setMessage('');
              }}
              placeholder="Numéro d'archive"
              className="w-full border-b border-[#19110b] bg-transparent pb-7 text-center text-xl tracking-[0.22em] outline-none placeholder:text-[#aaa39a] md:text-2xl"
              autoComplete="off"
            />
            <button
              disabled={isSearching}
              className="mt-16 border-b border-[#19110b] pb-4 text-[11px] uppercase tracking-[0.34em] text-[#19110b] transition-opacity hover:opacity-60 disabled:cursor-wait disabled:opacity-50"
            >
              {isSearching ? 'Recherche' : 'Accéder aux archives'}
            </button>
          </form>

          {message && (
            <p className="mx-auto mt-14 max-w-xl font-editorial text-xl text-[#6f675f]">
              {message}
            </p>
          )}
        </motion.div>

        {archive && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mx-auto mt-28 max-w-[980px] border-t border-[#ded7cc] pt-16"
          >
            <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a8278]">
                  Archive {archive.archive_code}
                </p>
                <h2 className="mt-6 text-3xl font-medium tracking-[0.14em] md:text-5xl">
                  {archive.product_name}
                </h2>
                <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-[#8a8278]">
                  {archive.season}
                </p>
              </div>
              <div>
                <p className="font-editorial text-xl leading-relaxed text-[#6f675f] md:text-2xl">
                  {archive.description}
                </p>
                <p className="mt-10 text-[10px] uppercase tracking-[0.28em] text-[#8a8278]">
                  Enregistrement officiel confirmé
                </p>
              </div>
            </div>

            {archive.image_paths.length > 0 && (
              <div className="mt-16 grid gap-5 md:grid-cols-2">
                {archive.image_paths.map((path) => (
                  <img
                    key={path}
                    src={fileUrls[path] ?? ''}
                    alt={archive.product_name}
                    className="aspect-[4/5] w-full bg-[#f0ede8] object-cover"
                  />
                ))}
              </div>
            )}

            {archive.certificate_path && (
              <a
                href={fileUrls[archive.certificate_path] ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="mt-12 inline-block border border-[#19110b] px-6 py-4 text-[10px] uppercase tracking-[0.24em] transition-colors hover:bg-[#19110b] hover:text-white"
              >
                Consulter le certificat
              </a>
            )}
          </motion.section>
        )}
      </section>
    </div>
  );
}
