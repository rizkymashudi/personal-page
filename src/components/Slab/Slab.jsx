import styles from './Slab.module.css';

export default function Slab({
  as: Tag = 'div',
  fill = 'cream',
  shadow = 'm',
  tilt = 0,
  interactive = false,
  className = '',
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`${styles.slab} ${className}`}
      data-fill={fill}
      data-shadow={shadow}
      data-interactive={interactive ? 'true' : undefined}
      style={{ '--tilt': `${tilt}deg`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
