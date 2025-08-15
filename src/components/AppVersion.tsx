import React, { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';

function AppVersion() {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    getVersion().then((v) => {
      if (isMounted) setVersion(v);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!version) {
    return null;
  }

  return <div>Version: {version}</div>;
}

export default AppVersion;
