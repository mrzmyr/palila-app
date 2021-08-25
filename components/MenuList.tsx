import React from 'react';
import { View } from 'react-native';

export default ({ children }) => {
  return (
    <View
      style={{
        // marginTop: 25,
        backgroundColor: '#FFF',
        borderRadius: 10,
      }}
    >{children}</View>
  )
};
