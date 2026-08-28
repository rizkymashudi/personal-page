import Slab from '../Slab/Slab.jsx';
import { SKILLS } from '../../data/skills.js';
import styles from './SkillsSection.module.css';

const FILLS = ['cyan', 'yellow', 'cream', 'lime', 'magenta', 'cream', 'violet', 'yellow'];

export default function SkillsSection() {
  return (
    <section id="skills" className={styles.section}>
      <p className={styles.eyebrow}>(02) What I do</p>
      <h2 className={styles.heading}>Eight things, done properly</h2>
      <div className={styles.grid}>
        {SKILLS.map((s, i) => (
          <Slab
            key={s.num}
            as="article"
            fill={FILLS[i]}
            shadow="l"
            tilt={s.tilt}
            interactive
            className={styles.card}
          >
            <p className={styles.index}>{s.num}</p>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.desc}>{s.desc}</p>
          </Slab>
        ))}
      </div>
    </section>
  );
}
