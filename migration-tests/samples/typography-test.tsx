import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypographyTest = () => {
  return (
    <View>
      <Text style={styles.display}>Display Text</Text>
      <Text style={styles.heading}>Heading Text</Text>
      <Text style={styles.body}>Body Text</Text>
      <Text style={styles.caption}>Caption Text</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
  },
  small: {
    fontSize: 9,
    fontWeight: '700',
  }
});

export default TypographyTest;