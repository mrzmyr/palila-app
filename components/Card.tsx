import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Card({ children, style = {} }) {
  return (
    <View style={[styles.cardContainer, style]}>{children}</View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
  },
})
