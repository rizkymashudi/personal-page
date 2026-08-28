import Slab from '../Slab/Slab.jsx';
import Reveal from '../Reveal/Reveal.jsx';
import { ARTICLES, BLOG_NUM, BLOG_EYEBROW, BLOG_HEADING, MEDIUM_URL } from '../../data/blog.js';
import styles from './WritingSection.module.css';

const TAG_FILLS = ['magenta', 'lime', 'cyan', 'yellow'];

function monthYear(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

export default function WritingSection() {
  return (
    <section id="writing" className={styles.section}>
      <p className={styles.eyebrow}>{BLOG_NUM} {BLOG_EYEBROW}</p>
      <h2 className={styles.heading}>{BLOG_HEADING}</h2>

      <div className={styles.list}>
        {ARTICLES.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.04}>
            <Slab
              as="article"
              fill="cream"
              shadow="l"
              tilt={i % 2 === 0 ? -0.6 : 0.5}
              className={styles.card}
            >
              <p className={styles.meta}>{monthYear(a.date)} · {a.readTime}</p>
              <h3 className={styles.title}>
                <a href={a.url} target="_blank" rel="noreferrer noopener">{a.title} ↗</a>
              </h3>
              <p className={styles.excerpt}>{a.excerpt}</p>
              <ul className={styles.tags}>
                {a.tags.map((t, j) => (
                  <li key={t} data-fill={TAG_FILLS[j % TAG_FILLS.length]}>{t}</li>
                ))}
              </ul>
            </Slab>
          </Reveal>
        ))}
      </div>

      <Slab as="a" href={MEDIUM_URL} target="_blank" rel="noreferrer noopener"
            fill="magenta" shadow="m" interactive tilt={-1} className={styles.more}>
        All posts on Medium ↗
      </Slab>
    </section>
  );
}
