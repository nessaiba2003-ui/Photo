import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Check, Clock, Instagram, Lock, Mail, MapPin, MessageCircle, Moon, Pencil, Phone, Play, Plus, Save, Sparkles, Sun, Trash2, Video, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/app.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const INSTAGRAM_URL = 'https://www.instagram.com/orion.polaris';
const WHATSAPP_URL = 'https://wa.me/212772604428';
const PHONE_DISPLAY = '+212 772 604 428';
const PHONE_TEL = '+212772604428';
const EMAIL = 'hamzaelbahi.orion@gmail.com';
const categories = ['All', 'Photography', 'Videography', 'Video Editing', 'Weddings', 'Events', 'Portraits', 'Commercial', 'Social Media Content'];
const formatPrice = (price) => `${Number(price).toLocaleString('fr-MA')} DH`;

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
  return fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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

  return (
    <>
      <AnimatePresence>{!introDone && <BrandIntro />}</AnimatePresence>
      <Header brand={site.brand} onView={setView} view={view} theme={theme} onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <AnimatePresence mode="wait">
        {view === 'site' && <PublicSite key="site" site={site} />}
        {view === 'client' && <ClientPortal key="client" />}
        {view === 'admin' && <AdminDashboard key="admin" />}
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

function Header({ brand, onView, view, theme, onThemeChange }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onView('site')} aria-label="Open home">
        <img className="dark-logo" src="/assets/albatros-logo.png" alt={brand} />
        <img className="light-logo" src="/assets/albatros-logo-light.png" alt={brand} />
      </button>
      <nav>
        {['site', 'client', 'admin'].map((item) => (
          <button key={item} className={view === item ? 'active' : ''} onClick={() => onView(item)}>
            {item === 'site' ? 'Website' : item === 'client' ? 'Client' : 'Admin'}
          </button>
        ))}
      </nav>
      <button className="theme-toggle" type="button" onClick={onThemeChange} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

function PublicSite({ site }) {
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
          <p className="eyebrow"><Sparkles size={16} /> High-end creative studio</p>
          <img className="brand-name-logo dark-logo" src="/assets/albatros-logo.png" alt={site.brand} />
          <img className="brand-name-logo light-logo" src="/assets/albatros-logo-light.png" alt={site.brand} />
          <p className="role">{site.role}</p>
          <p className="tagline">{site.tagline}</p>
          <div className="actions">
            <a href="#portfolio" className="btn primary"><Play size={18} /> View My Work</a>
            <a href="#booking" className="btn ghost"><Calendar size={18} /> Book a Session</a>
          </div>
        </div>
      </section>

      <section className="intro section">
        <div>
          <p className="eyebrow">Personal Brand</p>
          <h2>Frames with atmosphere. Films with pulse. Edits that feel expensive.</h2>
        </div>
        <p>ALBATROS builds visual stories for couples, artists, founders, venues, and brands that need work with texture, restraint, and emotional clarity.</p>
      </section>

      <section className="section" id="portfolio">
        <SectionTitle eyebrow="Portfolio" title="Featured Projects" />
        <div className="filters" role="tablist">
          {categories.map((cat) => <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>)}
        </div>
        <div className="project-grid">
          {shownProjects.map((project) => <ProjectCard key={project.id || project.title} project={project} />)}
        </div>
        {shownProjects.length === 0 && <div className="empty-category"><h3>Coming soon</h3><p>This category is waiting for the exact ALBATROS visuals. Send the right set and it will replace this placeholder.</p></div>}
      </section>

      <section className="section" id="services">
        <SectionTitle eyebrow="Services & Pricing" title="Dynamic Packages" />
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id || service.name}>
              <div className="service-icon"><Video /></div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              {(service.packages || []).map((pack) => (
                <div className="package" key={pack.id || pack.name}>
                  <div><strong>{pack.name}</strong><span>{pack.duration} - {pack.editedAssets} edited assets</span></div>
                  <b>{formatPrice(pack.price)}</b>
                  <small>{pack.includes}</small>
                  <button className="btn compact" onClick={() => setBookingService({ service, pack })}>Book This Package</button>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <BookingSection services={services} preselect={bookingService} />
      <AboutSection />
      <Testimonials items={site.testimonials?.length ? site.testimonials : demoTestimonials} />
      <ContactSection />
      <Footer />
    </motion.main>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.article className="project-card" whileHover={{ y: -8 }}>
      <img src={project.coverImageUrl} alt={`${project.title} cover`} loading="lazy" />
      <div>
        <span>{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <small>{project.location} - {project.projectDate || 'Recent'}</small>
      </div>
    </motion.article>
  );
}

function BookingSection({ services, preselect }) {
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
      <SectionTitle eyebrow="Booking System" title="Request a Session" />
      {result ? (
        <div className="confirmation"><Check /><h3>Request received</h3><p>Your booking reference is <strong>{result.reference}</strong>. Status: Pending.</p></div>
      ) : (
        <div className="booking-layout">
          <form className="booking-form" onSubmit={(e) => { e.preventDefault(); setSummary(true); }}>
            <Select label="Service" value={form.serviceId} onChange={(v) => update('serviceId', v)} options={services.map((s) => [s.id, s.name])} />
            <Select label="Package" value={form.packageId} onChange={(v) => { update('packageId', v); const pack = selectedService?.packages?.find((p) => String(p.id) === String(v)); if (pack) update('duration', pack.duration); }} options={(selectedService?.packages || []).map((p) => [p.id, `${p.name} - ${formatPrice(p.price)}`])} />
            {['preferredDate', 'preferredTime', 'location', 'duration', 'name', 'phone', 'email', 'instagram'].map((name) => <Field key={name} name={name} value={form[name]} onChange={update} />)}
            <label className="field wide"><span>Additional message</span><textarea value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
            <button className="btn primary wide" type="submit"><Calendar size={18} /> Review Booking</button>
          </form>
          <div className="booking-note"><Clock /><p>Unavailable dates and existing pending or confirmed sessions are blocked by the backend before a request is created.</p></div>
        </div>
      )}
      {summary && <Summary form={form} service={selectedService} pack={selectedPackage} onCancel={() => setSummary(false)} onConfirm={submit} />}
    </section>
  );
}

function Summary({ form, service, pack, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Booking Summary</h3>
        <p>{service?.name} / {pack?.name}</p>
        <p>{form.preferredDate} at {form.preferredTime} in {form.location}</p>
        <p>{form.name} - {form.phone} - {form.email}</p>
        <div className="actions"><button className="btn ghost" onClick={onCancel}>Edit</button><button className="btn primary" onClick={onConfirm}>Submit Request</button></div>
      </div>
    </div>
  );
}

function ClientPortal() {
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
        <SectionTitle eyebrow="Client Dashboard" title="Private Booking Page" />
        <form className="inline-form" onSubmit={lookup}><input placeholder="Booking reference" value={reference} onChange={(e) => setReference(e.target.value)} /><button className="btn primary">Open</button></form>
        {error && <p className="error">{error}</p>}
        {booking && <StatusCard booking={booking} />}
      </section>
    </main>
  );
}

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('lenscraft_token'));
  const [login, setLogin] = useState({ email: 'admin@orionpolaris.local', password: 'ChangeMe123!' });
  const [mode, setMode] = useState(localStorage.getItem('albatros_admin_mode') || 'api');
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
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
      localStorage.setItem('lenscraft_token', 'local-draft-admin');
      localStorage.setItem('albatros_admin_mode', 'local');
      setMode('local');
      setToken('local-draft-admin');
      setData(localAdminData());
      setError('Backend offline. Opened local draft mode so you can edit content now.');
    }
  }

  async function refresh() {
    if (mode === 'local' || token === 'local-draft-admin') {
      setData(localAdminData());
      return;
    }
    try {
      const paths = ['/admin/overview', '/admin/bookings', '/admin/services', '/admin/portfolio', '/admin/clients', '/admin/testimonials', '/admin/availability'];
      const [overview, bookings, services, projects, clients, testimonials, availability] = await Promise.all(paths.map((p) => api(p)));
      setData({ overview, bookings, services, projects, clients, testimonials, availability, settings: readLocal('settings', settingsDefaults) });
      setError('');
    } catch (err) {
      localStorage.setItem('albatros_admin_mode', 'local');
      setMode('local');
      setData(localAdminData());
      setError('Backend unavailable. You are editing local drafts.');
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
      projects: { title: '', category: 'Photography', description: '', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/albatros-opening.jpeg', featured: true },
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
      await api(endpoints[type], { method: 'POST', body: JSON.stringify(draft) });
      setEditing(null);
      refresh();
      return;
    }

    const collection = data[type] || [];
    const item = draft.id ? draft : { ...draft, id: Date.now() };
    const next = draft.id ? collection.map((existing) => existing.id === draft.id ? item : existing) : [item, ...collection];
    saveLocal(type, next);
    setEditing(null);
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
    setToken(null);
    setMode('api');
    setEditing(null);
  }

  if (!token) {
    return <main className="panel-page"><form className="login-panel" onSubmit={signIn}><img className="auth-logo dark-logo" src="/assets/albatros-logo.png" alt="ALBATROS" /><img className="auth-logo light-logo" src="/assets/albatros-logo-light.png" alt="ALBATROS" /><Lock /><h2>Admin Login</h2><p className="admin-help">If the backend is online, this signs into the secure dashboard. If it is offline, it opens local draft mode for editing site content before deployment.</p><Field name="email" value={login.email} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><Field name="password" value={login.password} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><button className="btn primary">Sign In</button>{error && <p className="error">{error}</p>}</form></main>;
  }

  return (
    <main className="admin-shell">
      <div className="admin-head">
        <SectionTitle eyebrow="Admin Dashboard" title="Studio Operations" />
        <div className="admin-actions">
          {mode === 'local' && <span className="mode-pill"><WifiOff size={15} /> Local draft mode</span>}
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>
      </div>
      {error && <p className="admin-alert">{error}</p>}
      <div className="admin-tabs">
        {['overview', 'bookings', 'services', 'portfolio', 'testimonials', 'availability', 'settings'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => { setActiveTab(tab); setEditing(null); }}>{tab}</button>)}
      </div>

      {activeTab === 'overview' && <>
        <div className="stats">{Object.entries(data.overview).map(([k, v]) => <div key={k}><span>{k.replace(/([A-Z])/g, ' $1')}</span><strong>{k === 'revenue' ? formatPrice(v) : String(v)}</strong></div>)}</div>
        <section className="creative-board">
          <h3>Creative Ideas</h3>
          <p>Feature a monthly “Visual Story” on the homepage, mark unfinished categories as coming soon, and prepare Instagram-first project cards with one hero image, one vertical reel, and a short caption.</p>
        </section>
      </>}

      {activeTab === 'bookings' && <AdminBlock title="Bookings">
        {data.bookings.length === 0 && <p className="admin-empty">No bookings yet.</p>}
        {data.bookings.map((b) => <div className="row" key={b.id}><span>{b.reference}<small>{b.client?.name} - {b.preferredDate} {b.preferredTime}</small></span><StatusBadge status={b.status} /><button onClick={() => updateBooking(b.id, 'CONFIRMED')}>Confirm</button><button onClick={() => updateBooking(b.id, 'REJECTED')}>Reject</button></div>)}
      </AdminBlock>}

      {activeTab === 'services' && <EditableCollection title="Services & Pricing" type="services" items={data.services} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} fields={['name', 'description']} renderMeta={(item) => `${item.packages?.length || 0} packages`} />}
      {activeTab === 'portfolio' && <EditableCollection title="Portfolio Posts" type="projects" items={data.projects} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} fields={['title', 'category', 'description', 'location', 'projectDate', 'coverImageUrl']} renderMeta={(item) => `${item.category} - ${item.location}`} />}
      {activeTab === 'testimonials' && <EditableCollection title="Testimonials" type="testimonials" items={data.testimonials} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} fields={['clientName', 'projectOrService', 'review', 'photoUrl']} renderMeta={(item) => item.projectOrService} />}
      {activeTab === 'availability' && <EditableCollection title="Availability" type="availability" items={data.availability} onCreate={startCreate} onEdit={startEdit} onDelete={deleteItem} fields={['date', 'startTime', 'endTime', 'reason']} renderMeta={(item) => `${item.startTime || 'Full day'} - ${item.endTime || 'blocked'}`} />}
      {activeTab === 'settings' && <AdminBlock title="Settings"><button className="btn primary admin-add" onClick={() => startEdit('settings', data.settings)}><Pencil size={17} /> Edit Settings</button><div className="settings-list">{Object.entries(data.settings).map(([key, value]) => <p key={key}><strong>{key}</strong><span>{String(value)}</span></p>)}</div></AdminBlock>}

      {editing && <EditorModal type={editing.type} draft={draft} setDraft={setDraft} onClose={() => setEditing(null)} onSave={() => saveDraft(editing.type)} />}
    </main>
  );
}

