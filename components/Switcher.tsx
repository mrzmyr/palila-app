import React from 'react';
import { View, Text, Switch } from 'react-native';
import Colors from '../constants/Colors';

export default ({ title, onValueChange, value }) => (
  <View style={{
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    marginBottom: 10,
  }}>
    <Text style={{ fontSize: 18 }}>{title}</Text>
    <Switch
      trackColor={{ true: Colors.light.codes.period }}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
)
