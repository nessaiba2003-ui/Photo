import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Check, Clock, Image, Instagram, Lock, Mail, MapPin, MessageCircle, Moon, Pencil, Phone, Play, Plus, Save, Sparkles, Sun, Trash2, Upload, Video, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/app.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
const INSTAGRAM_URL = 'https://www.instagram.com/orion.polaris';
const WHATSAPP_URL = 'https://wa.me/212772604428';
const PHONE_DISPLAY = '+212 772 604 428';
const PHONE_TEL = '+212772604428';
const EMAIL = 'hamzaelbahi.orion@gmail.com';
const categories = ['All', 'Photography', 'Videography', 'Video Editing', 'Weddings', 'Events', 'Portraits', 'Commercial', 'Social Media Content'];
const categoryLabels = {
  en: {
    All: 'All',
    Photography: 'Photography',
    Videography: 'Videography',
    'Video Editing': 'Video Editing',
    Weddings: 'Weddings',
    Events: 'Events',
    Portraits: 'Portraits',
    Commercial: 'Commercial',
    'Social Media Content': 'Social Media Content'
  },
  fr: {
    All: 'Tout',
    Photography: 'Photographie',
    Videography: 'Videographie',
    'Video Editing': 'Montage video',
    Weddings: 'Mariages',
    Events: 'Evenements',
    Portraits: 'Portraits',
    Commercial: 'Commercial',
    'Social Media Content': 'Contenu reseaux sociaux'
  }
};
const formatPrice = (price) => `${Number(price).toLocaleString('fr-MA')} DH`;
const pick = (item, field, lang) => (lang === 'fr' && item?.[`${field}Fr`]) ? item[`${field}Fr`] : item?.[field];
const mediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`;
  return url;
};

const copy = {
  en: {
    nav: { site: 'Website', client: 'Client', admin: 'Admin' },
    theme: { dark: 'Dark', light: 'Light', toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
    hero: {
      eyebrow: 'High-end creative studio',
      work: 'View My Work',
      book: 'Book a Session'
    },
    intro: {
      eyebrow: 'Personal Brand',
      title: 'Frames with atmosphere. Films with pulse. Edits that feel expensive.',
      body: 'ALBATROS builds visual stories for couples, artists, founders, venues, and brands that need work with texture, restraint, and emotional clarity.'
    },
    portfolio: {
      eyebrow: 'Portfolio',
      title: 'Featured Projects',
      emptyTitle: 'Coming soon',
      emptyBody: 'This category is waiting for the exact ALBATROS visuals. Send the right set and it will replace this placeholder.'
    },
    services: {
      eyebrow: 'Services & Pricing',
      title: 'Dynamic Packages',
      editedAssets: 'edited assets',
      bookPackage: 'Book This Package'
    },
    booking: {
      eyebrow: 'Booking System',
      title: 'Request a Session',
      service: 'Service',
      package: 'Package',
      message: 'Additional message',
      review: 'Review Booking',
      note: 'Unavailable dates and existing pending or confirmed sessions are blocked by the backend before a request is created.',
      received: 'Request received',
      reference: 'Your booking reference is',
      pending: 'Status: Pending.',
      summary: 'Booking Summary',
      at: 'at',
      in: 'in',
      edit: 'Edit',
      submit: 'Submit Request'
    },
    fields: {
      preferredDate: 'Preferred date',
      preferredTime: 'Preferred time',
      location: 'Location',
      duration: 'Duration',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      instagram: 'Instagram',
      password: 'Password'
    },
    portal: {
      eyebrow: 'Client Dashboard',
      title: 'Private Booking Page',
      placeholder: 'Booking reference',
      open: 'Open',
      payment: 'Payment',
      delivery: 'Delivery',
      notes: 'Notes',
      gallery: 'Open Gallery'
    },
    time: { at: 'at' },
    about: {
      eyebrow: 'About Hamza',
      title: "Director's Eye, Editor's Discipline",
      body: 'Hamza Elbahi is the Rabat-based photographer, videographer, and video editor behind ALBATROS, shaping weddings, commercial campaigns, portraits, live events, and social launches with a cinematic eye.',
      bullets: ['Specialties: cinematic weddings, branded reels, portraits, live events', 'Equipment: full-frame cinema cameras, gimbals, drones, studio lighting, calibrated edit suite', 'Philosophy: elegant images should feel honest before they feel perfect.']
    },
    testimonials: { eyebrow: 'Testimonials', title: 'Client Notes' },
    contact: { eyebrow: 'Contact', title: 'Start the Conversation' },
    footer: { line: 'Photo / Film / Communication', place: 'Rabat, Morocco - Visuals that move' },
    admin: {
      loginTitle: 'Admin Login',
      help: 'If the backend is online, this signs into the secure dashboard. If it is offline, it opens local draft mode for editing site content before deployment.',
      signIn: 'Sign In',
      offline: 'Backend offline. Start the secure API before signing in.',
      unavailable: 'Backend unavailable. Start the secure API and try again.',
      eyebrow: 'Admin Dashboard',
      title: 'Studio Operations',
      localMode: 'Local draft mode',
      logout: 'Logout',
      tabs: { overview: 'Overview', bookings: 'Bookings', services: 'Services', portfolio: 'Portfolio', testimonials: 'Testimonials', availability: 'Availability', settings: 'Settings' },
      stats: { totalBookings: 'Total bookings', pendingBookings: 'Pending bookings', confirmedBookings: 'Confirmed bookings', completedProjects: 'Completed projects', revenue: 'Revenue' },
      ideasTitle: 'Creative Ideas',
      ideasBody: 'Feature a monthly Visual Story on the homepage, mark unfinished categories as coming soon, and prepare Instagram-first project cards with one hero image, one vertical reel, and a short caption.',
      noBookings: 'No bookings yet.',
      confirm: 'Confirm',
      reject: 'Reject',
      add: 'Add',
      modify: 'Modify',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      saveFailed: 'Save failed. Check the fields and backend connection, then try again.',
      nothing: 'Nothing here yet.',
      editSettings: 'Edit Settings',
      mediaStudio: 'Media Publishing',
      mediaStudioBody: 'Upload photos or videos here, choose their exact project and category, then save. Published items feed the ALBATROS website and the shared H-portfolio data.',
      uploadCover: 'Upload Cover',
      addMedia: 'Add Photo / Video',
      mediaAlt: 'Caption / alt text',
      coverReady: 'Cover uploaded. Save the project to publish it.',
      mediaReady: 'Media added. Save the project to publish it.',
      localDraft: 'local draft',
      authSettings: 'Authentication Settings',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      changePassword: 'Change Password',
      passwordMismatch: 'New passwords do not match.',
      passwordChanged: 'Password changed successfully.',
      passwordBackendOnly: 'Password changes require the secure backend. Start the API and sign in again.'
    }
  },
  fr: {
    nav: { site: 'Site', client: 'Client', admin: 'Admin' },
    theme: { dark: 'Sombre', light: 'Clair', toDark: 'Passer au mode sombre', toLight: 'Passer au mode clair' },
    hero: {
      eyebrow: 'Studio creatif haut de gamme',
      work: 'Voir le portfolio',
      book: 'Reserver une seance'
    },
    intro: {
      eyebrow: 'Marque personnelle',
      title: 'Des images avec atmosphere. Des films avec rythme. Des montages premium.',
      body: 'ALBATROS cree des histoires visuelles pour les couples, artistes, fondateurs, lieux et marques qui recherchent de la texture, de la retenue et une vraie clarte emotionnelle.'
    },
    portfolio: {
      eyebrow: 'Portfolio',
      title: 'Projets selectionnes',
      emptyTitle: 'Bientot disponible',
      emptyBody: 'Cette categorie attend encore les visuels ALBATROS exacts. Envoyez les bonnes images et elles remplaceront ce contenu.'
    },
    services: {
      eyebrow: 'Services & Tarifs',
      title: 'Formules dynamiques',
      editedAssets: 'visuels retouches',
      bookPackage: 'Reserver cette formule'
    },
    booking: {
      eyebrow: 'Systeme de reservation',
      title: 'Demander une seance',
      service: 'Service',
      package: 'Formule',
      message: 'Message complementaire',
      review: 'Verifier la reservation',
      note: 'Les dates indisponibles et les demandes deja en attente ou confirmees sont bloquees par le backend avant la creation de la demande.',
      received: 'Demande recue',
      reference: 'Votre reference de reservation est',
      pending: 'Statut : en attente.',
      summary: 'Recapitulatif de reservation',
      at: 'a',
      in: 'a',
      edit: 'Modifier',
      submit: 'Envoyer la demande'
    },
    fields: {
      preferredDate: 'Date souhaitee',
      preferredTime: 'Heure souhaitee',
      location: 'Lieu',
      duration: 'Duree',
      name: 'Nom',
      phone: 'Telephone',
      email: 'Email',
      instagram: 'Instagram',
      password: 'Mot de passe'
    },
    portal: {
      eyebrow: 'Espace client',
      title: 'Page privee de reservation',
      placeholder: 'Reference de reservation',
      open: 'Ouvrir',
      payment: 'Paiement',
      delivery: 'Livraison',
      notes: 'Notes',
      gallery: 'Ouvrir la galerie'
    },
    time: { at: 'a' },
    about: {
      eyebrow: 'A propos de Hamza',
      title: "Regard de realisateur, discipline d'editeur",
      body: 'Hamza Elbahi est le photographe, videaste et monteur base a Rabat derriere ALBATROS. Il donne forme aux mariages, campagnes commerciales, portraits, evenements live et lancements sociaux avec une approche cinematographique.',
      bullets: ['Specialites : mariages cinematographiques, reels de marque, portraits, evenements live', 'Materiel : cameras plein format, stabilisateurs, drones, eclairage studio, station de montage calibree', 'Philosophie : une image elegante doit sembler honnete avant de sembler parfaite.']
    },
    testimonials: { eyebrow: 'Temoignages', title: 'Avis clients' },
    contact: { eyebrow: 'Contact', title: 'Demarrer la conversation' },
    footer: { line: 'Photo / Film / Communication', place: 'Rabat, Maroc - Des visuels qui bougent' },
    admin: {
      loginTitle: 'Connexion admin',
      help: 'Si le backend est en ligne, la connexion ouvre le dashboard securise. S il est hors ligne, un mode brouillon local permet de modifier le contenu avant le deploiement.',
      signIn: 'Se connecter',
      offline: 'Backend hors ligne. Lancez l API securisee avant de vous connecter.',
      unavailable: 'Backend indisponible. Lancez l API securisee puis reessayez.',
      eyebrow: 'Dashboard admin',
      title: 'Operations du studio',
      localMode: 'Mode brouillon local',
      logout: 'Deconnexion',
      tabs: { overview: 'Vue globale', bookings: 'Reservations', services: 'Services', portfolio: 'Portfolio', testimonials: 'Temoignages', availability: 'Disponibilite', settings: 'Reglages' },
      stats: { totalBookings: 'Reservations totales', pendingBookings: 'En attente', confirmedBookings: 'Confirmees', completedProjects: 'Projets termines', revenue: 'Chiffre d affaires' },
      ideasTitle: 'Idees creatives',
      ideasBody: 'Mettre en avant chaque mois une Visual Story sur la page d accueil, marquer les categories non terminees comme bientot disponibles, et preparer des cartes Instagram avec une image hero, un reel vertical et une courte legende.',
      noBookings: 'Aucune reservation pour le moment.',
      confirm: 'Confirmer',
      reject: 'Refuser',
      add: 'Ajouter',
      modify: 'Modifier',
      delete: 'Supprimer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      saveFailed: 'Enregistrement impossible. Verifiez les champs et la connexion backend, puis reessayez.',
      nothing: 'Rien ici pour le moment.',
      editSettings: 'Modifier les reglages',
      mediaStudio: 'Publication media',
      mediaStudioBody: 'Ajoutez les photos ou videos ici, choisissez le bon projet et la bonne categorie, puis enregistrez. Les medias publies alimentent le site ALBATROS et les donnees partagees du H-portfolio.',
      uploadCover: 'Ajouter la couverture',
      addMedia: 'Ajouter photo / video',
      mediaAlt: 'Legende / texte alternatif',
      coverReady: 'Couverture ajoutee. Enregistrez le projet pour la publier.',
      mediaReady: 'Media ajoute. Enregistrez le projet pour le publier.',
      localDraft: 'brouillon local',
      authSettings: 'Reglages d authentification',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le nouveau mot de passe',
      changePassword: 'Changer le mot de passe',
      passwordMismatch: 'Les nouveaux mots de passe ne correspondent pas.',
      passwordChanged: 'Mot de passe modifie avec succes.',
      passwordBackendOnly: 'Le changement de mot de passe exige le backend securise. Lancez l API et reconnectez-vous.'
    }
  }
};

const fallbackSite = {
  brand: 'ALBATROS',
  role: 'Photographer - Videographer - Video Editor',
  tagline: 'Rabat-based cinematic stories for weddings, brands, artists, and unforgettable nights.',
  services: [],
  featuredProjects: [],
  testimonials: []
};

const settingsDefaults = {
  brand: 'ALBATROS',
  founder: 'Hamza Elbahi',
  email: EMAIL,
  phone: PHONE_DISPLAY,
  instagram: INSTAGRAM_URL,
  whatsapp: WHATSAPP_URL,
  location: 'Rabat, Morocco',
  tagline: fallbackSite.tagline
};

const localKey = (name) => `albatros_admin_${name}`;
const readLocal = (name, fallback) => JSON.parse(localStorage.getItem(localKey(name)) || 'null') || fallback;
const writeLocal = (name, value) => localStorage.setItem(localKey(name), JSON.stringify(value));

function makeOverview(data) {
  return {
    totalBookings: data.bookings.length,
    pendingBookings: data.bookings.filter((b) => b.status === 'PENDING').length,
    confirmedBookings: data.bookings.filter((b) => b.status === 'CONFIRMED').length,
    completedProjects: data.bookings.filter((b) => b.status === 'COMPLETED').length,
    revenue: data.bookings.filter((b) => b.paymentStatus === 'PAID').reduce((sum, b) => sum + Number(b.servicePackage?.price || 0), 0)
  };
}

function localAdminData() {
  const data = {
    bookings: readLocal('bookings', []),
    services: readLocal('services', demoServices),
    projects: readLocal('projects', demoProjects),
    clients: readLocal('clients', []),
    testimonials: readLocal('testimonials', demoTestimonials),
    availability: readLocal('availability', []),
    settings: readLocal('settings', settingsDefaults)
  };
  return { ...data, overview: makeOverview(data) };
}

function api(path, options = {}) {
  const token = localStorage.getItem('lenscraft_token');
  const isFormData = options.body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.status === 204 ? null : response.json();
  });
}

function App() {
  const [site, setSite] = useState(fallbackSite);
  const [view, setView] = useState('site');
  const [introDone, setIntroDone] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('albatros_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('albatros_lang') || 'en');

  useEffect(() => {
    api('/public/site').then(setSite).catch(() => setSite(fallbackSite));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('albatros_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('albatros_lang', lang);
  }, [lang]);

  const t = copy[lang];

  return (
    <>
      <AnimatePresence>{!introDone && <BrandIntro />}</AnimatePresence>
      <Header brand={site.brand} onView={setView} view={view} theme={theme} onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} lang={lang} onLangChange={() => setLang(lang === 'en' ? 'fr' : 'en')} t={t} />
      <AnimatePresence mode="wait">
        {view === 'site' && <PublicSite key="site" site={site} lang={lang} t={t} />}
        {view === 'client' && <ClientPortal key="client" t={t} />}
        {view === 'admin' && <AdminDashboard key="admin" t={t} lang={lang} />}
      </AnimatePresence>
      <FloatingButtons />
    </>
  );
}

function BrandIntro() {
  return (
    <motion.div className="brand-intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
      <motion.img src="/assets/albatros-opening.jpeg" alt="ALBATROS cinematic opening visual" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} />
    </motion.div>
  );
}

function Header({ brand, onView, view, theme, onThemeChange, lang, onLangChange, t }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onView('site')} aria-label="Open home">
        <img className="dark-logo" src="/assets/albatros-logo.png" alt={brand} />
        <img className="light-logo" src="/assets/albatros-logo-light.png" alt={brand} />
      </button>
      <nav>
        {['site', 'client', 'admin'].map((item) => (
          <button key={item} className={view === item ? 'active' : ''} onClick={() => onView(item)}>
            {t.nav[item]}
          </button>
        ))}
      </nav>
      <div className="topbar-controls">
        <button className="language-toggle" type="button" onClick={onLangChange} aria-label={lang === 'en' ? 'Passer en francais' : 'Switch to English'}>
          {lang === 'en' ? 'FR' : 'EN'}
        </button>
        <button className="theme-toggle" type="button" onClick={onThemeChange} aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

function PublicSite({ site, lang, t }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [bookingService, setBookingService] = useState(null);
  const projects = site.featuredProjects?.length ? site.featuredProjects : demoProjects;
  const services = site.services?.length ? site.services : demoServices;
  const shownProjects = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="hero" id="home">
        <div className="hero-media" />
        <div className="hero-content">
          <p className="eyebrow"><Sparkles size={16} /> {t.hero.eyebrow}</p>
          <img className="brand-name-logo dark-logo" src="/assets/albatros-logo.png" alt={site.brand} />
          <img className="brand-name-logo light-logo" src="/assets/albatros-logo-light.png" alt={site.brand} />
          <p className="role">{lang === 'fr' ? 'Photographe - Videaste - Monteur video' : site.role}</p>
          <p className="tagline">{lang === 'fr' ? 'Des histoires cinematographiques basees a Rabat pour mariages, marques, artistes et soirees inoubliables.' : site.tagline}</p>
          <div className="actions">
            <a href="#portfolio" className="btn primary"><Play size={18} /> {t.hero.work}</a>
            <a href="#booking" className="btn ghost"><Calendar size={18} /> {t.hero.book}</a>
          </div>
        </div>
      </section>

      <section className="intro section">
        <div>
          <p className="eyebrow">{t.intro.eyebrow}</p>
          <h2>{t.intro.title}</h2>
        </div>
        <p>{t.intro.body}</p>
      </section>

      <section className="section" id="portfolio">
        <SectionTitle eyebrow={t.portfolio.eyebrow} title={t.portfolio.title} />
        <div className="filters" role="tablist">
          {categories.map((cat) => <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{categoryLabels[lang][cat]}</button>)}
        </div>
        <div className="project-grid">
          {shownProjects.map((project) => <ProjectCard key={project.id || project.title} project={project} lang={lang} />)}
        </div>
        {shownProjects.length === 0 && <div className="empty-category"><h3>{t.portfolio.emptyTitle}</h3><p>{t.portfolio.emptyBody}</p></div>}
      </section>

      <section className="section" id="services">
        <SectionTitle eyebrow={t.services.eyebrow} title={t.services.title} />
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id || service.name}>
              <div className="service-icon"><Video /></div>
              <h3>{pick(service, 'name', lang)}</h3>
              <p>{pick(service, 'description', lang)}</p>
              {(service.packages || []).map((pack) => (
                <div className="package" key={pack.id || pack.name}>
                  <div><strong>{pick(pack, 'name', lang)}</strong><span>{pick(pack, 'duration', lang)} - {pack.editedAssets} {t.services.editedAssets}</span></div>
                  <b>{formatPrice(pack.price)}</b>
                  <small>{pick(pack, 'includes', lang)}</small>
                  <button className="btn compact" onClick={() => setBookingService({ service, pack })}>{t.services.bookPackage}</button>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <BookingSection services={services} preselect={bookingService} lang={lang} t={t} />
      <AboutSection t={t} />
      <Testimonials items={site.testimonials?.length ? site.testimonials : demoTestimonials} lang={lang} t={t} />
      <ContactSection t={t} />
      <Footer t={t} />
    </motion.main>
  );
}

function ProjectCard({ project, lang }) {
  return (
    <motion.article className="project-card" whileHover={{ y: -8 }}>
      <img src={mediaUrl(project.coverImageUrl)} alt={`${pick(project, 'title', lang)} cover`} loading="lazy" />
      <div>
        <span>{categoryLabels[lang][project.category] || project.category}</span>
        <h3>{pick(project, 'title', lang)}</h3>
        <p>{pick(project, 'description', lang)}</p>
        <small>{project.location} - {project.projectDate || 'Recent'}</small>
      </div>
    </motion.article>
  );
}

function BookingSection({ services, preselect, lang, t }) {
  const [form, setForm] = useState({ serviceId: '', packageId: '', preferredDate: '', preferredTime: '', location: '', duration: '', name: '', phone: '', email: '', instagram: '', message: '' });
  const [summary, setSummary] = useState(false);
  const [result, setResult] = useState(null);
  const selectedService = services.find((s) => String(s.id) === String(form.serviceId));
  const selectedPackage = selectedService?.packages?.find((p) => String(p.id) === String(form.packageId));

  useEffect(() => {
    if (preselect) setForm((f) => ({ ...f, serviceId: preselect.service.id, packageId: preselect.pack.id, duration: preselect.pack.duration }));
  }, [preselect]);

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value, ...(name === 'serviceId' ? { packageId: '' } : {}) }));
  }

  async function submit() {
    const booking = await api('/bookings', { method: 'POST', body: JSON.stringify(form) });
    setResult(booking);
    setSummary(false);
  }

  return (
    <section className="section booking" id="booking">
      <SectionTitle eyebrow={t.booking.eyebrow} title={t.booking.title} />
      {result ? (
        <div className="confirmation"><Check /><h3>{t.booking.received}</h3><p>{t.booking.reference} <strong>{result.reference}</strong>. {t.booking.pending}</p></div>
      ) : (
        <div className="booking-layout">
          <form className="booking-form" onSubmit={(e) => { e.preventDefault(); setSummary(true); }}>
            <Select label={t.booking.service} placeholder={`${lang === 'fr' ? 'Choisir' : 'Select'} ${t.booking.service}`} value={form.serviceId} onChange={(v) => update('serviceId', v)} options={services.map((s) => [s.id, pick(s, 'name', lang)])} />
            <Select label={t.booking.package} placeholder={`${lang === 'fr' ? 'Choisir' : 'Select'} ${t.booking.package}`} value={form.packageId} onChange={(v) => { update('packageId', v); const pack = selectedService?.packages?.find((p) => String(p.id) === String(v)); if (pack) update('duration', pick(pack, 'duration', lang)); }} options={(selectedService?.packages || []).map((p) => [p.id, `${pick(p, 'name', lang)} - ${formatPrice(p.price)}`])} />
            {['preferredDate', 'preferredTime', 'location', 'duration', 'name', 'phone', 'email', 'instagram'].map((name) => <Field key={name} name={name} label={t.fields[name]} value={form[name]} onChange={update} />)}
            <label className="field wide"><span>{t.booking.message}</span><textarea value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
            <button className="btn primary wide" type="submit"><Calendar size={18} /> {t.booking.review}</button>
          </form>
          <div className="booking-note"><Clock /><p>{t.booking.note}</p></div>
        </div>
      )}
      {summary && <Summary form={form} service={selectedService} pack={selectedPackage} lang={lang} t={t} onCancel={() => setSummary(false)} onConfirm={submit} />}
    </section>
  );
}

function Summary({ form, service, pack, lang, t, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{t.booking.summary}</h3>
        <p>{pick(service, 'name', lang)} / {pick(pack, 'name', lang)}</p>
        <p>{form.preferredDate} {t.booking.at} {form.preferredTime} {t.booking.in} {form.location}</p>
        <p>{form.name} - {form.phone} - {form.email}</p>
        <div className="actions"><button className="btn ghost" onClick={onCancel}>{t.booking.edit}</button><button className="btn primary" onClick={onConfirm}>{t.booking.submit}</button></div>
      </div>
    </div>
  );
}

function ClientPortal({ t }) {
  const [reference, setReference] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  async function lookup(e) {
    e.preventDefault();
    setError('');
    api(`/client/bookings/${reference}`).then(setBooking).catch((err) => setError(err.message));
  }
  return (
    <main className="panel-page">
      <section className="portal-panel">
        <SectionTitle eyebrow={t.portal.eyebrow} title={t.portal.title} />
        <form className="inline-form" onSubmit={lookup}><input placeholder={t.portal.placeholder} value={reference} onChange={(e) => setReference(e.target.value)} /><button className="btn primary">{t.portal.open}</button></form>
        {error && <p className="error">{error}</p>}
        {booking && <StatusCard booking={booking} t={t} />}
      </section>
    </main>
  );
}

function AdminDashboard({ t, lang }) {
  const [token, setToken] = useState(() => localStorage.getItem('lenscraft_token'));
  const [login, setLogin] = useState({ email: EMAIL, password: '' });
  const [mode, setMode] = useState('api');
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
  const [uploadingField, setUploadingField] = useState('');
  const [mediaAltText, setMediaAltText] = useState('');
  const [passwordDraft, setPasswordDraft] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [data, setData] = useState(() => localAdminData());
  const [error, setError] = useState('');

  useEffect(() => { if (token) refresh(); }, [token]);

  async function signIn(e) {
    e.preventDefault();
    try {
      const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(login) });
      localStorage.setItem('lenscraft_token', result.token);
      localStorage.setItem('albatros_admin_mode', 'api');
      setMode('api');
      setToken(result.token);
      setError('');
    } catch (err) {
      localStorage.removeItem('lenscraft_token');
      localStorage.removeItem('albatros_admin_mode');
      setToken(null);
      setError(err.message || t.admin.unavailable);
    }
  }

  async function refresh() {
    try {
      const paths = ['/admin/overview', '/admin/bookings', '/admin/services', '/admin/portfolio', '/admin/clients', '/admin/testimonials', '/admin/availability'];
      const [overview, bookings, services, projects, clients, testimonials, availability] = await Promise.all(paths.map((p) => api(p)));
      setData({ overview, bookings, services, projects, clients, testimonials, availability, settings: readLocal('settings', settingsDefaults) });
      setError('');
    } catch (err) {
      setError(t.admin.unavailable);
    }
  }

  async function updateBooking(id, status) {
    if (mode === 'local') {
      const bookings = data.bookings.map((b) => b.id === id ? { ...b, status } : b);
      saveLocal('bookings', bookings);
      return;
    }
    await api(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    refresh();
  }

  function saveLocal(name, value) {
    writeLocal(name, value);
    const next = localAdminData();
    setData(next);
  }

  function startCreate(type) {
    const defaults = {
      services: { name: '', description: '', active: true, packages: [] },
      projects: { title: '', category: 'Photography', description: '', location: 'Rabat', projectDate: new Date().toISOString().slice(0, 10), coverImageUrl: '/assets/albatros-opening.jpeg', featured: true, media: [] },
      testimonials: { clientName: '', review: '', projectOrService: '', photoUrl: '', featured: true },
      availability: { date: '', startTime: '', endTime: '', reason: '', blocked: true },
      settings: data.settings
    };
    setEditing({ type, id: null });
    setDraft(defaults[type]);
  }

  function startEdit(type, item) {
    setEditing({ type, id: item.id || 'settings' });
    setDraft({ ...item });
  }

  async function saveDraft(type) {
    if (type === 'settings') {
      saveLocal('settings', draft);
      setEditing(null);
      return;
    }

    if (mode === 'api') {
      const endpoints = { services: '/admin/services', projects: '/admin/portfolio', testimonials: '/admin/testimonials', availability: '/admin/availability' };
      try {
        await api(endpoints[type], { method: 'POST', body: JSON.stringify(type === 'projects' ? normalizeProjectDraft(draft) : draft) });
        setEditing(null);
        refresh();
      } catch (err) {
        setError(err.message || t.admin.saveFailed);
      }
      return;
    }

    const collection = data[type] || [];
    const item = draft.id ? draft : { ...draft, id: Date.now() };
    const next = draft.id ? collection.map((existing) => existing.id === draft.id ? item : existing) : [item, ...collection];
    saveLocal(type, next);
    setEditing(null);
  }

  function normalizeProjectDraft(project) {
    const media = (project.media || []).map((item, index) => ({
      ...(item.id ? { id: item.id } : {}),
      type: item.type,
      url: item.url,
      altText: item.altText || '',
      sortOrder: item.sortOrder ?? index
    }));
    const projectDate = /^\d{4}$/.test(String(project.projectDate || ''))
      ? `${project.projectDate}-01-01`
      : project.projectDate || new Date().toISOString().slice(0, 10);
    return { ...project, projectDate, media };
  }

  async function uploadProjectFile(file, target) {
    if (!file) return;
    setError('');
    setUploadingField(target);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await api('/admin/files', { method: 'POST', body: formData });
      if (target === 'cover') {
        setDraft((current) => ({ ...current, coverImageUrl: result.url }));
        setError(t.admin.coverReady);
      } else {
        const type = file.type?.startsWith('video/') ? 'VIDEO' : 'IMAGE';
        setDraft((current) => ({
          ...current,
          media: [...(current.media || []), { type, url: result.url, altText: mediaAltText || current.title || 'ALBATROS project media', sortOrder: current.media?.length || 0 }]
        }));
        setMediaAltText('');
        setError(t.admin.mediaReady);
      }
    } catch (err) {
      setError(err.message || t.admin.unavailable);
    } finally {
      setUploadingField('');
    }
  }

  async function deleteItem(type, id) {
    if (mode === 'api') {
      const endpoints = { services: '/admin/services', projects: '/admin/portfolio', testimonials: '/admin/testimonials', availability: '/admin/availability' };
      await api(`${endpoints[type]}/${id}`, { method: 'DELETE' });
      refresh();
      return;
    }
    saveLocal(type, data[type].filter((item) => item.id !== id));
  }

  function logout() {
    localStorage.removeItem('lenscraft_token');
    localStorage.removeItem('albatros_admin_mode');
    setToken(null);
    setMode('api');
    setEditing(null);
  }

  async function changePassword(e) {
    e.preventDefault();
    setPasswordMessage('');
    setError('');
    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      setError(t.admin.passwordMismatch);
      return;
    }
    if (mode !== 'api') {
      setError(t.admin.passwordBackendOnly);
      return;
    }
    try {
      await api('/admin/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordDraft.currentPassword,
          newPassword: passwordDraft.newPassword
        })
      });
      setPasswordDraft({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage(t.admin.passwordChanged);
    } catch (err) {
      setError(err.message || t.admin.unavailable);
    }
  }

  if (!token) {
    return <main className="panel-page"><form className="login-panel" onSubmit={signIn}><img className="auth-logo dark-logo" src="/assets/albatros-logo.png" alt="ALBATROS" /><img className="auth-logo light-logo" src="/assets/albatros-logo-light.png" alt="ALBATROS" /><Lock /><h2>{t.admin.loginTitle}</h2><p className="admin-help">{t.admin.help}</p><Field name="email" label={t.fields.email} value={login.email} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><Field name="password" label={t.fields.password} value={login.password} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><button className="btn primary">{t.admin.signIn}</button>{error && <p className="error">{error}</p>}</form></main>;
  }

  return (
    <main className="admin-shell">
      <div className="admin-head">
        <SectionTitle eyebrow={t.admin.eyebrow} title={t.admin.title} />
        <div className="admin-actions">
          {mode === 'local' && <span className="mode-pill"><WifiOff size={15} /> {t.admin.localMode}</span>}
          <button className="btn ghost" onClick={logout}>{t.admin.logout}</button>
        </div>
      </div>
      {error && <p className="admin-alert">{error}</p>}
      <div className="admin-tabs">
        {['overview', 'bookings', 'services', 'portfolio', 'testimonials', 'availability', 'settings'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => { setActiveTab(tab); setEditing(null); }}>{t.admin.tabs[tab]}</button>)}
      </div>

      {activeTab === 'overview' && <>
        <div className="stats">{Object.entries(data.overview).map(([k, v]) => <div key={k}><span>{t.admin.stats[k] || k.replace(/([A-Z])/g, ' $1')}</span><strong>{k === 'revenue' ? formatPrice(v) : String(v)}</strong></div>)}</div>
        <section className="creative-board">
          <h3>{t.admin.ideasTitle}</h3>
          <p>{t.admin.ideasBody}</p>
        </section>
      </>}

      {activeTab === 'bookings' && <AdminBlock title={t.admin.tabs.bookings}>
        {data.bookings.length === 0 && <p className="admin-empty">{t.admin.noBookings}</p>}
        {data.bookings.map((b) => <div className="row" key={b.id}><span>{b.reference}<small>{b.client?.name} - {b.preferredDate} {b.preferredTime}</small></span><StatusBadge status={b.status} /><button onClick={() => updateBooking(b.id, 'CONFIRMED')}>{t.admin.confirm}</button><button onClick={() => updateBooking(b.id, 'REJECTED')}>{t.admin.reject}</button></div>)}
      </AdminBlock>}

      {activeTab === 'services' && <EditableCollection title={t.services.eyebrow} type="services" items={data.services} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} renderMeta={(item) => `${item.packages?.length || 0} packages`} t={t} lang={lang} />}
      {activeTab === 'portfolio' && <EditableCollection title="Portfolio Posts" type="projects" items={data.projects} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} renderMeta={(item) => `${categoryLabels[lang][item.category] || item.category} - ${item.location}`} t={t} lang={lang} />}
      {activeTab === 'testimonials' && <EditableCollection title={t.admin.tabs.testimonials} type="testimonials" items={data.testimonials} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} renderMeta={(item) => item.projectOrService} t={t} lang={lang} />}
      {activeTab === 'availability' && <EditableCollection title={t.admin.tabs.availability} type="availability" items={data.availability} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} renderMeta={(item) => `${item.startTime || 'Full day'} - ${item.endTime || 'blocked'}`} t={t} lang={lang} />}
      {activeTab === 'settings' && <AdminBlock title={t.admin.tabs.settings}>
        <button className="btn primary admin-add" onClick={() => startEdit('settings', data.settings)}><Pencil size={17} /> {t.admin.editSettings}</button>
        <div className="settings-list">{Object.entries(data.settings).map(([key, value]) => <p key={key}><strong>{key}</strong><span>{String(value)}</span></p>)}</div>
        <form className="password-panel" onSubmit={changePassword}>
          <h4>{t.admin.authSettings}</h4>
          <label className="field"><span>{t.admin.currentPassword}</span><input type="password" autoComplete="current-password" value={passwordDraft.currentPassword} onChange={(e) => setPasswordDraft({ ...passwordDraft, currentPassword: e.target.value })} required /></label>
          <label className="field"><span>{t.admin.newPassword}</span><input type="password" autoComplete="new-password" minLength="12" value={passwordDraft.newPassword} onChange={(e) => setPasswordDraft({ ...passwordDraft, newPassword: e.target.value })} required /></label>
          <label className="field"><span>{t.admin.confirmPassword}</span><input type="password" autoComplete="new-password" minLength="12" value={passwordDraft.confirmPassword} onChange={(e) => setPasswordDraft({ ...passwordDraft, confirmPassword: e.target.value })} required /></label>
          <button className="btn primary" type="submit"><Lock size={17} /> {t.admin.changePassword}</button>
          {passwordMessage && <p className="success">{passwordMessage}</p>}
        </form>
      </AdminBlock>}

      {editing && <EditorModal type={editing.type} draft={draft} setDraft={setDraft} onClose={() => setEditing(null)} onSave={() => saveDraft(editing.type)} onUpload={uploadProjectFile} uploadingField={uploadingField} mediaAltText={mediaAltText} setMediaAltText={setMediaAltText} t={t} lang={lang} />}
    </main>
  );
}

function EditableCollection({ title, type, items, onCreate, onEdit, onDelete, renderMeta, t, lang }) {
  return (
    <AdminBlock title={title}>
      <button className="btn primary admin-add" onClick={() => onCreate(type)}><Plus size={17} /> {t.admin.add}</button>
      {items.length === 0 && <p className="admin-empty">{t.admin.nothing}</p>}
      {items.map((item) => <div className="row editable-row" key={item.id || item.title || item.name || item.clientName}><span>{pick(item, 'name', lang) || pick(item, 'title', lang) || item.clientName || item.date}<small>{renderMeta(item)}</small></span><button onClick={() => onEdit(type, item)}><Pencil size={15} /> {t.admin.modify}</button><button onClick={() => onDelete(type, item.id)}><Trash2 size={15} /> {t.admin.delete}</button></div>)}
    </AdminBlock>
  );
}

function EditorModal({ type, draft, setDraft, onClose, onSave, onUpload, uploadingField, mediaAltText, setMediaAltText, t, lang }) {
  const fieldsByType = {
    services: ['name', 'nameFr', 'description', 'descriptionFr'],
    projects: ['title', 'titleFr', 'category', 'description', 'descriptionFr', 'location', 'projectDate', 'coverImageUrl'],
    testimonials: ['clientName', 'projectOrService', 'review', 'photoUrl'],
    availability: ['date', 'startTime', 'endTime', 'reason'],
    settings: ['brand', 'founder', 'email', 'phone', 'instagram', 'whatsapp', 'location', 'tagline']
  };
  return (
    <div className="modal-backdrop">
      <div className="modal editor-modal">
        <h3>{draft.id ? t.admin.modify : t.admin.add} {t.admin.tabs[type] || type}</h3>
        <div className="editor-grid">
          {fieldsByType[type].map((field) => (
            <label className={['description', 'descriptionFr', 'review', 'tagline'].includes(field) ? 'field wide' : 'field'} key={field}>
              <span>{field.replace(/([A-Z])/g, ' $1')}</span>
              {['description', 'descriptionFr', 'review', 'tagline'].includes(field)
                ? <textarea value={draft[field] || ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
                : field === 'category'
                  ? <select value={draft[field] || 'Photography'} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}>{categories.filter((c) => c !== 'All').map((category) => <option key={category} value={category}>{categoryLabels[lang][category]}</option>)}</select>
                  : <input type={field === 'projectDate' ? 'date' : 'text'} value={draft[field] || ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />}
            </label>
          ))}
        </div>
        {type === 'projects' && (
          <div className="media-publisher">
            <div className="media-publisher-copy">
              <Image size={18} />
              <div>
                <h4>{t.admin.mediaStudio}</h4>
                <p>{t.admin.mediaStudioBody}</p>
              </div>
            </div>
            {draft.coverImageUrl && (
              <figure className="cover-preview">
                <img src={mediaUrl(draft.coverImageUrl)} alt={draft.title || 'ALBATROS cover preview'} />
                <figcaption>{draft.coverImageUrl}</figcaption>
              </figure>
            )}
            <div className="upload-row">
              <label className="upload-button">
                <Upload size={17} />
                <span>{uploadingField === 'cover' ? '...' : t.admin.uploadCover}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onUpload(e.target.files?.[0], 'cover')} />
              </label>
              <label className="field media-alt">
                <span>{t.admin.mediaAlt}</span>
                <input value={mediaAltText} onChange={(e) => setMediaAltText(e.target.value)} />
              </label>
              <label className="upload-button">
                <Plus size={17} />
                <span>{uploadingField === 'media' ? '...' : t.admin.addMedia}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={(e) => onUpload(e.target.files?.[0], 'media')} />
              </label>
            </div>
            {(draft.media || []).length > 0 && (
              <div className="media-list">
                {draft.media.map((item, index) => (
                  <div className="media-item" key={`${item.url}-${index}`}>
                    {item.type === 'VIDEO'
                      ? <video src={mediaUrl(item.url)} muted playsInline controls />
                      : <img src={mediaUrl(item.url)} alt={item.altText || draft.title || 'ALBATROS media'} />}
                    <span>{item.altText || item.url}</span>
                    <button type="button" onClick={() => setDraft({ ...draft, media: draft.media.filter((_, i) => i !== index) })}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="actions"><button className="btn ghost" onClick={onClose}>{t.admin.cancel}</button><button className="btn primary" onClick={onSave}><Save size={17} /> {t.admin.save}</button></div>
      </div>
    </div>
  );
}

function AboutSection({ t }) {
  return <section className="section about"><figure className="about-portrait"><img src="/assets/hamza-portrait.jpeg" alt="Portrait of Hamza Elbahi" /><figcaption>Hamza Elbahi - ALBATROS</figcaption></figure><div><SectionTitle eyebrow={t.about.eyebrow} title={t.about.title} /><p>{t.about.body}</p><ul>{t.about.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div></section>;
}

function Testimonials({ items, lang, t }) {
  return <section className="section"><SectionTitle eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} /><div className="testimonial-grid">{items.map((item) => <blockquote key={item.id || item.clientName}><p>"{pick(item, 'review', lang)}"</p><cite>{item.clientName}<span>{pick(item, 'projectOrService', lang)}</span></cite></blockquote>)}</div></section>;
}

function ContactSection({ t }) {
  return <section className="section contact"><SectionTitle eyebrow={t.contact.eyebrow} title={t.contact.title} /><div className="contact-grid"><a href={WHATSAPP_URL}><MessageCircle /> WhatsApp</a><a href={INSTAGRAM_URL}><Instagram /> Instagram</a><a href={`mailto:${EMAIL}`}><Mail /> {EMAIL}</a><a href={`tel:${PHONE_TEL}`}><Phone /> {PHONE_DISPLAY}</a><span><MapPin /> Rabat, Morocco</span></div></section>;
}

function Footer({ t }) {
  return <footer className="site-footer"><img className="footer-logo dark-logo" src="/assets/albatros-logo.png" alt="ALBATROS" /><img className="footer-logo light-logo" src="/assets/albatros-logo-light.png" alt="ALBATROS" /><p>{t.footer.line}</p><span>{t.footer.place}</span></footer>;
}

function SectionTitle({ eyebrow, title }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function Field({ name, label, value, onChange }) {
  const type = name.includes('Date') ? 'date' : name.includes('Time') ? 'time' : name === 'email' ? 'email' : name === 'password' ? 'password' : 'text';
  return <label className="field"><span>{label || name.replace(/([A-Z])/g, ' $1')}</span><input required={!['instagram'].includes(name)} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} /></label>;
}

function Select({ label, placeholder, value, onChange, options }) {
  return <label className="field"><span>{label}</span><select required value={value} onChange={(e) => onChange(e.target.value)}><option value="">{placeholder || `Select ${label}`}</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
}

function StatusCard({ booking, t }) {
  return <div className="status-card"><StatusBadge status={booking.status} /><h3>{booking.reference}</h3><p>{booking.service?.name} / {booking.servicePackage?.name}</p><p>{booking.preferredDate} {t.time.at} {booking.preferredTime}</p><p>{booking.location}</p><p>{t.portal.payment}: {booking.paymentStatus} - {t.portal.delivery}: {booking.deliveryStatus}</p>{booking.photographerNotes && <p>{t.portal.notes}: {booking.photographerNotes}</p>}{booking.secureGalleryUrl && <a className="btn primary" href={booking.secureGalleryUrl}>{t.portal.gallery}</a>}</div>;
}

function StatusBadge({ status }) {
  return <b className={`status ${status?.toLowerCase()}`}>{status}</b>;
}

function AdminBlock({ title, children }) {
  return <section className="admin-block"><h3>{title}</h3>{children}</section>;
}

function FloatingButtons() {
  return <div className="floating"><a href={WHATSAPP_URL} aria-label="WhatsApp"><MessageCircle /></a><a href={INSTAGRAM_URL} aria-label="Instagram"><Instagram /></a></div>;
}

const demoServices = [
  { id: 1, name: 'Wedding Film & Photo', nameFr: 'Photo & Film de Mariage', description: 'Cinematic wedding storytelling with editorial portraits, candid moments, and a polished highlight film.', descriptionFr: 'Storytelling de mariage cinematographique avec portraits editoriaux, moments naturels et film highlight soigne.', packages: [
    { id: 1, name: 'Intimate Ceremony', nameFr: 'Ceremonie Intime', includes: 'Ceremony coverage, couple portraits, edited online gallery, 3-5 minute highlight film', includesFr: 'Couverture ceremonie, portraits couple, galerie en ligne retouchee, film highlight de 3 a 5 minutes', duration: '4 hours', durationFr: '4 heures', editedAssets: 180, price: 5000 },
    { id: 2, name: 'Signature Wedding', nameFr: 'Mariage Signature', includes: 'Full-day photo and video coverage, teaser reel, private gallery, 8-12 minute cinematic film', includesFr: 'Couverture photo et video journee complete, teaser reel, galerie privee, film cinematographique de 8 a 12 minutes', duration: '8 hours', durationFr: '8 heures', editedAssets: 450, price: 9500 },
    { id: 3, name: 'ALBATROS Premium', nameFr: 'ALBATROS Premium', includes: 'Full wedding story, two-camera coverage, drone when permitted, teaser, cinematic film, luxury delivery gallery', includesFr: 'Histoire complete du mariage, deux cameras, drone si autorise, teaser, film cinematographique, galerie de livraison premium', duration: '12 hours', durationFr: '12 heures', editedAssets: 700, price: 16000 }
  ] },
  { id: 2, name: 'Portrait Session', nameFr: 'Seance Portrait', description: 'Editorial portraits for personal brands, artists, creators, and professional profiles.', descriptionFr: 'Portraits editoriaux pour marques personnelles, artistes, createurs et profils professionnels.', packages: [
    { id: 4, name: 'Essential Portrait', nameFr: 'Portrait Essentiel', includes: 'One location, guided posing, color correction, retouched selects', includesFr: 'Un lieu, direction de pose, correction couleur, selections retouchees', duration: '1 hour', durationFr: '1 heure', editedAssets: 12, price: 700 },
    { id: 5, name: 'Editorial Portrait', nameFr: 'Portrait Editorial', includes: 'Two looks, creative direction, advanced retouching, social-ready crops', includesFr: 'Deux looks, direction creative, retouche avancee, formats prets pour les reseaux sociaux', duration: '2 hours', durationFr: '2 heures', editedAssets: 25, price: 1500 }
  ] },
  { id: 3, name: 'Events Coverage', nameFr: 'Couverture Evenements', description: 'Elegant photo and video coverage for private events, sport, performances, launches, and corporate moments.', descriptionFr: 'Couverture photo et video elegante pour evenements prives, sport, performances, lancements et moments corporate.', packages: [
    { id: 6, name: 'Event Photo', nameFr: 'Photo Evenement', includes: 'Event photography, curated gallery, color grading, fast online delivery', includesFr: 'Photographie evenementielle, galerie triee, colorimetrie, livraison rapide en ligne', duration: '3 hours', durationFr: '3 heures', editedAssets: 150, price: 2500 },
    { id: 7, name: 'Event Photo + Film', nameFr: 'Photo + Film Evenement', includes: 'Photo coverage, highlight video, vertical recap reel, private delivery link', includesFr: 'Couverture photo, video highlight, reel vertical recap, lien prive de livraison', duration: '4 hours', durationFr: '4 heures', editedAssets: 220, price: 5500 }
  ] },
  { id: 4, name: 'Social Content Studio', nameFr: 'Studio Contenu Social', description: 'High-impact photo and short-form video sessions built for Instagram, TikTok, launches, and personal brands.', descriptionFr: 'Sessions photo et videos courtes a fort impact pour Instagram, TikTok, lancements et marques personnelles.', packages: [
    { id: 8, name: 'Creator Half Day', nameFr: 'Demi-journee Createur', includes: 'Shot list planning, vertical video capture, 6 edited reels, 45 edited photos', includesFr: 'Preparation shot list, capture verticale, 6 reels montes, 45 photos retouchees', duration: '4 hours', durationFr: '4 heures', editedAssets: 51, price: 4500 },
    { id: 9, name: 'Launch Content Day', nameFr: 'Journee Lancement', includes: 'Campaign planning, product/lifestyle capture, 10 reels, 80 photos, delivery calendar', includesFr: 'Planning campagne, capture produit/lifestyle, 10 reels, 80 photos, calendrier de livraison', duration: '6 hours', durationFr: '6 heures', editedAssets: 90, price: 7500 }
  ] },
  { id: 5, name: 'Commercial Brand Visuals', nameFr: 'Visuels de Marque Commerciale', description: 'Premium photo, film, and visual communication packages for brands, venues, and campaigns.', descriptionFr: 'Formules premium photo, film et communication visuelle pour marques, lieux et campagnes.', packages: [
    { id: 10, name: 'Brand Starter', nameFr: 'Depart de Marque', includes: 'Creative direction, half-day shoot, edited brand gallery, one hero reel', includesFr: 'Direction creative, demi-journee de shooting, galerie de marque retouchee, un reel hero', duration: '5 hours', durationFr: '5 heures', editedAssets: 61, price: 6500 },
    { id: 11, name: 'Campaign Film + Photo', nameFr: 'Campagne Film + Photo', includes: 'Full-day production, photo library, campaign film, social cutdowns, usage-ready delivery', includesFr: 'Production journee complete, banque photo, film de campagne, formats sociaux, livraison prete a l usage', duration: '8 hours', durationFr: '8 heures', editedAssets: 110, price: 12000 }
  ] }
];
const demoProjects = [
  { title: 'Between Earth & Sky', titleFr: 'Entre Terre et Ciel', category: 'Photography', description: 'Open horizons, last light, and night skies with a cinematic sense of scale.', descriptionFr: 'Horizons ouverts, derniere lumiere et ciels nocturnes avec une echelle cinematographique.', location: 'Rabat / Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-quiet-horizon.jpeg' },
  { title: 'Traditional Vows', titleFr: 'Promesses Traditionnelles', category: 'Weddings', description: 'Moroccan wedding portraits with ceremonial elegance, color, and intimate couple direction.', descriptionFr: 'Portraits de mariage marocain avec elegance ceremonielle, couleur et direction intime du couple.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/wedding-traditional-couple-1.jpg' },
  { title: 'Ceremony in Gold', titleFr: 'Ceremonie en Or', category: 'Weddings', description: 'A refined couple story shaped around traditional dress, gestures, and editorial light.', descriptionFr: 'Une histoire de couple raffinee autour de la tenue traditionnelle, des gestes et de la lumiere editoriale.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/wedding-traditional-couple-2.jpg' },
  { title: 'Cosmic Frames', titleFr: 'Cadres Cosmiques', category: 'Photography', description: 'Moon textures, distant light, and quiet celestial compositions.', descriptionFr: 'Textures lunaires, lumiere lointaine et compositions celestes calmes.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-lunar-texture.jpeg' },
  { title: 'Cosmic Abstraction', titleFr: 'Abstraction Cosmique', category: 'Video Editing', description: 'A short abstract motion piece shaped for atmosphere, rhythm, and screen impact.', descriptionFr: 'Une courte piece abstraite en mouvement travaillee pour l atmosphere, le rythme et l impact ecran.', location: 'Studio Edit', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-distant-light.jpeg', videoUrl: '/assets/portfolio-clean/videography-cosmic-abstraction.mp4' },
  { title: 'Celebration Pulse', titleFr: 'Pulse de Celebration', category: 'Events', description: 'Traditional celebration coverage focused on movement, expression, and social energy.', descriptionFr: 'Couverture de celebration traditionnelle axee sur le mouvement, l expression et l energie sociale.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/events-traditional-moment.jpg' },
  { title: 'Gathered Stories', titleFr: 'Histoires Rassemblees', category: 'Events', description: 'Guest moments and ceremonial atmosphere captured with clarity and discretion.', descriptionFr: 'Moments d invites et atmosphere ceremonielle captes avec clarte et discretion.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/events-traditional-guests.jpg' },
  { title: 'Motion in Silence', titleFr: 'Mouvement en Silence', category: 'Events', description: 'Live movement, performance, sport, and field moments captured with energy and restraint.', descriptionFr: 'Mouvement live, performance, sport et moments de terrain captures avec energie et retenue.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/events-fire-performance.jpg' },
  { title: 'Stillness Portraits', titleFr: 'Portraits de Silence', category: 'Portraits', description: 'Minimal portrait work built around expression, shadow, and presence.', descriptionFr: 'Portraits minimalistes construits autour de l expression, de l ombre et de la presence.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-stillness.jpg' },
  { title: 'Traditional Queen', titleFr: 'Reine Traditionnelle', category: 'Portraits', description: 'A strong Moroccan portrait with ceremonial styling and a quiet cinematic gaze.', descriptionFr: 'Un portrait marocain fort avec styling ceremoniel et regard cinematographique calme.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-traditional-queen.jpg' },
  { title: 'Gold Detail Portrait', titleFr: 'Portrait Detail Or', category: 'Portraits', description: 'Close portrait work highlighting texture, jewelry, and controlled editorial framing.', descriptionFr: 'Portrait rapproche mettant en valeur la texture, les bijoux et un cadrage editorial maitrise.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-traditional-gold.jpg' },
  { title: 'Black Fabric Study', titleFr: 'Etude en Tissu Noir', category: 'Portraits', description: 'A moody portrait study using fabric, expression, and sculpted contrast.', descriptionFr: 'Une etude portrait sombre avec tissu, expression et contraste sculpte.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-traditional-black.jpg' },
  { title: 'Find the Light', titleFr: 'Trouver la Lumiere', category: 'Portraits', description: 'A stylized portrait study balancing mystery, contrast, and soft light.', descriptionFr: 'Une etude portrait stylisee entre mystere, contraste et lumiere douce.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-find-the-light.jpg' },
  { title: 'ALBATROS Brand System', titleFr: 'Systeme de Marque ALBATROS', category: 'Commercial', description: 'Brand imagery and visual direction for a premium photo, film, and communication identity.', descriptionFr: 'Images de marque et direction visuelle pour une identite premium photo, film et communication.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/commercial-albatros-brand-system.jpeg' },
  { title: 'Traditional Detail', titleFr: 'Detail Traditionnel', category: 'Commercial', description: 'Detail-focused visual material for cultural styling, craft, and brand storytelling.', descriptionFr: 'Matiere visuelle axee sur le detail pour le styling culturel, l artisanat et le storytelling de marque.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/commercial-traditional-detail.jpg' },
  { title: 'Visuals That Move', titleFr: 'Des Visuels Qui Bougent', category: 'Social Media Content', description: 'Cinematic brand visuals prepared for high-impact Instagram presentation.', descriptionFr: 'Visuels de marque cinematographiques prepares pour une presentation Instagram impactante.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/hamza-albatros.jpeg' },
  { title: 'Reel Cover Energy', titleFr: 'Energie Cover Reel', category: 'Social Media Content', description: 'A social-first frame prepared for carousel covers, reels, and campaign announcements.', descriptionFr: 'Une image pensee pour les reseaux sociaux, couvertures de reels, carrousels et annonces de campagne.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/social-traditional-reel-cover.jpg' },
  { title: 'Cosmic Motion', titleFr: 'Mouvement Cosmique', category: 'Videography', description: 'Atmospheric moving image work for poetic, visual-first storytelling.', descriptionFr: 'Image en mouvement atmospherique pour un storytelling poetique et visuel.', location: 'Studio Edit', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-under-stars.jpg', videoUrl: '/assets/portfolio-clean/videography-cosmic-abstraction.mp4' }
];
const demoTestimonials = [{ clientName: 'Maya R.', projectOrService: 'Wedding Film', projectOrServiceFr: 'Film de mariage', review: 'The final film felt like memory, not just coverage. Every detail was intentional.', reviewFr: 'Le film final ressemblait a un souvenir vivant, pas seulement a une couverture. Chaque detail etait intentionnel.' }];

createRoot(document.getElementById('root')).render(<App />);
