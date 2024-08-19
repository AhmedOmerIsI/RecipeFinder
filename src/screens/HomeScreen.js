import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Share } from 'react-native';
import axios from 'axios';
import { IconButton } from 'react-native-paper';
import { FavoritesContext } from '../context/FavoritesContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchRecipesByCategory(selectedCategory);
    } else {
      fetchRecipes(); // Load popular dishes if no category is selected
    }
  }, [selectedCategory]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      setRecipes(response.data.meals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipesByCategory = async (category) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      setRecipes(response.data.meals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
      setRecipes(response.data.meals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.idMeal)) {
      removeFavorite(recipe.idMeal);
    } else {
      addFavorite(recipe);
    }
  };

  const shareRecipe = async (recipe) => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.strMeal}\n\n${recipe.strSource || 'No link available'}`,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
      <View style={styles.iconContainer}>
        <IconButton
          icon={isFavorite(item.idMeal) ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite(item.idMeal) ? 'red' : '#333'}
          onPress={() => toggleFavorite(item)}
          style={styles.favoriteIcon}
        />
        <IconButton
          icon="share-variant"
          size={20}
          color="#333"
          onPress={() => shareRecipe(item)}
          style={styles.shareIcon}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <IconButton
          icon="magnify"
          size={wp('4%')}
          onPress={handleSearch}
          style={styles.searchIcon}
        />
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryItem, selectedCategory === item.strCategory ? styles.selectedCategory : null]}
            onPress={() => setSelectedCategory(selectedCategory === item.strCategory ? null : item.strCategory)}
          >
            <Image source={{ uri: item.strCategoryThumb }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.strCategory}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.idCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />

      <Text style={styles.popularDishesText}>
        Popular Dishes{selectedCategory ? ` in ${selectedCategory}` : ''}
      </Text>

      <View style={styles.recipesContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.idMeal}
          />
        )}
      </View>
      
      <IconButton
        icon="heart"
        size={wp('8%')}
        color="#ff6347"
        onPress={() => navigation.navigate('Favorites')}
        style={styles.favoritesIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('4%'),
    paddingLeft: wp('4%'),
    paddingRight: wp('8%'),
  },
  searchIcon: {
    position: 'absolute',
    right: wp('2%'),
  },
  categoriesList: {
    maxHeight: 80,
    marginBottom: hp('2%'),
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: wp('1%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1%'),
    borderRadius: wp('2%'),
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#ff6347',
  },
  categoryImage: {
    width: wp('10%'),
    height: hp('5%'),
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  categoryText: {
    fontSize: wp('3%'),
    color: '#333',
    textAlign: 'center',
  },
  popularDishesText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  recipesContainer: {
    flex: 1,
  },
  recipeItem: {
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: hp('18%'),
    borderRadius: wp('3%'),
  },
  recipeTitle: {
    marginTop: hp('1%'),
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  favoriteIcon: {
    marginTop: hp('0.5%'),
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritesIcon: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('2%'),
  },iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  shareIcon: {
    marginLeft: wp('2%'),
  },
});
