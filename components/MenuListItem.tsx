import React from 'react';
import { Text, View, Pressable } from 'react-native';

export default ({ title, onPress, icon = null }) => {
  return (
    <View
      style={{
        // marginBottom: 5,
        // backgroundColor: 'red',
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(0,0,0,0.1)',
        marginRight: 20,
        marginLeft: 20,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 15,
          paddingBottom: 15,
          opacity: pressed ? 0.5 : 1,
        }]}
      >
      <Text style={{
        fontSize: 16,
       }}>{title}</Text>
      <View style={{ }}>{icon}</View>
      </Pressable>
    </View>
  )
};