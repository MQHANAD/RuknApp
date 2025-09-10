import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Test</Text>
      <View style={styles.card} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  title: {
    color: '#F5A623',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#1E2A38',
    borderColor: '#db941d',
    padding: 16,
    margin: 12,
  },
  button: {
    backgroundColor: '#fbb507',
    color: '#000000',
  },
  placeholder: {
    placeholderTextColor: '#999',
  }
});

export default TestComponent;