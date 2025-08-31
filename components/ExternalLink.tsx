import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

export function ExternalLink(
  props: React.ComponentProps<typeof TouchableOpacity> & { href: string }
) {
  return (
    <TouchableOpacity
      {...props}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href);
        } else {
          // On web, use window.open to open in new tab
          window.open(props.href, '_blank');
        }
      }}
    />
  );
}
