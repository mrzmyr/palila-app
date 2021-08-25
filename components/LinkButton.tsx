import React from 'react';
import { Pressable, Text } from 'react-native';
import Colors from '../constants/Colors';

export default ({ title, onPress, icon = null }) => (
  <Pressable 
    style={({ pressed }) => [{ 
      alignItems: 'center', 
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 0,
      paddingRight: 5,
      marginBottom: 20, 
      opacity: pressed ? 0.5 : 1,
      flexDirection: 'row',
      justifyContent: 'center',
    }]}
    onPress={onPress}
  >
    {icon}
    <Text style={{ marginLeft: 5, fontSize: 18, color: Colors.light.codes.period }}>{title}</Text>
  </Pressable>
)
