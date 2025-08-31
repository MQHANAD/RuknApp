import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetwork } from '../src/context/NetworkContext';

export const OfflineStatusIndicator: React.FC = () => {
  const { networkState, isLoading } = useNetwork();
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!networkState.isInternetReachable && !isLoading) {
      // Slide in animation when offline
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out animation when online
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [networkState.isInternetReachable, isLoading, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0], // Slide down from top
  });

  if (networkState.isInternetReachable || isLoading) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.content}>
        <Text style={styles.text}>⚠️ You are currently offline</Text>
        <Text style={styles.subtext}>Some features may be limited</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff6b6b',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  subtext: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default OfflineStatusIndicator;