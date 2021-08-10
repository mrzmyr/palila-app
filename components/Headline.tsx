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
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 25,
    paddingBottom: 15,
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
