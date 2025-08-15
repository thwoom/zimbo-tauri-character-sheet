import React, { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';

const styles = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#0f0',
  padding: '8px',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: 9999,
};

export default function DiagnosticOverlay({ hudMounted }) {
  const [version, setVersion] = useState('');

  useEffect(() => {
    let mounted = true;
    getVersion().then((v) => {
      if (mounted) setVersion(v);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;

  return (
    <div style={styles}>
      <div>Version: {version}</div>
      <div>Build: {buildTimestamp}</div>
      <div>HUD: {hudMounted ? 'mounted' : 'not mounted'}</div>
    </div>
  );
}
