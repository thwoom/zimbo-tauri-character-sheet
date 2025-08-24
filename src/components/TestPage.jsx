const TestPage = () => {
  console.log('🚨 TEST PAGE COMPONENT LOADED! 🚨');

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ffff00)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '20px' }}>🚨 TEST PAGE WORKING! 🚨</div>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        If you can see this, React is working!
      </div>
      <div style={{ fontSize: '18px', textAlign: 'center', maxWidth: '600px' }}>
        This bright, colorful page should be impossible to miss.
        <br />
        If you're still seeing the old app, there's a serious caching issue.
      </div>
    </div>
  );
};

export default TestPage;
