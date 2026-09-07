// Clean SVG rebuild of the SHINEX mark from the brand reference: an "S"
// formed with a shopping-cart handle, on a rounded dark tile.
export default function ShinexLogo({ size = 96, tile = true }) {
  const mark = (
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48" fill="none">
      <path d="M32 10c-6 0-9 3-9 7s3 6 8 7.5c5 1.5 7 3 7 6s-3 5-8 5c-4.5 0-7.5-1.7-9-4.5"
        stroke="url(#shx-grad)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="37" r="2.4" fill="#fff" />
      <circle cx="24" cy="37" r="2.4" fill="#fff" />
      <path d="M9 15h3l2 14h11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="shx-grad" x1="23" y1="10" x2="39" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FC773" />
          <stop offset="1" stopColor="#1FAE5C" />
        </linearGradient>
      </defs>
    </svg>
  );
  if (!tile) return mark;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.26,
      background: 'linear-gradient(160deg, #12532F, #06210F)',
      display: 'grid', placeItems: 'center',
      boxShadow: '0 12px 30px rgba(6,33,15,0.45)'
    }}>
      {mark}
    </div>
  );
}
