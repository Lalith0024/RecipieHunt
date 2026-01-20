import React from 'react';

const ApiErrorUI = ({ type }) => {
  const isLimit = type === 'limit';

  return (
    <div className="api-error-card" style={{
      padding: '100px 40px',
      textAlign: 'center',
      background: 'rgba(252, 128, 25, 0.02)',
      borderRadius: '50px',
      margin: '60px auto',
      maxWidth: '900px',
      border: '2px dashed rgba(252, 128, 25, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes pulseIcon {
            0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(252, 128, 25, 0)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(252, 128, 25, 0.2)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(252, 128, 25, 0)); }
          }
          .sexy-icon { animation: pulseIcon 3s infinite ease-in-out; display: inline-block; }
          .api-error-card { animation: fadeIn 0.8s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>
      <div className="sexy-icon" style={{ fontSize: '5rem', marginBottom: '30px' }}>
        {isLimit ? '⏳' : '🛠️'}
      </div>
      <h2 style={{
        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
        color: 'var(--text-main)',
        marginBottom: '20px',
        fontWeight: '900',
        letterSpacing: '-2px'
      }}>
        {isLimit ? "Chef's are Restocking!" : "Kitchen Maintenance"}
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        maxWidth: '550px',
        margin: '0 auto 40px',
        fontWeight: '500'
      }}>
        {isLimit
          ? "We've had a busy day in the digital kitchen and reached our daily recipe limit. Please swing by in a while!"
          : "We're currently fine-tuning our secret recipes. This feature will be back in the oven in no time."}
      </p>
      <div style={{
        display: 'inline-block',
        padding: '16px 40px',
        background: 'var(--text-main)',
        color: '#fff',
        borderRadius: '100px',
        fontWeight: '900',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        boxShadow: '0 20px 40px rgba(40, 44, 63, 0.2)'
      }}>
        Professional Service
      </div>
    </div>
  );
};

export default ApiErrorUI;
