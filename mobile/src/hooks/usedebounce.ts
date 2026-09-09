import { useEffect, useState } from 'react';

export function useDebounce<value>(input: value, delayMs = 300): value {
  const [debounced, setDebounced] = useState(input);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input), delayMs);
    return () => clearTimeout(timer);
  }, [input, delayMs]);

  return debounced;
}
