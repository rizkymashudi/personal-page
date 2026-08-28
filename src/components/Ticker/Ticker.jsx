import styles from './Ticker.module.css';

export default function Ticker({
  items,
  separator = '/',
  reverse = false,
  speed = 22,
  label,
}) {
  const line = items.map((i) => `${i} ${separator}`).join(' ');

  return (
    <div className={styles.bar}>
      <ul className={styles.sr} aria-label={label}>
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
      <div
        data-track
        aria-hidden="true"
        className={styles.track}
        data-reverse={reverse ? 'true' : undefined}
        style={{ '--speed': `${speed}s` }}
      >
        <span className={styles.copy}>{line}</span>
        <span className={styles.copy}>{line}</span>
      </div>
    </div>
  );
}
