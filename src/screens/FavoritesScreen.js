import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        // Parse and filter out any null or undefined items
        const parsedFavorites = JSON.parse(savedFavorites).filter(item => item && item.idMeal);
        setFavorites(parsedFavorites);

        // Update AsyncStorage to ensure no invalid items are stored
        await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load favorites.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFavoriteItem = ({ item }) => {
    // Check if the item is valid before rendering
    if (!item || !item.idMeal) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.favoriteItem}
        onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
      >
        <Image source={{ uri: item.strMealThumb }} style={styles.favoriteImage} />
        <Text style={styles.favoriteTitle}>{item.strMeal}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.listContent}
          extraData={favorites}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: hp('1%'),
  },
  favoriteImage: {
    width: wp('20%'),
    height: hp('10%'),
    borderRadius: wp('2%'),
    marginRight: wp('4%'),
  },
  favoriteTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: hp('5%'),
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
});
