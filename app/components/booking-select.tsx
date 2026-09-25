'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type BookingSelectProps = {
  ariaLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

export default function BookingSelect({ ariaLabel, value, options, onChange, buttonRef }: BookingSelectProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  return <div className={`booking-select ${open ? 'open' : ''}`} ref={root}>
    <button ref={buttonRef} type="button" className="select-trigger" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(current => !current)}>
      <span>{value}</span><ChevronDown size={17}/>
    </button>
    {open && <div className="select-menu" id={listId} role="listbox" aria-label={ariaLabel}>
      {options.map(option => <button key={option} type="button" role="option" aria-selected={option === value} className={option === value ? 'selected' : ''} onClick={() => { onChange(option); setOpen(false); }}>
        <span>{option}</span>{option === value && <Check size={16}/>} 
      </button>)}
    </div>}
  </div>;
}
