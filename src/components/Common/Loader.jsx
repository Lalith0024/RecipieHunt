import React from 'react';

const Loader = ({ fullPage = false, message = "Gathering culinary magic..." }) => {
  const loaderStyle = fullPage ? {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-white)',
    zIndex: 999
  } : {
    padding: '100px 0',
    textAlign: 'center'
  };

  return (
    <div className="loader-container" style={loaderStyle}>
      <div className="loader-spinner" style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
        fontFamily: 'Outfit, sans-serif'
      }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
