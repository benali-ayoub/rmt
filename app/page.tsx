'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import HeroCarousel from './components/hero-carousel';
import TravelerReviews from './components/traveler-reviews';
import BookingSelect from './components/booking-select';
import { ArrowUpRight, ArrowRight, Menu, X, MapPin, CalendarDays, Users, Compass, HeartHandshake, MessageCircle, Check, Mountain, Sun, Clock3 } from 'lucide-react';

const number = '212644643319';
const chat = `https://wa.me/${number}?text=${encodeURIComponent('Hello Royal Morocco Travels! I would like to plan a trip to Morocco.')}`;
const journeys = [
  { name: 'The Sahara escape', place: 'Merzouga · Sahara Desert', image: '/sahara.jpg', alt: 'Golden sand dunes in Merzouga at sunset', tag: 'DESERT & STARRY NIGHTS', days: '3–5 day inspiration', description: 'Chase the sunset over golden dunes and slow down beneath a sky full of stars.', itinerary: 'A journey from Marrakech through the Atlas Mountains and the kasbahs of southern Morocco, continuing to the dunes of Merzouga. Ask us about a desert camp stay and the best route for your dates.' },
  { name: 'The heart of Marrakech', place: 'Marrakech · Imperial Cities', image: '/marrakech.jpg', alt: 'Intricate Moroccan courtyard architecture and reflecting pool in Marrakech', tag: 'CULTURE & DISCOVERY', days: '2–4 day inspiration', description: 'Wander the medina, discover quiet courtyards, and experience the city beyond the souks.', itinerary: 'Make time for Marrakech’s medina, architecture and gardens, with space to explore at your own pace. Tell us your interests and we will help shape a city itinerary around you.' },
  { name: 'Into the blue', place: 'Chefchaouen · Northern Morocco', image: '/chefchaouen.jpg', alt: 'Blue painted alley and stairs in Chefchaouen', tag: 'SLOW TRAVEL & HIDDEN GEMS', days: '2–3 day inspiration', description: 'Lose yourself in blue-washed lanes, mountain views, and a gentler rhythm of life.', itinerary: 'Explore Chefchaouen’s blue streets and the landscapes of the Rif Mountains. Ask about combining your stay with Tangier or Fes for a longer northern Morocco journey.' },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destination, setDestination] = useState('A little of everything');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('2 travelers');
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const bookingRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: 'stage_morocco_journey', title: 'Choose a Morocco journey',
        description: 'Select a journey in the visible trip planner. Does not send a WhatsApp message or confirm a booking.',
        inputSchema: { type: 'object', properties: { journey: { type: 'string', enum: ['A little of everything', ...journeys.map(j => j.name), 'A tailor-made journey'] } }, required: ['journey'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          if (!input || typeof input !== 'object' || Object.keys(input).some(key => key !== 'journey')) throw new Error('Provide only a journey.');
          const value = (input as { journey?: unknown }).journey;
          if (typeof value !== 'string' || !['A little of everything', ...journeys.map(j => j.name), 'A tailor-made journey'].includes(value)) throw new Error('Choose an available journey.');
          flushSync(() => setDestination(value));
          document.getElementById('plan-your-trip')?.scrollIntoView({ block: 'center' });
          return { status: 'staged', journey: value, bookingConfirmed: false };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* The visible planner also works without WebMCP. */ }
    return () => lifecycle.abort();
  }, []);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  function plan(value?: string) {
    if (value) setDestination(value);
    setMenuOpen(false);
    dialog.current?.close();
    document.getElementById('plan-your-trip')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bookingRef.current?.focus({ preventScroll: true });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const chosenDate = event.currentTarget.querySelector<HTMLInputElement>('input[type="date"]')?.value;
    const text = `Hello Royal Morocco Travels! I'd like to plan a trip.\nJourney: ${destination}\nTravel date: ${chosenDate || 'Flexible / to be discussed'}\nGroup: ${travelers}\nPlease share availability and a personalized quote.`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="#" aria-label="Royal Morocco Travels home"><img className="brand-logo" src="/logo-mark.svg" width="48" height="54" alt=""/><span>ROYAL MOROCCO<small>TRAVELS</small></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#journeys" onClick={()=>setMenuOpen(false)}>Our journeys</a><a href="#our-way" onClick={()=>setMenuOpen(false)}>Why travel with us</a><a href="#reviews" onClick={()=>setMenuOpen(false)}>Traveler reviews</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Let’s talk</a>
      </nav>
      <button className="button dark header-book" onClick={()=>plan()}>Book your journey <ArrowUpRight size={17}/></button>
      <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="main">
      <HeroCarousel/>

      <section className="booking-wrap" id="plan-your-trip" aria-label="Plan your Morocco trip">
        <form className="booking-bar" onSubmit={submit}>
          <div className="booking-field"><MapPin size={21}/><div className="field-content"><span className="field-label">YOUR KIND OF MOROCCO</span><BookingSelect buttonRef={bookingRef} ariaLabel="Choose your journey" value={destination} onChange={setDestination} options={['A little of everything', ...journeys.map(j => j.name), 'A tailor-made journey']}/></div></div>
          <label className="booking-field date-field"><CalendarDays size={21}/><span><span className="field-label">WHEN DO YOU WANT TO GO?</span><input type="date" aria-label="Travel date, optional" min={minDate} value={date} onChange={e=>setDate(e.target.value)}/></span></label>
          <div className="booking-field"><Users size={21}/><div className="field-content"><span className="field-label">WHO’S COMING ALONG?</span><BookingSelect ariaLabel="Number of travelers" value={travelers} onChange={setTravelers} options={['Solo traveler', '2 travelers', '3–4 travelers', '5–8 travelers', '9+ travelers']}/></div></div>
          <button type="submit" className="button dark booking-submit">Let’s plan your trip <ArrowUpRight size={19}/></button>
        </form>
        <p className="booking-hint"><MessageCircle size={14}/> A conversation, not a commitment. Plan directly with us on WhatsApp.</p>
      </section>

      <section className="journeys section" id="journeys">
        <div className="section-heading"><div><p className="eyebrow">A WORLD OF EXPERIENCES, ONE MOROCCO</p><h2>Follow your sense<br className="mobile-break"/> of wonder.</h2></div><p>Different landscapes. Different rhythms.<br/>Find the journey that speaks to you.</p></div>
        <div className="tour-grid">{journeys.map((journey,index)=><article className="tour-card" key={journey.name}>
          <button className="tour-photo" aria-label={`Explore ${journey.name}`} onClick={()=>{setSelected(index);dialog.current?.showModal();}}><img src={journey.image} alt={journey.alt} loading="lazy"/><span className="photo-tag">{journey.tag}</span><span className="photo-arrow"><ArrowUpRight size={23}/></span></button>
          <div className="tour-meta"><MapPin size={14}/>{journey.place}</div><h3>{journey.name}</h3><p>{journey.description}</p><div className="tour-bottom"><span><Clock3 size={15}/>{journey.days}</span><button onClick={()=>plan(journey.name)}>Plan this journey <ArrowRight size={16}/></button></div>
        </article>)}</div>
        <p className="journey-footnote">A little inspiration to begin. Every itinerary can be shaped around you.</p>
      </section>

      <section className="our-way section" id="our-way"><div className="way-intro"><p className="eyebrow">THE ROYAL MOROCCO WAY</p><h2>A place this special<br/>deserves a personal touch.</h2><p>There’s more than one way to see Morocco.<br/>Let’s find yours.</p><a href={chat} target="_blank" rel="noopener noreferrer" className="text-link">Meet your next adventure <ArrowUpRight size={18}/></a></div><div className="values"><div><span className="value-icon"><Compass/></span><div><h3>Made around you</h3><p>Your pace, your interests, your kind of adventure. Start with an idea and make it your own.</p></div></div><div><span className="value-icon"><HeartHandshake/></span><div><h3>A real conversation</h3><p>Talk directly with our team on WhatsApp. Ask questions and plan the details together.</p></div></div><div><span className="value-icon"><Mountain/></span><div><h3>Room for discovery</h3><p>Pair Morocco’s celebrated places with time for the moments in between.</p></div></div></div></section>

      <TravelerReviews/>
      <section className="contact section" id="contact"><span className="contact-sun"><Sun size={45} strokeWidth={1}/></span><p className="eyebrow light">GREAT JOURNEYS START WITH A HELLO</p><h2>Your Morocco story<br/>starts here.</h2><p>Have a dream trip in mind? Let’s bring it to life.</p><a className="button orange" href={chat} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/> Let’s talk on WhatsApp <ArrowUpRight size={18}/></a><span className="contact-number">+212 644 643 319</span></section>
    </main>
    <footer className="footer"><div className="footer-main"><a className="brand" href="#"><img className="brand-logo" src="/logo-mark.svg" width="48" height="54" alt=""/><span>ROYAL MOROCCO<small>TRAVELS</small></span></a><p>A little closer to the Morocco you’ve imagined.</p><a href="#journeys">Explore journeys <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Royal Morocco Travels</span><span>Morocco, with heart.</span></div></footer>
    <a className="floating-chat" href={chat} target="_blank" rel="noopener noreferrer" aria-label="Chat with Royal Morocco Travels on WhatsApp"><MessageCircle size={25}/></a>
    <div className="mobile-book"><span>Your journey, your way.</span><button className="button orange" onClick={()=>plan()}>Book your trip <ArrowUpRight size={17}/></button></div>
    <dialog ref={dialog} className="journey-dialog" onClick={event=>{if(event.target === dialog.current)dialog.current?.close();}} aria-labelledby="dialog-title"><button className="dialog-close" aria-label="Close journey details" onClick={()=>dialog.current?.close()}><X/></button>{selected !== null && <><img src={journeys[selected].image} alt={journeys[selected].alt}/><div className="dialog-content"><p className="eyebrow">{journeys[selected].place}</p><h2 id="dialog-title">{journeys[selected].name}</h2><p>{journeys[selected].itinerary}</p><p className="dialog-note"><Check size={17}/> Dates, availability and pricing confirmed with our team.</p><button className="button dark" onClick={()=>plan(journeys[selected].name)}>Plan this journey <ArrowUpRight size={18}/></button></div></>}</dialog>
  </>;
}
