import React from 'react';
import { Pressable, Text } from 'react-native';
import Colors from '../constants/Colors';

export default ({ onPress, title, style = {} }) => (
  <Pressable
    style={({ pressed }) => [{
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: Colors.light.codes.period,
      opacity: pressed ? 0.8 : 1,
      borderRadius: 10,
    }, style]}
    onPress={onPress}
  >
    <Text style={{ 
      textAlign: 'center', 
      fontSize: 18,
      color: '#FFF',
      fontWeight: 'bold'
    }}>{title}</Text>
  </Pressable>
)
