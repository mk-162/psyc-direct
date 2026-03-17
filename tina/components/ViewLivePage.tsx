import React from 'react';

interface ViewLivePageProps {
  url?: string;
}

export const ViewLivePage: React.FC<ViewLivePageProps> = ({ url }) => {
  if (!url) {
    return (
      <div style={{
        padding: '12px 16px',
        background: '#f5f5f5',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '12px',
        color: '#666',
        border: '1px solid #e0e0e0',
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          📎 Live Preview
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '11px' }}>
          Add a Canonical URL to enable live preview button.
        </p>
      </div>
    );
  }

  const fullUrl = url.startsWith('http') 
    ? url 
    : `https://cocoonwellness.com${url}`;

  return (
    <div style={{
      padding: '16px',
      background: 'linear-gradient(135deg, #1e3a2f 0%, #2d4a3e 100%)',
      borderRadius: '6px',
      marginBottom: '20px',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <p style={{ 
        margin: '0 0 10px 0', 
        fontSize: '11px', 
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        opacity: 0.7,
        fontWeight: 500,
      }}>
        Canonical URL
      </p>
      <code style={{
        display: 'block',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.25)',
        padding: '8px 10px',
        borderRadius: '4px',
        marginBottom: '14px',
        wordBreak: 'break-all',
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'monospace',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {url}
      </code>
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#1e3a2f',
          background: '#c4a87c',
          padding: '10px 16px',
          borderRadius: '4px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#d4b88c';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#c4a87c';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        View Live Page
      </a>
    </div>
  );
};

export default ViewLivePage;
