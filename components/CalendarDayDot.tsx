import React from "react";
import { View } from "react-native";

export default ({ color }) => {
  return (
      <View style={{
        marginRight: 1,
        marginLeft: 1,
        borderRadius: 5,
        width: 10,
        height: 10,
        backgroundColor: color,
      }}></View>
  );
}