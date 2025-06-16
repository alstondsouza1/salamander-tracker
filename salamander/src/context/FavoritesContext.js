"use client";

import { createContext, useContext, useEffect, useState } from "react";

// create a new context object for favorites
const FavoritesContext = createContext();

// provider component to manage favorites state and actions
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // load favorites from localStorage on initial render
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  // save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // toggle favorite state for a video
  const toggleFavorite = (video) => {
    setFavorites((prev) =>
      prev.includes(video)
        ? prev.filter((v) => v !== video)
        : [...prev, video]
    );
  };

  const isFavorite = (video) => favorites.includes(video);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// custom hook to access favorites context
export const useFavorites = () => useContext(FavoritesContext);