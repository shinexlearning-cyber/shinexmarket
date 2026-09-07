// Minimal inline icon set (no external icon package) — keeps bundle small
// and lets every icon inherit currentColor.
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const HomeIcon = (p) => <svg {...base} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
export const GridIcon = (p) => <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
export const PlusCircleIcon = (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const BellIcon = (p) => <svg {...base} {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
export const UserIcon = (p) => <svg {...base} {...p}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" /></svg>;
export const SearchIcon = (p) => <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
export const HeartIcon = ({ filled, ...p }) => <svg {...base} fill={filled ? 'currentColor' : 'none'} {...p}><path d="M12 20s-7-4.4-9.5-8.8C.7 7.6 2.4 4 6 4c2.1 0 3.6 1.2 6 3.6C14.4 5.2 15.9 4 18 4c3.6 0 5.3 3.6 3.5 7.2C19 15.6 12 20 12 20Z" /></svg>;
export const ChevronLeftIcon = (p) => <svg {...base} {...p}><path d="m15 18-6-6 6-6" /></svg>;
export const ChevronRightIcon = (p) => <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>;
export const ShareIcon = (p) => <svg {...base} {...p}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></svg>;
export const WhatsAppIcon = (p) => <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.6 2.4 3.8 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" /></svg>;
export const CameraIcon = (p) => <svg {...base} {...p}><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" /><circle cx="12" cy="13.5" r="3.2" /></svg>;
export const CheckIcon = (p) => <svg {...base} {...p}><path d="m5 13 4 4L19 7" /></svg>;
export const XIcon = (p) => <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
export const EditIcon = (p) => <svg {...base} {...p}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>;
export const TrashIcon = (p) => <svg {...base} {...p}><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" /></svg>;
export const ShieldIcon = (p) => <svg {...base} {...p}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" /></svg>;
export const LogoutIcon = (p) => <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>;
export const StoreIcon = (p) => <svg {...base} {...p}><path d="M3 9 4.5 4h15L21 9" /><path d="M4 9v11h16V9" /><path d="M9.5 20v-6h5v6" /></svg>;
export const MegaphoneIcon = (p) => <svg {...base} {...p}><path d="M3 11v3a1 1 0 0 0 1 1h2l2 5h2l-1.3-5H12l7 3V6l-7 3H3Z" /></svg>;
export const StarIcon = (p) => <svg {...base} {...p}><path d="m12 3 2.6 5.6 6.2.6-4.6 4.2 1.3 6.1L12 16.9 6.5 19.5l1.3-6.1L3.2 9.2l6.2-.6Z" /></svg>;
export const FilterIcon = (p) => <svg {...base} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
export const WalletIcon = (p) => <svg {...base} {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 13h2M3 10h18" /></svg>;
export const CrownIcon = (p) => <svg {...base} {...p}><path d="m3 8 4 3 5-6 5 6 4-3-2 10H5Z" /></svg>;
export const FlagIcon = (p) => <svg {...base} {...p}><path d="M5 3v18" /><path d="M5 4h13l-2 4 2 4H5" /></svg>;
export const MailIcon = (p) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
export const ChevronDownIcon = (p) => <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>;
export const EyeIcon = (p) => <svg {...base} {...p}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const EyeOffIcon = (p) => <svg {...base} {...p}><path d="M3 3l18 18" /><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.8 16.8 0 0 0 1.5 12S5 19 12 19a10.6 10.6 0 0 0 4-.8" /><path d="M9.5 9.7A3.2 3.2 0 0 0 12 15.2a3.2 3.2 0 0 0 2.3-1" /></svg>;
