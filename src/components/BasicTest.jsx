import React from 'react';

const BasicTest = () => {
  console.log('BasicTest: Rendering...');

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#0b0d17',
        color: '#d0d7e2',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#64f1e1', marginBottom: '20px' }}>Basic Test - Working!</h1>
      <p>If you can see this, the basic React setup is working.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <p>React Version: {React.version}</p>
    </div>
  );
};

export default BasicTest;

