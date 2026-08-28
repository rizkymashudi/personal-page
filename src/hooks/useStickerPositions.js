import { useCallback, useState } from 'react';

const KEY = 'rm.stickers';

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function write(value) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* quota, private mode, or blocked site data — positions just don't persist */
  }
}

export default function useStickerPositions() {
  const [positions, setPositions] = useState(read);

  const setPosition = useCallback((id, pos) => {
    const next = { ...read(), [id]: pos };
    write(next);
    setPositions(next);
  }, []);

  return { positions, setPosition };
}
