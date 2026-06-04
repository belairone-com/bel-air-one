import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

const ACCESS_KEY = 'bel_air_one_site_access';
const sitePassword = import.meta.env.SITE_ACCESS_PASSWORD ?? '';

export default function SiteAccessGate({ children }: { children: ReactNode }) {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem(ACCESS_KEY) === 'true');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isUnlocked) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isUnlocked]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sitePassword && code === sitePassword) {
      sessionStorage.setItem(ACCESS_KEY, 'true');
      setIsUnlocked(true);
      setHasError(false);
      return;
    }

    setHasError(true);
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#19110b]">
      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-[360px] text-center">
          <h1 className="text-[24px] font-medium tracking-[0.34em] md:text-[32px]">
            BEL AIR ONE
          </h1>
          <div className="mx-auto mt-9 h-px w-20 bg-[#19110b]" />
          <p className="mt-10 font-editorial text-[24px] leading-relaxed text-[#4c4741]">
            La Maison ouvrira bientôt.
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#8a8278]">
            Accès privé.
          </p>

          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setHasError(false);
            }}
            placeholder="Code d’accès"
            type="password"
            autoComplete="current-password"
            className="mt-12 w-full border-b border-[#19110b]/30 bg-transparent px-2 pb-4 text-center text-[16px] tracking-[0.08em] outline-none transition-colors placeholder:text-[#aaa39a] focus:border-[#19110b]"
          />

          <button className="mt-9 w-full border border-[#19110b] py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-[#19110b] hover:text-white">
            Entrer
          </button>

          {hasError && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#8c2f24]">
              Code incorrect.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
