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
import SiteAccessGate from './components/SiteAccessGate';

const pageTransitionReveals = [
  {
    word: 'ESMERALDA',
    image: 'https://i.ibb.co/tP1sdM9W/Captura-de-pantalla-2026-05-27-a-la-s-18-16-09-1-removebg-preview.png',
    delay: 0,
    duration: 1.3,
  },
  {
    word: 'ESMERALDA',
    image: 'https://i.ibb.co/tP1sdM9W/Captura-de-pantalla-2026-05-27-a-la-s-18-16-09-1-removebg-preview.png',
    delay: 1.3,
    duration: 1.3,
  },
  {
    word: 'AURORE',
    image: 'https://i.ibb.co/gZbgXv5S/Captura-de-pantalla-2026-05-27-a-la-s-18-15-50-removebg-preview.png',
    delay: 2.6,
    duration: 1.4,
  },
];
const pageTransitionDuration = 4000;

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startTransition = (path: string) => {
      const nextUrl = new URL(path, window.location.origin);
      const currentUrl = new URL(window.location.href);
      const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

      if (nextUrl.origin !== window.location.origin || nextPath === currentPath || isVisible) return;

      setIsVisible(true);
      timeoutRef.current = window.setTimeout(() => {
        navigate(nextPath);
        setIsVisible(false);
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
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [isVisible, navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-[#fbfaf7]"
        >
          <div className="absolute inset-0 bg-[#fbfaf7]" />

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdminAccount, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const isFirstClassPage = location.pathname === '/first-class';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 180);
    }
  }, [isSearchOpen]);

  const isLight = (isHomePage && !isScrolled) || isFirstClassPage;
  const textColor = isFirstClassPage ? 'text-[#c9a35d]' : isLight ? 'text-white' : 'text-[#19110b]';
  const bgColor = isFirstClassPage ? 'bg-black' : isScrolled || !isHomePage ? 'bg-white' : 'bg-transparent';
  const borderBottom = isFirstClassPage ? 'border-b border-[#c9a35d]/18' : isScrolled || !isHomePage ? 'border-b border-[#e8e8e4]' : 'border-b border-transparent';
  const menuItems = [
    { label: 'Prêt-à-Porter', to: '/pret-a-porter' },
    { label: 'Maroquinerie', to: '/maroquinerie' },
    { label: 'Robes', to: '/robes' },
    { label: 'Accessoires', to: '/accessoires' },
    { label: 'First Class', to: '/first-class' },
    { label: 'Les Archives', to: '/archives' },
    { label: 'La Maison', to: '/maison' },
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
            <Link to="/contact" className="hidden lg:inline text-[13px] tracking-[0.04em] hover:opacity-60 transition-opacity">
              Nous Contacter
            </Link>
            <button className="hidden text-[#b11226] md:block hover:opacity-60 transition-opacity" aria-label="Favoris">
              <Heart size={20} strokeWidth={1.3} />
            </button>
            <button onClick={logout} className="hover:opacity-60 transition-opacity" aria-label="Se déconnecter">
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
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-6 lg:px-10 h-[60px] border-b border-[#e8e8e4]">
              <div className="w-20"></div>
              <span className="text-[18px] md:text-[26px] font-medium tracking-[0.26em] md:tracking-[0.35em] whitespace-nowrap text-[#19110b]">
                BEL AIR ONE
              </span>
              <div className="w-20 flex justify-end">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#19110b] hover:opacity-60 transition-opacity"
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
                    className="text-2xl md:text-3xl font-light tracking-[0.15em] text-[#19110b] hover:opacity-50 transition-opacity"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="py-8 text-center text-[11px] tracking-[0.25em] text-[#999]">
              <button onClick={logout} className="hover:text-[#19110b] transition-colors">
                SE DÉCONNECTER
              </button>
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
            className="fixed inset-0 z-[70] bg-[#fbfaf7] text-[#19110b]"
          >
            <div className="flex h-[60px] items-center justify-between border-b border-[#e8e2da] px-6 lg:px-10">
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
                <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#8a8278]">Archives de la Maison</p>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchMessage('');
                  }}
                  placeholder="Nom de la pièce"
                  className="w-full bg-transparent border-b border-[#19110b]/30 pb-5 text-center font-editorial text-3xl md:text-5xl outline-none placeholder:text-[#b8b1a7] focus:border-[#19110b] transition-colors"
                  autoComplete="off"
                />
                <button className="mt-10 text-[10px] uppercase tracking-[0.28em] border-b border-[#19110b] pb-2 hover:opacity-60 transition-opacity">
                  Rechercher
                </button>

                {searchMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 font-editorial text-xl md:text-2xl text-[#6f675f]"
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
  return (
    <footer className="bg-[#050505] text-white px-6 py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <h3 className="text-[11px] uppercase tracking-[0.32em] text-white/70 mb-12">Contact</h3>
        <p className="font-editorial text-xl md:text-2xl text-white/80 mb-8">
          Pour toute demande privée :
        </p>
        <a
          href="/contact"
          className="block text-sm md:text-base tracking-[0.12em] text-white hover:text-white/70 transition-colors mb-16"
        >
          belairone.ch@gmail.com
        </a>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45 mb-5">Instagram</p>
        <a
          href="https://instagram.com/belair.one"
          target="_blank"
          rel="noreferrer"
          className="text-sm md:text-base tracking-[0.12em] text-white hover:text-white/70 transition-colors"
        >
          @belair.one
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <SiteAccessGate>
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
    </SiteAccessGate>
  );
}
