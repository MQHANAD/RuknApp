import React from 'react';
import { View, StyleSheet } from 'react-native';

const SpacingTest = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card} />
      <View style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 16,
    gap: 8,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    margin: 8,
    width: 48,
    height: 32,
  },
  large: {
    padding: 30,
    margin: 18,
  }
});

export default SpacingTest;