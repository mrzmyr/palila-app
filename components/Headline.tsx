import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Headline({ level = 3, children, ...props }) {
  return (
    <View {...props} style={[styles.headlineContainer, props.style]}>
      <Text style={{...styles.headline, ...styles[`headlineLevel${level}`]}}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headlineContainer: {
    paddingTop: 25,
    paddingBottom: 15,
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headlineLevel1: {
    fontSize: 32,
  },
  headlineLevel2: {
    fontSize: 21,
  },
  headlineLevel3: {
    fontSize: 18,
  },
})
