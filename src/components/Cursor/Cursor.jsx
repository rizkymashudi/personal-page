import { useEffect, useState } from 'react';
import useCursor from '../../hooks/useCursor.js';
import styles from './Cursor.module.css';

export default function Cursor() {
  const { enabled } = useCursor();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHot(Boolean(el?.closest('a, button, [data-interactive]')));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-cursor
      aria-hidden="true"
      className={styles.cursor}
      data-hot={hot ? 'true' : undefined}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    />
  );
}
