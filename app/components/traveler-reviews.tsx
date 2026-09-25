'use client';

import { useRef, useState } from 'react';
import { Star, ArrowUpRight, Pause, Play, X } from 'lucide-react';

const reviews = [
  { name: 'Alla Kleban', initials: 'AK', text: 'Going to Morocco? Book Abdu immediately! When we got completely swallowed by the Medina’s maze of alleyways, he came and found us. The whole trip he handled everything — reservations, local markets, things we didn’t even know we needed. Funny, attentive, and genuinely invested in giving us the best genuine experience. I would get lost in the Medina again just to work with him. ❤️🇲🇦' },
  { name: 'Jose Anamar', initials: 'JA', text: 'i went to merzouga desert last 3 days and it was an amazing experience ,our guide Abderrahim gaves us many information about the places and the culture of amazigh people (free people) and arabic habits ,tradition , i really recommended this trip especialy with abdel 💗' },
  { name: 'Abdigani Mohamed', initials: 'AM', text: 'Great guy highly recommend, showed me all the cool spots made everything easy for me. If you are traveling to Morocco I highly recommend you message him for your transportation.' },
  { name: 'Ana Filipa Bragança', initials: 'AF', text: 'Excellent driver! Abdoul was friendly, kind, and highly professional. The journey was smooth, safe, and enjoyable. He arrived on time and made us feel welcome throughout the ride.\n\nWhen we will return to Marrakech, we will definitely contact him again for a trip to the desert and other excursions around the city. We highly recommend him!' },
  { name: 'Abdeloihd Ait sghir', initials: 'AA', text: "I had an amazing experience with Abdou's tour agency! Everything was perfectly organized from start to finish. Abdou was friendly, professional, and made sure we felt comfortable throughout the trip. His knowledge of Morocco, the culture, and the hidden gems made the experience truly unforgettable. The accommodations, transportation, and activities were all excellent. I highly recommend this tour agency to anyone looking for an authentic and memorable adventure in Morocco. Thank you, Abdou, for an incredible experience!" },
  { name: 'Kreuzer Johann', initials: 'KJ', text: 'I had a wonderful day with Abderrahim, who drove me from Marrakech to Rabat. His friendly and kind manner made the journey a pleasant one, and I learned a lot about Morocco and its people.\n\nI wish him all the best for the future.\n\nBest regards from Hans in Austria', translated: true },
];

export default function TravelerReviews() {
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  function openReview(index: number) {
    setSelected(index);
    setPaused(true);
    window.requestAnimationFrame(() => dialog.current?.showModal());
  }
  function closeReview() {
    dialog.current?.close();
    setSelected(null);
  }
  const renderReview = (review: typeof reviews[number], index: number, duplicate = false) => {
    const isLong = review.text.length > 210;
    return <article className="review-card" key={`${review.name}-${duplicate ? 'copy' : 'original'}`} aria-hidden={duplicate || undefined}>
      <div className="review-stars" aria-label={duplicate ? undefined : '5 out of 5 stars'}>{Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} fill="currentColor" aria-hidden="true"/>)}</div>
      <blockquote className="review-quote">{review.text}</blockquote>
      {isLong && <button className="review-expand" tabIndex={duplicate ? -1 : undefined} onClick={() => openReview(index)}>Read full review</button>}
      <div className="review-author"><span className={`review-avatar tone-${index % 3}`} aria-hidden="true">{review.initials}</span><div><h3>{review.name}</h3><p>Google review{review.translated ? ' · Translated by Google' : ''}</p></div></div>
    </article>;
  };
  return <section className="reviews-section" id="reviews" aria-labelledby="reviews-title">
    <div className="section">
      <div className="section-heading reviews-heading"><div><p className="eyebrow">THE MEMORIES THEY TOOK HOME</p><h2 id="reviews-title">Morocco, in their words.</h2></div><div className="reviews-intro"><p>Real journeys. Personal connections.<br/>Stories from the travelers who came with us.</p><button className="reviews-motion" onClick={() => setPaused(current => !current)} aria-label={paused ? 'Resume review carousel' : 'Pause review carousel'}>{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? 'Resume' : 'Pause'}</button></div></div>
      <div className="reviews-marquee" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} aria-label="Traveler reviews">
        <div className={`reviews-track ${paused ? 'paused' : ''}`}>
          <div className="reviews-set">{reviews.map((review, index) => renderReview(review, index))}</div>
          <div className="reviews-set" aria-hidden="true">{reviews.map((review, index) => renderReview(review, index, true))}</div>
        </div>
      </div>
      <div className="reviews-bottom"><p>A few of the stories shared by our travelers.</p><a className="text-link" href="#plan-your-trip">Let’s plan your own <ArrowUpRight size={18}/></a></div>
    </div>
    <dialog ref={dialog} className="review-dialog" onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) closeReview(); }} aria-labelledby="full-review-author">
      <button className="dialog-close" aria-label="Close review" onClick={closeReview}><X/></button>
      {selected !== null && <div className="review-dialog-content"><div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={18} fill="currentColor" aria-hidden="true"/>)}</div><blockquote>{reviews[selected].text}</blockquote><div className="review-author"><span className={`review-avatar tone-${selected % 3}`} aria-hidden="true">{reviews[selected].initials}</span><div><h3 id="full-review-author">{reviews[selected].name}</h3><p>Google review{reviews[selected].translated ? ' · Translated by Google' : ''}</p></div></div></div>}
    </dialog>
  </section>;
}
