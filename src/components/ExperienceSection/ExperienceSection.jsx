import Slab from '../Slab/Slab.jsx';
import Reveal from '../Reveal/Reveal.jsx';
import { CHAPTERS } from '../../data/experience.js';
import styles from './ExperienceSection.module.css';

const YEAR_FILLS = ['yellow', 'lime', 'cyan', 'magenta', 'cream'];

export default function ExperienceSection() {
  return (
    <section id="experience" className={styles.section}>
      <p className={styles.eyebrow}>(03) Experience</p>
      <h2 className={styles.heading}>Where I've worked</h2>
      <div className={styles.list}>
        {CHAPTERS.map((c, i) => (
          <Reveal key={`${c.year}-${c.role}`} delay={i * 0.04}>
            <Slab
              as="article"
              fill="cream"
              shadow="l"
              tilt={i % 2 === 0 ? -0.6 : 0.5}
              interactive
              className={styles.row}
            >
              <div className={styles.year} data-fill={YEAR_FILLS[i]}>
                {String(c.year).slice(2)}
              </div>
              <div className={styles.detail}>
                <h3 className={styles.role}>{c.role}</h3>
                <p className={styles.meta}>{c.company} · {c.location}</p>
                <p className={styles.meta}>{c.date}</p>
                <p className={styles.desc}>{c.desc}</p>
              </div>
            </Slab>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
