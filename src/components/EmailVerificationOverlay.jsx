import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import confetti from '../assets/confetti.json';

const EmailVerificationOverlay = ({ email, onClose, onResend }) => {
  const [cooldown, setCooldown] = useState(0);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    try {
      await onResend();
      setCooldown(60);
    } catch (e) {
      const ms = e?.cooldownMs ? Math.ceil(e.cooldownMs / 1000) : 60;
      setCooldown(ms);
    }
  };

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', width: 'min(520px, 90vw)', borderRadius: 12, position: 'relative' }}>
        <button ref={closeBtnRef} onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 12, top: 12, background: 'transparent', border: 0, fontSize: 18, cursor: 'pointer' }}>✕</button>
        <Lottie animationData={confetti} loop={false} style={{ height: 160 }} />
        <h3 style={{ marginTop: 16 }}>Check your email</h3>
        <p>We sent a verification link to <strong>{email}</strong>. Please verify to continue.</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button onClick={handleResend} disabled={cooldown > 0} className="register-btn">
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
          </button>
          <button onClick={onClose} className="login-btn">I'll verify later</button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationOverlay;


