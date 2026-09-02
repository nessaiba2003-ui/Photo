import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, Camera, Check, Clock, Film, Instagram, Lock, Mail, MapPin, Menu, MessageCircle, Phone, Play, Sparkles, User, Video } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/app.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const categories = ['All', 'Photography', 'Videography', 'Video Editing', 'Weddings', 'Events', 'Portraits', 'Commercial', 'Social Media Content'];

const fallbackSite = {
  brand: 'LensCraft Studio',
  role: 'Photographer • Videographer • Video Editor',
  tagline: 'Cinematic stories for weddings, brands, artists, and unforgettable nights.',
  services: [],
  featuredProjects: [],
  testimonials: []
};

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

  useEffect(() => {
    api('/public/site').then(setSite).catch(() => setSite(fallbackSite));
  }, []);

  return (
    <>
      <Header brand={site.brand} onView={setView} view={view} />
      <AnimatePresence mode="wait">
        {view === 'site' && <PublicSite key="site" site={site} />}
        {view === 'client' && <ClientPortal key="client" />}
        {view === 'admin' && <AdminDashboard key="admin" />}
      </AnimatePresence>
      <FloatingButtons />
    </>
  );
}

function Header({ brand, onView, view }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onView('site')} aria-label="Open home">
        <Camera size={18} /> {brand}
      </button>
      <nav>
        {['site', 'client', 'admin'].map((item) => (
          <button key={item} className={view === item ? 'active' : ''} onClick={() => onView(item)}>
            {item === 'site' ? 'Website' : item === 'client' ? 'Client' : 'Admin'}
          </button>
        ))}
      </nav>
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
          <h1>{site.brand}</h1>
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
        <p>I build visual stories for couples, artists, founders, venues, and brands that need work with texture, restraint, and emotional clarity.</p>
      </section>

      <section className="section" id="portfolio">
        <SectionTitle eyebrow="Portfolio" title="Featured Projects" />
        <div className="filters" role="tablist">
          {categories.map((cat) => <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>)}
        </div>
        <div className="project-grid">
          {shownProjects.map((project) => <ProjectCard key={project.id || project.title} project={project} />)}
        </div>
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
                  <div><strong>{pack.name}</strong><span>{pack.duration} • {pack.editedAssets} edited assets</span></div>
                  <b>${Number(pack.price).toLocaleString()}</b>
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
        <small>{project.location} • {project.projectDate || 'Recent'}</small>
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
            <Select label="Package" value={form.packageId} onChange={(v) => { update('packageId', v); const pack = selectedService?.packages?.find((p) => String(p.id) === String(v)); if (pack) update('duration', pack.duration); }} options={(selectedService?.packages || []).map((p) => [p.id, `${p.name} - $${p.price}`])} />
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
        <p>{form.name} • {form.phone} • {form.email}</p>
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
  const [login, setLogin] = useState({ email: 'admin@lenscraft.local', password: 'ChangeMe123!' });
  const [data, setData] = useState({ overview: {}, bookings: [], services: [], projects: [], clients: [], testimonials: [], availability: [] });
  const [error, setError] = useState('');

  useEffect(() => { if (token) refresh(); }, [token]);

  async function signIn(e) {
    e.preventDefault();
    try {
      const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(login) });
      localStorage.setItem('lenscraft_token', result.token);
      setToken(result.token);
    } catch (err) { setError(err.message); }
  }

  async function refresh() {
    const [overview, bookings, services, projects, clients, testimonials, availability] = await Promise.all(['/admin/overview', '/admin/bookings', '/admin/services', '/admin/portfolio', '/admin/clients', '/admin/testimonials', '/admin/availability'].map((p) => api(p)));
    setData({ overview, bookings, services, projects, clients, testimonials, availability });
  }

  async function updateBooking(id, status) {
    await api(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    refresh();
  }

  if (!token) {
    return <main className="panel-page"><form className="login-panel" onSubmit={signIn}><Lock /><h2>Admin Login</h2><Field name="email" value={login.email} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><Field name="password" value={login.password} onChange={(n, v) => setLogin({ ...login, [n]: v })} /><button className="btn primary">Sign In</button>{error && <p className="error">{error}</p>}</form></main>;
  }

  return (
    <main className="admin-shell">
      <SectionTitle eyebrow="Admin Dashboard" title="Studio Operations" />
      <div className="stats">{Object.entries(data.overview).map(([k, v]) => <div key={k}><span>{k.replace(/([A-Z])/g, ' $1')}</span><strong>{String(v)}</strong></div>)}</div>
      <section className="admin-grid">
        <AdminBlock title="Bookings">
          {data.bookings.map((b) => <div className="row" key={b.id}><span>{b.reference}<small>{b.client?.name} • {b.preferredDate} {b.preferredTime}</small></span><StatusBadge status={b.status} /><button onClick={() => updateBooking(b.id, 'CONFIRMED')}>Confirm</button><button onClick={() => updateBooking(b.id, 'REJECTED')}>Reject</button></div>)}
        </AdminBlock>
        <AdminBlock title="Services & Pricing">{data.services.map((s) => <div className="row" key={s.id}><span>{s.name}<small>{s.packages?.length || 0} packages</small></span></div>)}</AdminBlock>
        <AdminBlock title="Portfolio">{data.projects.map((p) => <div className="row" key={p.id}><span>{p.title}<small>{p.category}</small></span></div>)}</AdminBlock>
        <AdminBlock title="Clients">{data.clients.map((c) => <div className="row" key={c.id}><span>{c.name}<small>{c.email} • {c.phone}</small></span></div>)}</AdminBlock>
        <AdminBlock title="Testimonials">{data.testimonials.map((t) => <div className="row" key={t.id}><span>{t.clientName}<small>{t.projectOrService}</small></span></div>)}</AdminBlock>
        <AdminBlock title="Availability">{data.availability.map((a) => <div className="row" key={a.id}><span>{a.date}<small>{a.startTime || 'Full day'} - {a.endTime || 'blocked'}</small></span></div>)}</AdminBlock>
      </section>
    </main>
  );
}

