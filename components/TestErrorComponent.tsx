import React from 'react';
import { View, Button, Text } from 'react-native';

interface TestErrorComponentProps {
  throwError?: boolean;
}

export const TestErrorComponent: React.FC<TestErrorComponentProps> = ({ throwError = false }) => {
  if (throwError) {
    throw new Error('This is a test error to check ErrorBoundary functionality!');
  }

  return (
    <View>
      <Text>This is a test component. Enable "throwError" prop to simulate an error.</Text>
    </View>
  );
};

export default TestErrorComponent;