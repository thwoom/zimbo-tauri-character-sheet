import { getVersion } from '@tauri-apps/api/app';
import React, { useEffect, useState } from 'react';

function AppVersion() {
  const [version, setVersion] = useState<string>('Version unavailable');

  useEffect(() => {
    let isMounted = true;
    const fetchVersion = async () => {
      try {
        const v = await getVersion();
        if (isMounted) setVersion(v);
      } catch {
        if (isMounted) setVersion('Version unavailable');
      }
    };
    fetchVersion();
    return () => {
      isMounted = false;
    };
  }, []);

  return <div>Version: {version}</div>;
}

export default AppVersion;
