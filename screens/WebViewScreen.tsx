import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View, Text } from 'react-native';
import WebView from 'react-native-webview';

export default function WebViewScreen({ route }) {
  
  const [loading, setLoading] = useState(true);
  
  const { uri } = route.params;
  
  return (
    <View style={[styles.container, styles.horizontal]}>
      <WebView 
        source={{ uri }} 
        onLoadEnd={() => {
          setLoading(false)
        }}
      />
      {loading && <ActivityIndicator color="#000" size="large" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  horizontal: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
  },
});
