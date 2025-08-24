const SimpleTest = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'red',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        zIndex: 10000,
        fontSize: '18px',
        fontWeight: 'bold',
      }}
    >
      🚨 SIMPLE TEST - If you see this, React is working!
    </div>
  );
};

export default SimpleTest;
