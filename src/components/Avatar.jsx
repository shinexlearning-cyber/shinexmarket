import { initials } from '../utils/format';

export default function Avatar({ src, name, size = 40 }) {
  const style = { width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 };
  if (src) return <img src={src} alt={name || 'Avatar'} style={style} />;
  return (
    <div style={{ ...style, background: 'var(--shx-green-100)', color: 'var(--shx-green-700)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: size * 0.38 }}>
      {initials(name)}
    </div>
  );
}