function EditableCollection({ title, type, items, onCreate, onEdit, onDelete, renderMeta }) {
  return (
    <AdminBlock title={title}>
      <button className="btn primary admin-add" onClick={() => onCreate(type)}><Plus size={17} /> Add</button>
      {items.length === 0 && <p className="admin-empty">Nothing here yet.</p>}
      {items.map((item) => <div className="row editable-row" key={item.id || item.title || item.name || item.clientName}><span>{item.name || item.title || item.clientName || item.date}<small>{renderMeta(item)}</small></span><button onClick={() => onEdit(type, item)}><Pencil size={15} /> Edit</button><button onClick={() => onDelete(type, item.id)}><Trash2 size={15} /> Delete</button></div>)}
    </AdminBlock>
  );
}

function EditorModal({ type, draft, setDraft, onClose, onSave }) {
  const fieldsByType = {
    services: ['name', 'description'],
    projects: ['title', 'category', 'description', 'location', 'projectDate', 'coverImageUrl'],
    testimonials: ['clientName', 'projectOrService', 'review', 'photoUrl'],
    availability: ['date', 'startTime', 'endTime', 'reason'],
    settings: ['brand', 'founder', 'email', 'phone', 'instagram', 'whatsapp', 'location', 'tagline']
  };
  return (
    <div className="modal-backdrop">
      <div className="modal editor-modal">
        <h3>{draft.id ? 'Modify' : 'Add'} {type}</h3>
        <div className="editor-grid">
          {fieldsByType[type].map((field) => (
            <label className={['description', 'review', 'tagline'].includes(field) ? 'field wide' : 'field'} key={field}>
              <span>{field.replace(/([A-Z])/g, ' $1')}</span>
              {['description', 'review', 'tagline'].includes(field)
                ? <textarea value={draft[field] || ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
                : field === 'category'
                  ? <select value={draft[field] || 'Photography'} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}>{categories.filter((c) => c !== 'All').map((category) => <option key={category}>{category}</option>)}</select>
                  : <input value={draft[field] || ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />}
            </label>
          ))}
        </div>
        <div className="actions"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" onClick={onSave}><Save size={17} /> Save</button></div>
      </div>
    </div>
  );
}

function AboutSection() {
  return <section className="section about"><figure className="about-portrait"><img src="/assets/hamza-portrait.jpeg" alt="Portrait of Hamza Elbahi" /><figcaption>Hamza Elbahi - ALBATROS</figcaption></figure><div><SectionTitle eyebrow="About Hamza" title="Director's Eye, Editor's Discipline" /><p>Hamza Elbahi is the Rabat-based photographer, videographer, and video editor behind ALBATROS, shaping weddings, commercial campaigns, portraits, live events, and social launches with a cinematic eye.</p><ul><li>Specialties: cinematic weddings, branded reels, portraits, live events</li><li>Equipment: full-frame cinema cameras, gimbals, drones, studio lighting, calibrated edit suite</li><li>Philosophy: elegant images should feel honest before they feel perfect.</li></ul></div></section>;
}

function Testimonials({ items }) {
  return <section className="section"><SectionTitle eyebrow="Testimonials" title="Client Notes" /><div className="testimonial-grid">{items.map((t) => <blockquote key={t.id || t.clientName}><p>"{t.review}"</p><cite>{t.clientName}<span>{t.projectOrService}</span></cite></blockquote>)}</div></section>;
}

function ContactSection() {
  return <section className="section contact"><SectionTitle eyebrow="Contact" title="Start the Conversation" /><div className="contact-grid"><a href={WHATSAPP_URL}><MessageCircle /> WhatsApp</a><a href={INSTAGRAM_URL}><Instagram /> Instagram</a><a href={`mailto:${EMAIL}`}><Mail /> {EMAIL}</a><a href={`tel:${PHONE_TEL}`}><Phone /> {PHONE_DISPLAY}</a><span><MapPin /> Rabat, Morocco</span></div></section>;
}

function Footer() {
  return <footer className="site-footer"><img className="footer-logo dark-logo" src="/assets/albatros-logo.png" alt="ALBATROS" /><img className="footer-logo light-logo" src="/assets/albatros-logo-light.png" alt="ALBATROS" /><p>Photo / Film / Communication</p><span>Rabat, Morocco - Visuals that move</span></footer>;
}

function SectionTitle({ eyebrow, title }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function Field({ name, value, onChange }) {
  const type = name.includes('Date') ? 'date' : name.includes('Time') ? 'time' : name === 'email' ? 'email' : name === 'password' ? 'password' : 'text';
  return <label className="field"><span>{name.replace(/([A-Z])/g, ' $1')}</span><input required={!['instagram'].includes(name)} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="field"><span>{label}</span><select required value={value} onChange={(e) => onChange(e.target.value)}><option value="">Select {label}</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
}

function StatusCard({ booking }) {
  return <div className="status-card"><StatusBadge status={booking.status} /><h3>{booking.reference}</h3><p>{booking.service?.name} / {booking.servicePackage?.name}</p><p>{booking.preferredDate} at {booking.preferredTime}</p><p>{booking.location}</p><p>Payment: {booking.paymentStatus} - Delivery: {booking.deliveryStatus}</p>{booking.photographerNotes && <p>Notes: {booking.photographerNotes}</p>}{booking.secureGalleryUrl && <a className="btn primary" href={booking.secureGalleryUrl}>Open Gallery</a>}</div>;
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
  { id: 1, name: 'Wedding Film & Photo', description: 'Cinematic wedding storytelling with editorial portraits, candid moments, and a polished highlight film.', packages: [
    { id: 1, name: 'Intimate Ceremony', includes: 'Ceremony coverage, couple portraits, edited online gallery, 3-5 minute highlight film', duration: '4 hours', editedAssets: 180, price: 5000 },
    { id: 2, name: 'Signature Wedding', includes: 'Full-day photo and video coverage, teaser reel, private gallery, 8-12 minute cinematic film', duration: '8 hours', editedAssets: 450, price: 9500 },
    { id: 3, name: 'ALBATROS Premium', includes: 'Full wedding story, two-camera coverage, drone when permitted, teaser, cinematic film, luxury delivery gallery', duration: '12 hours', editedAssets: 700, price: 16000 }
  ] },
  { id: 2, name: 'Portrait Session', description: 'Editorial portraits for personal brands, artists, creators, and professional profiles.', packages: [
    { id: 4, name: 'Essential Portrait', includes: 'One location, guided posing, color correction, retouched selects', duration: '1 hour', editedAssets: 12, price: 700 },
    { id: 5, name: 'Editorial Portrait', includes: 'Two looks, creative direction, advanced retouching, social-ready crops', duration: '2 hours', editedAssets: 25, price: 1500 }
  ] },
  { id: 3, name: 'Events Coverage', description: 'Elegant photo and video coverage for private events, sport, performances, launches, and corporate moments.', packages: [
    { id: 6, name: 'Event Photo', includes: 'Event photography, curated gallery, color grading, fast online delivery', duration: '3 hours', editedAssets: 150, price: 2500 },
    { id: 7, name: 'Event Photo + Film', includes: 'Photo coverage, highlight video, vertical recap reel, private delivery link', duration: '4 hours', editedAssets: 220, price: 5500 }
  ] },
  { id: 4, name: 'Social Content Studio', description: 'High-impact photo and short-form video sessions built for Instagram, TikTok, launches, and personal brands.', packages: [
    { id: 8, name: 'Creator Half Day', includes: 'Shot list planning, vertical video capture, 6 edited reels, 45 edited photos', duration: '4 hours', editedAssets: 51, price: 4500 },
    { id: 9, name: 'Launch Content Day', includes: 'Campaign planning, product/lifestyle capture, 10 reels, 80 photos, delivery calendar', duration: '6 hours', editedAssets: 90, price: 7500 }
  ] },
  { id: 5, name: 'Commercial Brand Visuals', description: 'Premium photo, film, and visual communication packages for brands, venues, and campaigns.', packages: [
    { id: 10, name: 'Brand Starter', includes: 'Creative direction, half-day shoot, edited brand gallery, one hero reel', duration: '5 hours', editedAssets: 61, price: 6500 },
    { id: 11, name: 'Campaign Film + Photo', includes: 'Full-day production, photo library, campaign film, social cutdowns, usage-ready delivery', duration: '8 hours', editedAssets: 110, price: 12000 }
  ] }
];
const demoProjects = [
  { title: 'Between Earth & Sky', category: 'Photography', description: 'Open horizons, last light, and night skies with a cinematic sense of scale.', location: 'Rabat / Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-quiet-horizon.jpeg' },
  { title: 'Cosmic Frames', category: 'Photography', description: 'Moon textures, distant light, and quiet celestial compositions.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-lunar-texture.jpeg' },
  { title: 'Cosmic Abstraction', category: 'Video Editing', description: 'A short abstract motion piece shaped for atmosphere, rhythm, and screen impact.', location: 'Studio Edit', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-distant-light.jpeg', videoUrl: '/assets/portfolio-clean/videography-cosmic-abstraction.mp4' },
  { title: 'Motion in Silence', category: 'Events', description: 'Live movement, performance, sport, and field moments captured with energy and restraint.', location: 'Morocco', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/events-fire-performance.jpg' },
  { title: 'Stillness Portraits', category: 'Portraits', description: 'Minimal portrait work built around expression, shadow, and presence.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-stillness.jpg' },
  { title: 'Find the Light', category: 'Portraits', description: 'A stylized portrait study balancing mystery, contrast, and soft light.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/portrait-find-the-light.jpg' },
  { title: 'ALBATROS Brand System', category: 'Commercial', description: 'Brand imagery and visual direction for a premium photo, film, and communication identity.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/commercial-albatros-brand-system.jpeg' },
  { title: 'Visuals That Move', category: 'Social Media Content', description: 'Cinematic brand visuals prepared for high-impact Instagram presentation.', location: 'Rabat', projectDate: '2026', coverImageUrl: '/assets/hamza-albatros.jpeg' },
  { title: 'Cosmic Motion', category: 'Videography', description: 'Atmospheric moving image work for poetic, visual-first storytelling.', location: 'Studio Edit', projectDate: '2026', coverImageUrl: '/assets/portfolio-clean/photography-under-stars.jpg', videoUrl: '/assets/portfolio-clean/videography-cosmic-abstraction.mp4' }
];
const demoTestimonials = [{ clientName: 'Maya R.', projectOrService: 'Wedding Film', review: 'The final film felt like memory, not just coverage. Every detail was intentional.' }];

createRoot(document.getElementById('root')).render(<App />);
