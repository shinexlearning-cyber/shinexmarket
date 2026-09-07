import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    title: 'Discover amazing products',
    desc: 'Find the best deals from trusted sellers around the world.',
    art: '🛍️'
  },
  {
    title: 'Sell your products',
    desc: 'Reach thousands of buyers and grow your business.',
    art: '📦'
  },
  {
    title: 'Safe & secure',
    desc: 'Secure payments, verified sellers and trusted transactions.',
    art: '🛡️'
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    localStorage.setItem('shinex_onboarded', '1');
    navigate('/register', { replace: true });
  };

  const slide = SLIDES[step];

  return (
    <div className="shx-app" style={{ background: 'linear-gradient(180deg, #0B3D24, #06210F)', minHeight: '100vh', color: '#fff' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96 }}>
          {slide.art}
        </div>
        <div className="shx-container" style={{ paddingBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>{slide.title}</h1>
          <p style={{ color: '#BFE3CC', fontSize: 14.5, lineHeight: 1.5, marginBottom: 24 }}>{slide.desc}</p>
          <div className="shx-flex shx-gap-8" style={{ justifyContent: 'center', marginBottom: 24 }}>
            {SLIDES.map((_, i) => (
              <span key={i} style={{
                height: 6, borderRadius: 3, transition: 'width .2s',
                width: i === step ? 28 : 8,
                background: i === step ? 'var(--shx-green-400)' : 'rgba(255,255,255,0.3)'
              }} />
            ))}
          </div>
          <button className="shx-btn shx-btn--primary" onClick={() => (isLast ? finish() : setStep((s) => s + 1))}>
            {isLast ? 'Get started' : 'Next'}
          </button>
          {!isLast && (
            <button className="shx-btn shx-btn--ghost" style={{ color: '#BFE3CC', width: '100%', marginTop: 4 }} onClick={finish}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
