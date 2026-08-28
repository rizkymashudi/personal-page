import { useEffect, useState } from 'react';
import Slab from '../Slab/Slab.jsx';
import styles from './Nav.module.css';

export const NAV_LINKS = [
  { id: 'work',       label: 'Work',    num: '(01)', fill: 'lime' },
  { id: 'skills',     label: 'Skills',  num: '(02)', fill: 'cyan' },
  { id: 'experience', label: 'Exp',     num: '(03)', fill: 'yellow' },
  { id: 'about',      label: 'About',   num: '(04)', fill: 'cream' },
  { id: 'writing',    label: 'Writing', num: '(05)', fill: 'violet' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <Slab as="nav" className={styles.slab} shadow="m" tilt={-1.5}>
        <span className={styles.logo}>RM_</span>
        <ul className={styles.links}>
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={styles.link}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#about" className={styles.hire}>Hire me</a>
        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-hidden={open || undefined}
          tabIndex={open ? -1 : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </Slab>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className={styles.panel}>
          <div className={styles.panelTop}>
            <span className={styles.logo}>RM_</span>
            <button
              type="button"
              className={styles.close}
              aria-expanded={open}
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >✕</button>
          </div>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={styles.panelLink}
              data-fill={l.fill}
              onClick={() => setOpen(false)}
            >
              {l.label} <i>{l.num}</i>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
