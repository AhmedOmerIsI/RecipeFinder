import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
export const FavoritesContext = createContext();

// Create the provider component
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error(error);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (recipe) => {
    try {
      const updatedFavorites = [...favorites, recipe];
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.idMeal !== recipeId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
