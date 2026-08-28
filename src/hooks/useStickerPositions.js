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
    setPositions((prev) => {
      const next = { ...prev, [id]: pos };
      write(next);
      return next;
    });
  }, []);

  return { positions, setPosition };
}
