import React from 'react';
import { css } from '../styled-system/css';

const Navigation = () => {
  const currentPath = window.location.pathname;

  const navStyle = css({
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 100,
    display: 'flex',
    gap: 'sm',
    padding: 'sm',
    backgroundColor: 'rgba(2, 30, 38, 0.8)',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'primary',
  });

  const linkStyle = (isActive) =>
    css({
      padding: 'xs md',
      color: isActive ? 'background' : 'primary',
      backgroundColor: isActive ? 'primary' : 'transparent',
      border: '1px solid',
      borderColor: 'primary',
      borderRadius: 'sm',
      textDecoration: 'none',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: isActive ? 'primary' : 'rgba(0, 217, 255, 0.1)',
      },
    });

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <nav className={navStyle}>
      <a
        href="/"
        className={linkStyle(currentPath === '/')}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        Main App
      </a>
      <a
        href="/fx-demo"
        className={linkStyle(currentPath === '/fx-demo')}
        onClick={(e) => {
          e.preventDefault();
          navigate('/fx-demo');
        }}
      >
        FX Demo
      </a>
      {import.meta.env.DEV && (
        <a
          href="/dev/components"
          className={linkStyle(currentPath === '/dev/components')}
          onClick={(e) => {
            e.preventDefault();
            navigate('/dev/components');
          }}
        >
          Dev Components
        </a>
      )}
    </nav>
  );
};

export default Navigation;
