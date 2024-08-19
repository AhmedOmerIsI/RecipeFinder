import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert, StyleSheet, Share } from 'react-native';
import axios from 'axios';
import { Button, IconButton } from 'react-native-paper';
import { FavoritesContext } from '../context/FavoritesContext';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [mealDetails, setMealDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        setMealDetails(response.data.meals[0]);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load meal details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [recipeId]);

  const toggleFavorite = () => {
    if (isFavorite(mealDetails.idMeal)) {
      removeFavorite(mealDetails.idMeal);
      Alert.alert('Removed from favorites', 'Recipe removed from favorites.');
    } else {
      addFavorite(mealDetails);
      Alert.alert('Added to favorites', 'Recipe added to favorites.');
    }
  };

  const shareRecipe = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${mealDetails.strMeal}\n\n${mealDetails.strSource || 'No link available'}`,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!mealDetails) {
    return <Text>No details available for this meal.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: mealDetails.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{mealDetails.strMeal}</Text>
      <Text style={styles.subtitle}>Category: {mealDetails.strCategory}</Text>
      <Text style={styles.subtitle}>Cuisine: {mealDetails.strArea}</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {Array.from({ length: 20 }).map((_, index) => {
        const ingredient = mealDetails[`strIngredient${index + 1}`];
        const measure = mealDetails[`strMeasure${index + 1}`];
        return ingredient ? (
          <Text key={index} style={styles.ingredient}>
            {measure} {ingredient}
          </Text>
        ) : null;
      })}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{mealDetails.strInstructions}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.iconButtonsContainer}>
          <IconButton
            icon={isFavorite(mealDetails.idMeal) ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite(mealDetails.idMeal) ? 'red' : '#333'}
            onPress={toggleFavorite}
            style={styles.iconButton}
          />
          <IconButton
            icon="share-variant"
            size={24}
            color="#333"
            onPress={shareRecipe}
            style={styles.iconButton}
          />
        </View>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back to Results
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  ingredient: {
    fontSize: 16,
    marginVertical: 2,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  backButton: {
    width: '60%',
    paddingVertical: 10,
    borderRadius: 20,
  },
});
