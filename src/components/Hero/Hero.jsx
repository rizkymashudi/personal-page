import Slab from '../Slab/Slab.jsx';
import Sticker from '../Sticker/Sticker.jsx';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="intro" className={styles.hero}>
      <div className={styles.dots} aria-hidden="true" />

      <p className={styles.eyebrow}>(00) Intro</p>

      <h1 className={styles.headline}>
        iOS <span className={styles.chip} data-fill="lime">Engineer</span>{' '}
        Shipping <span className={styles.outline}>Real</span>{' '}
        Apps <span className={styles.chip} data-fill="violet">Since '19</span>
      </h1>

      <p className={styles.bio}>
        5+ years / 4+ production apps / 13+ end-to-end client projects.<br />
        Fintech · Banking · Government · Telecom.
      </p>

      <div className={styles.ctas}>
        <Slab as="a" href="#work" fill="magenta" shadow="m" interactive className={styles.cta}>
          View work ↓
        </Slab>
        <Slab as="a" href="#about" fill="cream" shadow="m" interactive className={styles.cta}>
          Get in touch
        </Slab>
      </div>

      <Sticker id="badge" data-ornament className={styles.badgeSlot}>
        <Slab fill="violet" shadow="m" tilt={-10} className={styles.badge}>
          Open<br />to<br />work
        </Slab>
      </Sticker>
      <Sticker id="star" data-ornament className={styles.star}>★</Sticker>
    </section>
  );
}
