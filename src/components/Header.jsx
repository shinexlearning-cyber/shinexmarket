import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from './Icons';

export default function Header({ title, onBack, right }) {
  const navigate = useNavigate();
  return (
    <header className="shx-header">
      {onBack !== null && (
        <button className="shx-header__icon-btn" onClick={onBack || (() => navigate(-1))} aria-label="Go back">
          <ChevronLeftIcon width={20} height={20} />
        </button>
      )}
      <h1 className="shx-header__title">{title}</h1>
      {right}
    </header>
  );
}
