import React, { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

/* ------------------------------------------------------------
   GOOGLE SIGN-IN
   Loads Google Identity Services (script tag added in public/index.html)
   and renders the official Google button. On success, sends the ID
   token credential to POST /auth/google — the backend verifies it
   with Google directly (see routes/auth.js) and returns the same
   {user, token} shape as normal login/register.
   Requires REACT_APP_GOOGLE_CLIENT_ID at build time.
   ------------------------------------------------------------ */
export function GoogleSignInButton({ go }) {
  const { loginWithGoogle } = useAuth();
  const toast = useToast();
  const buttonRef = useRef(null);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const handleCredential = async (response) => {
      try {
        await loginWithGoogle(response.credential);
        toast.push("Welcome to SHINEX!", "success");
        go("home");
      } catch (e) {
        toast.push(e.message, "error");
      }
    };

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 336,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      // The GSI script (public/index.html) may not have finished loading yet.
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderButton();
        }
      }, 200);
      return () => clearInterval(interval);
    }
   
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div ref={buttonRef} className="flex justify-center" />
    </div>
  );
}
