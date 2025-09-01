import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour le debouncing d'une valeur
 * @param {any} value - La valeur à débouncer
 * @param {number} delay - Le délai en millisecondes
 * @returns {any} - La valeur débouncée
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timer qui mettra à jour la valeur débouncée après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si value change (ou si le composant se démonte)
    // Ceci évite que la valeur débouncée soit mise à jour si value change dans le délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;