import React from 'react';

const Navigation = () => {
  const currentPath = window.location.pathname;

  const navStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 100,
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(2, 30, 38, 0.8)',
    borderRadius: '4px',
    border: '1px solid #00d9ff',
  };

  const linkStyle = (isActive) => ({
    padding: '0.25rem 1rem',
    color: isActive ? '#001114' : '#00d9ff',
    backgroundColor: isActive ? '#00d9ff' : 'transparent',
    border: '1px solid #00d9ff',
    borderRadius: '2px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  });

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <nav style={navStyle}>
      <a
        href="/"
        style={linkStyle(currentPath === '/')}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
        onMouseEnter={(e) => {
          if (currentPath !== '/') {
            e.target.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPath !== '/') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        Main App
      </a>
      <a
        href="/fx-demo"
        style={linkStyle(currentPath === '/fx-demo')}
        onClick={(e) => {
          e.preventDefault();
          navigate('/fx-demo');
        }}
        onMouseEnter={(e) => {
          if (currentPath !== '/fx-demo') {
            e.target.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPath !== '/fx-demo') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        FX Demo
      </a>
      {import.meta.env.DEV && (
        <a
          href="/dev/components"
          style={linkStyle(currentPath === '/dev/components')}
          onClick={(e) => {
            e.preventDefault();
            navigate('/dev/components');
          }}
          onMouseEnter={(e) => {
            if (currentPath !== '/dev/components') {
              e.target.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPath !== '/dev/components') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          Dev Components
        </a>
      )}
    </nav>
  );
};

export default Navigation;
