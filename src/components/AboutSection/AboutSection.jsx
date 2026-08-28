import Slab from '../Slab/Slab.jsx';
import { BIO_PHRASES, LINK_CARDS } from '../../data/about.js';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <p className={styles.eyebrow}>(04) About</p>
      <h2 className={styles.heading}>Who's writing this</h2>

      {BIO_PHRASES.map((phrase, i) => (
        <p key={i} data-bio className={styles.bio}>
          {phrase.segments.map((s, j) =>
            s.highlight
              ? <mark key={j} className={styles.mark}>{s.text}</mark>
              : <span key={j}>{s.text}</span>
          )}
        </p>
      ))}

      <div className={styles.links}>
        {LINK_CARDS.map((c) => (
          <Slab
            key={c.label}
            as="a"
            href={c.href}
            fill={c.color}
            shadow="m"
            interactive
            tilt={-1}
            className={styles.link}
            {...(c.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            {c.label} {c.external ? '↗' : '→'}
          </Slab>
        ))}
      </div>
    </section>
  );
}
