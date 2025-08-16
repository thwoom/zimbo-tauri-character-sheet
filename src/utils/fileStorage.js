export async function saveFile(name, contents) {
  if (window.__TAURI__) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke('write_file', { path: name, contents });
  }

  try {
    localStorage.setItem(name, contents);
  } catch (error) {
    console.error('Failed to save file to localStorage', name, error);
    const blob = new Blob([contents], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export async function loadFile(name) {
  if (window.__TAURI__) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke('read_file', { path: name });
  }

  try {
    const item = localStorage.getItem(name);
    if (item !== null) return item;
  } catch (error) {
    console.error('Failed to load file from localStorage', name, error);
  }

  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    const cleanup = () => {
      input.removeEventListener('change', onChange);
      input.removeEventListener('cancel', onCancel);
    };

    const onCancel = () => {
      cleanup();
      reject(new Error('File selection cancelled'));
    };

    const onChange = () => {
      cleanup();
      const file = input.files && input.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
      reader.readAsText(file);
    };

    input.addEventListener('change', onChange);
    input.addEventListener('cancel', onCancel);
    input.click();
  });
}
