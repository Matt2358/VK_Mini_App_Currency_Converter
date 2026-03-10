import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favoritePairs');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const addFavorite = (pair) => {
    const newFavorites = [...favorites, pair];
    setFavorites(newFavorites);
    localStorage.setItem('favoritePairs', JSON.stringify(newFavorites));
  };

  const removeFavorite = (pair) => {
    const newFavorites = favorites.filter(p => p.from !== pair.from || p.to !== pair.to);
    setFavorites(newFavorites);
    localStorage.setItem('favoritePairs', JSON.stringify(newFavorites));
  };

  return { favorites, addFavorite, removeFavorite };
}