import { useEffect, useRef, useState } from 'react';
import { api, tokenStore } from '../api/client';

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Google Sign-In could not load.'));
    document.head.appendChild(script);
  });
}

export default function GoogleSignIn({ onSuccess, onError, disabled = false }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let active = true;
    if (!clientId) {
      onError?.(new Error('Google Sign-In is not configured for this frontend yet.'));
      return undefined;
    }
    loadGoogleScript()
      .then(() => {
        if (!active || !window.google?.accounts?.id || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              const result = await api('/auth/google', {
                method: 'POST',
                body: { credential }
              });
              tokenStore.set(result.data.token);
              onSuccess?.(result.data.user);
            } catch (error) {
              onError?.(error);
            }
          },
          ux_mode: 'popup',
          auto_select: false
        });
        containerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          width: Math.min(400, Math.max(280, containerRef.current.clientWidth || 400)),
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });
        setReady(true);
      })
      .catch((error) => onError?.(error));
    return () => { active = false; };
  }, [clientId, onError, onSuccess]);

  return (
    <div className={`google-auth ${disabled || !ready ? 'is-disabled' : ''}`} aria-busy={!ready}>
      <div ref={containerRef} className="google-auth-button" aria-label="Continue with Google" />
    </div>
  );
}
