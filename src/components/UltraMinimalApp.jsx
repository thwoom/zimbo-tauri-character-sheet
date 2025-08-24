import BasicTest from './BasicTest';

const UltraMinimalApp = () => {
  console.log('UltraMinimalApp: Rendering...');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0d17' }}>
      <BasicTest />
    </div>
  );
};

export default UltraMinimalApp;

