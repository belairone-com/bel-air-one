import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Menu, Search, Heart, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import FirstClass from './pages/FirstClass';
import AdminPanel from './pages/AdminPanel';
import CategoryPage from './pages/CategoryPage';
import Maison from './pages/Maison';
import Contact from './pages/Contact';
import Archives from './pages/Archives';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AuthGate from './components/AuthGate';
import { supabase } from './lib/supabase';

type AccountPiece = {
  archive_code: string;
  product_name: string;
  season: string;
  description: string;
  certificate_path: string | null;
  created_at: string;
};

const pageTransitionReveals = [
  {
    word: 'ESMERALDA',
    image: '/images/page-transition-logo.jpg',
    delay: 0,
    duration: 1.3,
  },
  {
    word: 'ESMERALDA',
    image: '/images/page-transition-logo.jpg',
    delay: 1.3,
    duration: 1.3,
  },
  {
    word: 'AURORE',
    image: '/images/page-transition-aurore.png',
    delay: 2.6,
    duration: 1.4,
  },
];
const pageTransitionDuration = 4000;
const firstClassTransitionPaths = [
  '/',
  '/pret-a-porter',
  '/maroquinerie',
  '/robes',
  '/accessoires',
  '/first-class',
  '/archives',
  '/maison',
  '/contact',
  '/administration',
  '/belaironeadmin',
];

function shouldUseFirstClassTransition(nextUrl: URL, currentUrl: URL) {
  const isFirstClassSource =
    currentUrl.pathname === '/first-class' ||
    currentUrl.searchParams.get('theme') === 'first-class';

  return nextUrl.pathname === '/first-class' || (isFirstClassSource && firstClassTransitionPaths.includes(nextUrl.pathname));
}