function AboutSection() {
  return <section className="section about"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80" alt="Photographer portrait" /><div><SectionTitle eyebrow="About" title="Director's Eye, Editor's Discipline" /><p>Ten years behind cameras and timelines, shaping weddings, commercial campaigns, portraits, live events, and social launches across Casablanca, Rabat, and Marrakech.</p><ul><li>Specialties: cinematic weddings, branded reels, portraits, live events</li><li>Equipment: full-frame cinema cameras, gimbals, drones, studio lighting, calibrated edit suite</li><li>Philosophy: elegant images should feel honest before they feel perfect.</li></ul></div></section>;
}

function Testimonials({ items }) {
  return <section className="section"><SectionTitle eyebrow="Testimonials" title="Client Notes" /><div className="testimonial-grid">{items.map((t) => <blockquote key={t.id || t.clientName}><p>“{t.review}”</p><cite>{t.clientName}<span>{t.projectOrService}</span></cite></blockquote>)}</div></section>;
}

function ContactSection() {
  return <section className="section contact"><SectionTitle eyebrow="Contact" title="Start the Conversation" /><div className="contact-grid"><a href="https://wa.me/212600000000"><MessageCircle /> WhatsApp</a><a href="https://instagram.com/lenscraft"><Instagram /> Instagram</a><a href="mailto:hello@lenscraft.studio"><Mail /> hello@lenscraft.studio</a><a href="tel:+212600000000"><Phone /> +212 600 000 000</a><span><MapPin /> Casablanca, Morocco</span></div></section>;
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
  return <div className="status-card"><StatusBadge status={booking.status} /><h3>{booking.reference}</h3><p>{booking.service?.name} / {booking.servicePackage?.name}</p><p>{booking.preferredDate} at {booking.preferredTime}</p><p>{booking.location}</p><p>Payment: {booking.paymentStatus} • Delivery: {booking.deliveryStatus}</p>{booking.photographerNotes && <p>Notes: {booking.photographerNotes}</p>}{booking.secureGalleryUrl && <a className="btn primary" href={booking.secureGalleryUrl}>Open Gallery</a>}</div>;
}

function StatusBadge({ status }) {
  return <b className={`status ${status?.toLowerCase()}`}>{status}</b>;
}

function AdminBlock({ title, children }) {
  return <section className="admin-block"><h3>{title}</h3>{children}</section>;
}

function FloatingButtons() {
  return <div className="floating"><a href="https://wa.me/212600000000" aria-label="WhatsApp"><MessageCircle /></a><a href="https://instagram.com/lenscraft" aria-label="Instagram"><Instagram /></a></div>;
}

const demoServices = [
  { id: 1, name: 'Wedding Film & Photo', description: 'Cinematic wedding storytelling with editorial portraits and highlight films.', packages: [{ id: 1, name: 'Signature Wedding', includes: 'Full-day coverage, teaser reel, private gallery, highlight film', duration: '8 hours', editedAssets: 450, price: 2200 }] },
  { id: 2, name: 'Social Content Studio', description: 'Short-form video and premium stills for creators and brands.', packages: [{ id: 2, name: 'Creator Day', includes: 'Shot list, vertical capture, 12 reels, 40 photos', duration: '4 hours', editedAssets: 52, price: 950 }] }
];
const demoProjects = [
  { title: 'Noir City Portraits', category: 'Portraits', description: 'Moody editorial portraits with film-inspired color.', location: 'Casablanca', coverImageUrl: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=1600&q=80' },
  { title: 'Atlas Wedding Story', category: 'Weddings', description: 'A refined wedding film and photo gallery.', location: 'Marrakech', coverImageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=80' },
  { title: 'Launch Reel System', category: 'Commercial', description: 'Commercial reels and stills for a hospitality launch.', location: 'Rabat', coverImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80' }
];
const demoTestimonials = [{ clientName: 'Maya R.', projectOrService: 'Wedding Film', review: 'The final film felt like memory, not just coverage. Every detail was intentional.' }];

createRoot(document.getElementById('root')).render(<App />);
