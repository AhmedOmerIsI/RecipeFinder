// src/components/FilterComponent.js

import React, { useState } from 'react';
import { View } from 'react-native';
import { Chip, Subheading } from 'react-native-paper';

export default function FilterComponent({ filters, setFilters }) {
  const toggleFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  return (
    <View style={{ padding: 10 }}>
      <Subheading>Cuisine Type</Subheading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip
          mode="outlined"
          selected={filters.cuisine.includes('Italian')}
          onPress={() => toggleFilter('cuisine', 'Italian')}
        >
          Italian
        </Chip>
        <Chip
          mode="outlined"
          selected={filters.cuisine.includes('Chinese')}
          onPress={() => toggleFilter('cuisine', 'Chinese')}
        >
          Chinese
        </Chip>
        {/* Add more cuisines as needed */}
      </View>

      <Subheading>Meal Type</Subheading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip
          mode="outlined"
          selected={filters.mealType.includes('Breakfast')}
          onPress={() => toggleFilter('mealType', 'Breakfast')}
        >
          Breakfast
        </Chip>
        <Chip
          mode="outlined"
          selected={filters.mealType.includes('Lunch')}
          onPress={() => toggleFilter('mealType', 'Lunch')}
        >
          Lunch
        </Chip>
        {/* Add more meal types as needed */}
      </View>

      <Subheading>Dietary Preferences</Subheading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip
          mode="outlined"
          selected={filters.dietary.includes('Vegetarian')}
          onPress={() => toggleFilter('dietary', 'Vegetarian')}
        >
          Vegetarian
        </Chip>
        <Chip
          mode="outlined"
          selected={filters.dietary.includes('Vegan')}
          onPress={() => toggleFilter('dietary', 'Vegan')}
        >
          Vegan
        </Chip>
        {/* Add more dietary preferences as needed */}
      </View>
    </View>
  );
}
