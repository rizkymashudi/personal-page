import { motion, useReducedMotion } from 'framer-motion';
import useStickerPositions from '../../hooks/useStickerPositions.js';
import useCursor from '../../hooks/useCursor.js';
import styles from './Sticker.module.css';

export default function Sticker({ id, children, className = '', ...rest }) {
  const { positions, setPosition } = useStickerPositions();
  const { enabled } = useCursor();
  const reduced = useReducedMotion();
  const draggable = enabled && !reduced;
  const at = positions[id] ?? { x: 0, y: 0 };

  if (!draggable) {
    return (
      <div {...rest} className={`${styles.sticker} ${className}`} aria-hidden="true">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      {...rest}
      className={`${styles.sticker} ${styles.draggable} ${className}`}
      aria-hidden="true"
      drag
      dragMomentum
      dragElastic={0.12}
      initial={false}
      animate={{ x: at.x, y: at.y }}
      onDragEnd={(_, info) => setPosition(id, { x: at.x + info.offset.x, y: at.y + info.offset.y })}
      whileDrag={{ scale: 1.06, zIndex: 50 }}
    >
      {children}
    </motion.div>
  );
}
