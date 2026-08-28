import Slab from '../Slab/Slab.jsx';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const index = `(01.${String(project.id).padStart(2, '0')})`;

  return (
    <Slab
      as="article"
      fill={project.fill}
      shadow="l"
      tilt={project.rotate}
      interactive
      className={styles.card}
    >
      <p className={styles.index}>{index}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.desc}>{project.desc}</p>
      <ul className={styles.tags}>
        {project.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </Slab>
  );
}