function requestPageTransition(path: string) {
  window.dispatchEvent(new CustomEvent('belairone:navigate', { detail: { path } }));
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageTransitionOverlay() {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFirstClassMenuTransition, setIsFirstClassMenuTransition] = useState(() => {
    const currentUrl = new URL(window.location.href);
    return shouldUseFirstClassTransition(currentUrl, currentUrl);
  });

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      timeoutRef.current = null;
    }, pageTransitionDuration);

    const startTransition = (path: string) => {
      const nextUrl = new URL(path, window.location.origin);
      const currentUrl = new URL(window.location.href);
      const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

      if (nextUrl.origin !== window.location.origin || nextPath === currentPath || isTransitioningRef.current) return;

      setIsFirstClassMenuTransition(shouldUseFirstClassTransition(nextUrl, currentUrl));
      isTransitioningRef.current = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setIsVisible(true);
      timeoutRef.current = window.setTimeout(() => {
        navigate(nextPath);
        isTransitioningRef.current = false;
        setIsVisible(false);
        timeoutRef.current = null;
      }, pageTransitionDuration);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const linkTarget = anchor.getAttribute('target');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || linkTarget === '_blank') return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      startTransition(`${url.pathname}${url.search}${url.hash}`);
    };

    const handleRequestedNavigation = (event: Event) => {
      const requestedPath = (event as CustomEvent<{ path: string }>).detail?.path;
      if (requestedPath) startTransition(requestedPath);
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('belairone:navigate', handleRequestedNavigation);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('belairone:navigate', handleRequestedNavigation);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        isTransitioningRef.current = false;
      }
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed inset-0 z-[9999] pointer-events-none overflow-hidden ${isFirstClassMenuTransition ? 'bg-black' : 'bg-[#fbfaf7]'}`}
        >
          <div className={`absolute inset-0 ${isFirstClassMenuTransition ? 'bg-black' : 'bg-[#fbfaf7]'}`} />

          {pageTransitionReveals.map((reveal) => (
            <motion.div
              key={`${reveal.word}-${reveal.delay}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: [0, 1, 1, 0], y: [16, 4, 12, 26] }}
              transition={{
                duration: reveal.duration,
                delay: reveal.delay,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.24, 0.78, 1],
              }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
            >
              <img
                src={reveal.image}
                alt=""
                aria-hidden="true"
                className="mb-10 h-[17vh] max-h-[180px] min-h-[90px] w-auto object-contain opacity-70"
                style={isFirstClassMenuTransition ? {
                  filter: 'brightness(0) saturate(100%) invert(68%) sepia(42%) saturate(536%) hue-rotate(2deg) brightness(91%) contrast(88%)',
                } : undefined}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactSuccessNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const messageSent = params.get('contact') === 'envoye';

    if (!messageSent) return;

    setIsVisible(true);
    const cleanUrlTimer = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 250);
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 6500);

    return () => {
      window.clearTimeout(cleanUrlTimer);
      window.clearTimeout(hideTimer);
    };
  }, [location.search, navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed left-1/2 top-20 z-[80] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 border border-[#19110b]/15 bg-[#fbfaf7] px-6 py-5 text-center shadow-[0_20px_60px_rgba(25,17,11,0.08)]"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a8278]">Message envoyé</p>
          <p className="mt-3 font-editorial text-xl text-[#19110b]">
            Votre message a bien été envoyé.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountView, setAccountView] = useState<'dashboard' | 'pieces'>('dashboard');
  const [accountPieces, setAccountPieces] = useState<AccountPiece[]>([]);
  const [isLoadingAccountPieces, setIsLoadingAccountPieces] = useState(false);
  const [accountPiecesMessage, setAccountPiecesMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdminAccount, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const isFirstClassPage = location.pathname === '/first-class';
  const isFirstClassContactPage = location.pathname === '/contact' && new URLSearchParams(location.search).get('theme') === 'first-class';
  const isFirstClassTheme = isFirstClassPage || isFirstClassContactPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen || isAccountOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, isSearchOpen, isAccountOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 180);
    }
  }, [isSearchOpen]);

  const isLight = (isHomePage && !isScrolled) || isFirstClassTheme;
  const textColor = isFirstClassTheme ? 'text-[#c9a35d]' : isLight ? 'text-white' : 'text-[#19110b]';
  const bgColor = isFirstClassTheme ? 'bg-black' : isScrolled || !isHomePage ? 'bg-white' : 'bg-transparent';
  const borderBottom = isFirstClassTheme ? 'border-b border-[#c9a35d]/18' : isScrolled || !isHomePage ? 'border-b border-[#e8e8e4]' : 'border-b border-transparent';
  const firstClassPanelTheme = isFirstClassTheme;
  const firstClassContactPath = firstClassPanelTheme ? '/contact?theme=first-class' : '/contact';
  const panelBg = firstClassPanelTheme ? 'bg-black' : 'bg-white';
  const panelSurfaceBg = firstClassPanelTheme ? 'bg-black' : 'bg-[#fbfaf7]';
  const panelText = firstClassPanelTheme ? 'text-[#c9a35d]' : 'text-[#19110b]';
  const panelMutedText = firstClassPanelTheme ? 'text-[#c9a35d]/58' : 'text-[#8a8278]';
  const panelBorder = firstClassPanelTheme ? 'border-[#c9a35d]/18' : 'border-[#e8e8e4]';
  const panelRule = firstClassPanelTheme ? 'border-[#c9a35d]/35' : 'border-[#19110b]/30';
  const menuItems = [
    { label: 'Prêt-à-Porter', to: '/pret-a-porter' },
    { label: 'Maroquinerie', to: '/maroquinerie' },
    { label: 'Robes', to: '/robes' },
    { label: 'Accessoires', to: '/accessoires' },
    { label: 'First Class', to: '/first-class' },
    { label: 'Les Archives', to: '/archives' },
    { label: 'La Maison', to: '/maison' },
    { label: 'Contact', to: firstClassContactPath },
    ...(isAdminAccount ? [{ label: 'Administration', to: '/administration' }] : []),
  ];
  const searchableProducts = [
    { name: 'Malle Bel Air One', to: '/product/malle-bel-air-one' },
    { name: 'Malle Jour Blanc', to: '/product/malle-jour-blanc' },
    { name: 'Robe Jour Blanc', to: '/product/robe-jour-blanc' },
    { name: 'Portefeuille Signature', to: '/product/portefeuille-signature' },
    { name: 'Veste Première', to: '/product/veste-premiere' },
    { name: 'Manteau Belvédère', to: '/product/manteau-belvedere' },
    { name: 'Collier Perle One', to: '/product/collier-perle-one' },
    { name: 'Sac Alpine', to: '/product/sac-alpine' },
  ];

  const normalizeSearch = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const openSearch = () => {
    setSearchQuery('');
    setSearchMessage('');
    setIsSearchOpen(true);
  };

  const handleAccountClick = () => {
    if (!currentUser) {
      if (isFirstClassPage) {
        window.sessionStorage.setItem('belairone:first-class-account-theme', '1');
      } else {
        window.sessionStorage.removeItem('belairone:first-class-account-theme');
      }
      logout();
      return;
    }

    setAccountView('dashboard');
    setIsAccountOpen(true);
  };

  const openAccountPieces = async () => {
    setAccountView('pieces');
    setAccountPieces([]);
    setAccountPiecesMessage('');

    if (!currentUser) return;

    if (!supabase) {
      setAccountPiecesMessage("Vos pièces ne sont pas disponibles pour le moment.");
      return;
    }

    setIsLoadingAccountPieces(true);
    const { data, error } = await supabase
      .from('maison_archives')
      .select('archive_code, product_name, season, description, certificate_path, created_at')
      .eq('owner_email', currentUser.email)
      .in('status', ['active', 'archived'])
      .order('created_at', { ascending: false });
    setIsLoadingAccountPieces(false);

    if (error) {
      setAccountPiecesMessage("Impossible de charger vos pièces pour le moment.");
      return;
    }

    setAccountPieces((data ?? []) as AccountPiece[]);
    if (!data || data.length === 0) {
      setAccountPiecesMessage('Aucune pièce enregistrée à votre nom pour le moment.');
    }
  };

  const handleLogout = () => {
    setIsAccountOpen(false);
    if (isFirstClassTheme) {
      window.sessionStorage.setItem('belairone:first-class-account-theme', '1');
    } else {
      window.sessionStorage.removeItem('belairone:first-class-account-theme');
    }
    logout();
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = normalizeSearch(searchQuery);
    const result = searchableProducts.find((product) => normalizeSearch(product.name).includes(query));

    if (query && result) {
      setIsSearchOpen(false);
      requestPageTransition(result.to);
      return;
    }

    setSearchMessage("Cette pièce n'existe pas dans les archives.");
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${bgColor} ${borderBottom}`}>
        <div className="relative flex items-center justify-between px-6 lg:px-10 h-[60px]">
          
          {/* Left side */}
          <div className={`flex items-center gap-3 md:gap-6 ${textColor} transition-colors duration-300`}>
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="hover:opacity-60 transition-opacity"
            >
              <Menu size={20} strokeWidth={1.3} />
            </button>
            <button onClick={openSearch} className="hover:opacity-60 transition-opacity -ml-1 md:ml-0" aria-label="Rechercher">
              <Search size={18} strokeWidth={1.3} />
            </button>
          </div>

          {/* Center — Logo (absolute centered) */}
          <Link 
            to="/" 
            className={`absolute left-1/2 -translate-x-1/2 text-[18px] md:text-[26px] font-medium tracking-[0.26em] md:tracking-[0.35em] whitespace-nowrap ${textColor} transition-colors duration-300`}
          >
            BEL AIR ONE
          </Link>

          {/* Right side — Nous Contacter + icons */}
          <div className={`flex items-center gap-5 ${textColor} transition-colors duration-300`}>
            <Link
              to={firstClassContactPath}
              className="hidden lg:inline text-[13px] tracking-[0.04em] hover:opacity-60 transition-opacity"
            >
              Nous Contacter
            </Link>
            <button className="text-[#8fd0ff] hover:opacity-60 transition-opacity" aria-label="Favoris">
              <Heart size={20} strokeWidth={1.3} fill="currentColor" />
            </button>
            <button onClick={handleAccountClick} className="hover:opacity-60 transition-opacity" aria-label="Mon compte">
              <User size={20} strokeWidth={1.3} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`fixed inset-0 z-[60] flex flex-col ${panelBg} ${panelText}`}
          >
            {/* Menu header */}
            <div className={`flex h-[60px] items-center justify-between border-b px-6 lg:px-10 ${panelBorder}`}>
              <div className="w-20"></div>
              <span className={`text-[18px] md:text-[26px] font-medium tracking-[0.26em] md:tracking-[0.35em] whitespace-nowrap ${panelText}`}>
                BEL AIR ONE
              </span>
              <div className="w-20 flex justify-end">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className={`${panelText} hover:opacity-60 transition-opacity`}
                >
                  <X size={24} strokeWidth={1.2} />
                </button>
              </div>
            </div>

            {/* Menu links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-7">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                >
                  <Link 
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl md:text-3xl font-light tracking-[0.15em] hover:opacity-50 transition-opacity ${item.to === '/first-class' ? 'text-[#c9a35d]' : panelText}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className={`py-8 text-center text-[11px] tracking-[0.25em] ${panelMutedText}`}>
              <button onClick={handleLogout} className="hover:opacity-70 transition-opacity">
                SE DÉCONNECTER
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAccountOpen && currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`fixed inset-0 z-[75] ${panelSurfaceBg} ${panelText}`}
          >
            <div className={`flex h-[60px] items-center justify-between border-b px-6 lg:px-10 ${panelBorder}`}>
              <div className="w-12" />
              <span className="text-[18px] font-medium tracking-[0.26em] md:text-[26px] md:tracking-[0.35em]">
                BEL AIR ONE
              </span>
              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  setAccountView('dashboard');
                }}
                className="hover:opacity-60 transition-opacity"
                aria-label="Fermer le compte"
              >
                <X size={24} strokeWidth={1.2} />
              </button>
            </div>

            <div className={`min-h-[calc(100vh-60px)] px-6 py-16 md:px-10 md:py-24 ${firstClassPanelTheme ? 'bg-black' : 'bg-[#f5f4f2]'}`}>
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
                className="mx-auto w-full max-w-[1500px] text-center"
              >
                {accountView === 'dashboard' ? (
                  <>
                    <p className={`text-[10px] uppercase tracking-[0.34em] ${panelMutedText}`}>Mon Compte</p>
                    <h2 className="mt-8 text-2xl font-medium tracking-[0.08em] md:text-3xl">
                      {currentUser.name}
                    </h2>

                    <div className="mt-16 grid gap-6 text-left md:grid-cols-2">
                      {[
                        {
                          title: 'Mon profil',
                          body: `Connecté : ${currentUser.email}`,
                          action: 'Modifier mon profil',
                        },
                        {
                          title: 'Mes pièces',
                          body: 'Les pièces enregistrées à votre nom apparaîtront ici.',
                          action: 'Consulter mes pièces',
                          onClick: openAccountPieces,
                        },
                        {
                          title: 'Ma liste de souhaits',
                          body: 'Votre liste de souhaits est vide.',
                        },
                      ].map((card) => (
                        <article
                          key={card.title}
                          className={`flex min-h-[230px] flex-col justify-between ${
                            firstClassPanelTheme
                              ? 'border border-[#c9a35d]/18 bg-black'
                              : 'border border-[#e2ded8] bg-white'
                          }`}
                        >
                          <h3 className="border-b border-current/12 px-7 py-7 text-2xl font-light tracking-[0.02em]">
                            {card.title}
                          </h3>
                          <div className="px-7 py-7">
                            <p className={`text-base leading-relaxed ${firstClassPanelTheme ? 'text-[#c9a35d]/78' : 'text-[#342f2a]'}`}>
                              {card.body}
                            </p>
                            {card.action && (
                              <button
                                type="button"
                                onClick={card.onClick}
                                className={`mt-8 w-full rounded-full py-4 text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-80 ${
                                  firstClassPanelTheme
                                    ? 'bg-[#c9a35d] text-black'
                                    : 'bg-black text-white'
                                }`}
                              >
                                {card.action}
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-left">
                    <button
                      type="button"
                      onClick={() => setAccountView('dashboard')}
                      className={`mb-10 text-[10px] uppercase tracking-[0.24em] ${panelMutedText} hover:opacity-70`}
                    >
                      Retour au compte
                    </button>
                    <div className={`border ${firstClassPanelTheme ? 'border-[#c9a35d]/18 bg-black' : 'border-[#e2ded8] bg-white'}`}>
                      <h2 className="border-b border-current/12 px-7 py-8 text-3xl font-light tracking-[0.08em]">
                        Mes pièces
                      </h2>
                      <div className="px-7 py-8">
                        {isLoadingAccountPieces ? (
                          <p className={`font-editorial text-xl ${panelMutedText}`}>Chargement des pièces.</p>
                        ) : accountPieces.length > 0 ? (
                          <div className="space-y-8">
                            {accountPieces.map((piece) => (
                              <article key={piece.archive_code} className="border-b border-current/12 pb-8 last:border-b-0 last:pb-0">
                                <p className={`text-[10px] uppercase tracking-[0.28em] ${panelMutedText}`}>
                                  Archive {piece.archive_code}
                                </p>
                                <h3 className="mt-4 text-2xl font-medium tracking-[0.1em]">
                                  {piece.product_name}
                                </h3>
                                <p className={`mt-3 text-[11px] uppercase tracking-[0.22em] ${panelMutedText}`}>
                                  {piece.season}
                                </p>
                                <p className={`mt-6 font-editorial text-xl leading-relaxed ${firstClassPanelTheme ? 'text-[#c9a35d]/78' : 'text-[#6f675f]'}`}>
                                  {piece.description}
                                </p>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className={`font-editorial text-xl ${firstClassPanelTheme ? 'text-[#c9a35d]/78' : 'text-[#6f675f]'}`}>
                            {accountPiecesMessage || 'Aucune pièce enregistrée à votre nom pour le moment.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className={`mt-10 border px-8 py-4 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                    firstClassPanelTheme
                      ? 'border-[#c9a35d]/60 hover:bg-[#c9a35d] hover:text-black'
                      : 'border-[#19110b] hover:bg-[#19110b] hover:text-white'
                  }`}
                >
                  Se déconnecter
                </button>
              </motion.section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`fixed inset-0 z-[70] ${panelSurfaceBg} ${panelText}`}
          >
            <div className={`flex h-[60px] items-center justify-between border-b px-6 lg:px-10 ${panelBorder}`}>
              <div className="w-12" />
              <span className="text-[18px] md:text-[26px] font-medium tracking-[0.26em] md:tracking-[0.35em] whitespace-nowrap">
                BEL AIR ONE
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="hover:opacity-60 transition-opacity"
                aria-label="Fermer la recherche"
              >
                <X size={24} strokeWidth={1.2} />
              </button>
            </div>

            <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-6">
              <motion.form
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
                className="w-full max-w-2xl text-center"
              >
                <p className={`mb-8 text-[10px] uppercase tracking-[0.34em] ${panelMutedText}`}>Archives de la Maison</p>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchMessage('');
                  }}
                  placeholder="Nom de la pièce"
                  className={`w-full bg-transparent border-b pb-5 text-center font-editorial text-3xl outline-none transition-colors placeholder:text-current/35 focus:border-current md:text-5xl ${panelRule}`}
                  autoComplete="off"
                />
                <button className="mt-10 border-b border-current pb-2 text-[10px] uppercase tracking-[0.28em] hover:opacity-60 transition-opacity">
                  Rechercher
                </button>

                {searchMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-12 font-editorial text-xl md:text-2xl ${firstClassPanelTheme ? 'text-[#c9a35d]/72' : 'text-[#6f675f]'}`}
                  >
                    {searchMessage}
                  </motion.p>
                )}
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  const location = useLocation();
  const isFirstClassPrivatePage = location.pathname === '/first-class';
  const isFirstClassFooter =
    location.pathname === '/first-class' ||
    (location.pathname === '/contact' && new URLSearchParams(location.search).get('theme') === 'first-class');
  const contactPath = isFirstClassFooter ? '/contact?theme=first-class' : '/contact';
  const headingColor = isFirstClassFooter ? 'text-[#c9a35d]/58' : 'text-white/70';
  const bodyColor = isFirstClassFooter ? 'text-[#c9a35d]/78' : 'text-white/80';
  const linkColor = isFirstClassFooter ? 'text-[#c9a35d] hover:text-[#c9a35d]/70' : 'text-white hover:text-white/70';

  return (
    <footer className="bg-[#050505] px-6 py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <h3 className={`mb-12 text-[11px] uppercase tracking-[0.32em] ${headingColor}`}>Contact</h3>
        <p className={`mb-8 font-editorial text-xl md:text-2xl ${bodyColor}`}>
          {isFirstClassPrivatePage ? 'Numéro privé du fondateur :' : 'Pour toute demande privée :'}
        </p>
        {isFirstClassPrivatePage ? (
          <a
            href="https://wa.me/41774610706"
            target="_blank"
            rel="noreferrer"
            className={`mb-16 block text-sm tracking-[0.12em] transition-colors md:text-base ${linkColor}`}
          >
            +41 077 461 07 06
          </a>
        ) : (
          <Link
            to={contactPath}
            className={`mb-16 block text-sm tracking-[0.12em] transition-colors md:text-base ${linkColor}`}
          >
            belairone.ch@gmail.com
          </Link>
        )}
        <p className={`mb-5 text-[11px] uppercase tracking-[0.28em] ${isFirstClassFooter ? 'text-[#c9a35d]/45' : 'text-white/45'}`}>Instagram</p>
        <a
          href="https://instagram.com/belair.one"
          target="_blank"
          rel="noreferrer"
          className={`text-sm tracking-[0.12em] transition-colors md:text-base ${linkColor}`}
        >
          @belair.one
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <PageTransitionOverlay />
        <ContactSuccessNotice />
        <AuthGate>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pret-a-porter" element={<CategoryPage category="pret-a-porter" />} />
                <Route path="/pret-a-porter/homme" element={<CategoryPage category="pret-a-porter" audience="homme" />} />
                <Route path="/pret-a-porter/femme" element={<CategoryPage category="pret-a-porter" audience="femme" />} />
                <Route path="/maroquinerie" element={<CategoryPage category="maroquinerie" />} />
                <Route path="/robes" element={<CategoryPage category="robes" />} />
                <Route path="/accessoires" element={<CategoryPage category="accessoires" />} />
                <Route path="/first-class" element={<FirstClass />} />
                <Route path="/archives" element={<Archives />} />
                <Route path="/maison" element={<Maison />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/administration" element={<AdminPanel />} />
                <Route path="/belaironeadmin" element={<AdminPanel />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthGate>
      </Router>
    </AuthProvider>
  );
}
