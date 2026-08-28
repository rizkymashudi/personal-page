import { useRef } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import { PROJECTS, SUBTITLE_TEXT } from '../../data/projects.js';
import styles from './WorkStrip.module.css';

const STEP = 320;

export default function WorkStrip() {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    ref.current.scrollBy({ left: e.key === 'ArrowRight' ? STEP : -STEP, behavior: 'smooth' });
  }

  function onPointerDown(e) {
    if (e.pointerType === 'touch') return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: ref.current.scrollLeft,
      moved: false,
    };
    ref.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.startScroll - dx;
  }

  function onPointerUp(e) {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (ref.current.hasPointerCapture(e.pointerId)) {
      ref.current.releasePointerCapture(e.pointerId);
    }
  }

  function onClickCapture(e) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <section id="work" className={styles.section}>
      <p className={styles.eyebrow}>(01) Featured work</p>
      <h2 className={styles.heading}>Selected projects</h2>
      <p className={styles.subtitle}>{SUBTITLE_TEXT}</p>

      <div
        ref={ref}
        role="region"
        aria-label="Featured work — scroll horizontally"
        tabIndex={0}
        className={styles.scroller}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
