import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({ children, delay = 0 }) {
  const reduced = useReducedMotion();
  if (reduced) return children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.28, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}
