'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, MapPin, Pause, Play } from 'lucide-react';

const slides = [
  { image: '/sahara.jpg', name: 'The Sahara', location: 'Merzouga', alt: 'Sunset light falling across the golden dunes of the Sahara in Merzouga', position: '50% 51%' },
  { image: '/marrakech-hero.jpg', name: 'The Red City', location: 'Marrakech', alt: 'Intricate carved arches and a reflecting pool in a Marrakech courtyard', position: '50% 48%' },
  { image: '/chefchaouen-hero.jpg', name: 'The Blue Pearl', location: 'Chefchaouen', alt: 'Blue-washed streets and doorways in Chefchaouen', position: '50% 55%' },
  { image: '/casablanca-hero.jpg', name: 'By the Atlantic', location: 'Casablanca', alt: 'Hassan II Mosque in Casablanca beside the Atlantic Ocean', position: '50% 50%' },
  { image: '/ait-benhaddou-hero.jpg', name: 'The ancient ksar', location: 'Aït Ben Haddou', alt: 'The earthen fortified village of Aït Ben Haddou in southern Morocco', position: '50% 50%' },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [visited, setVisited] = useState([0]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPlaying(!reduced.matches);
    const onMotion = () => { if (reduced.matches) setPlaying(false); };
    const onVisibility = () => setPageVisible(!document.hidden);
    reduced.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { reduced.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => {
    if (!playing || hovered || !pageVisible) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [playing, hovered, pageVisible]);
  useEffect(() => { setVisited(current => current.includes(active) ? current : [...current, active]); }, [active]);
  function goTo(index: number) { setPlaying(false); setActive((index + slides.length) % slides.length); }
  return <section className="hero carousel" aria-label="Discover Morocco" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={event => { if (!(event.target instanceof HTMLElement && event.target.closest('.carousel-play'))) setPlaying(false); }} onTouchStart={event => {touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };}} onTouchEnd={event => {
    if (!touchStart.current) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) goTo(active + (dx < 0 ? 1 : -1));
    touchStart.current = null;
  }}>
    <div className="carousel-images" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">{slides.map((slide, index) => <div className={`hero-slide ${index === active ? 'active' : ''}`} key={slide.location} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.location}`} aria-hidden={index !== active}>
      {(visited.includes(index) || index === active) && <img className="hero-image" src={slide.image} alt={slide.alt} style={{objectPosition:slide.position}} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async"/>}
    </div>)}</div>
    <div className="hero-shade"/>
    <div className="hero-content"><p className="eyebrow light"><span/> YOUR MOROCCO. YOUR STORY.</p><h1 id="hero-title">Some places stay<br/>with you.<br/><em>Morocco is one.</em></h1><p className="hero-description">From the winding medinas to the endless Sahara.<br className="desktop-break"/> Discover a Morocco that feels like it was made for you.</p><a className="button orange" href="#journeys">Find your Moroccan adventure <ArrowUpRight size={19}/></a><div className="hero-note"><Compass size={17}/><span>Thoughtful journeys. Unforgettable places.</span></div></div>
    <div className="hero-index"><span>{String(active+1).padStart(2,'0')}</span><span className="index-line"/>{slides[active].name.toUpperCase()}</div>
    <div className="carousel-footer"><div className="carousel-location"><MapPin size={16}/><span>{slides[active].location}, Morocco</span></div><div className="carousel-controls" aria-label="Slideshow controls">
      <button className="carousel-arrow" aria-label="Previous destination" onClick={()=>goTo(active-1)}><ArrowLeft size={19}/></button>
      <div className="carousel-dots">{slides.map((slide,index)=><button key={slide.location} aria-label={`Show ${slide.location}`} aria-pressed={active === index} className={active === index ? 'active' : ''} onClick={()=>goTo(index)}><span/></button>)}</div>
      <button className="carousel-arrow" aria-label="Next destination" onClick={()=>goTo(active+1)}><ArrowRight size={19}/></button>
      <button className="carousel-play" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={()=>setPlaying(current=>!current)}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>
    </div></div>
  </section>;
}
