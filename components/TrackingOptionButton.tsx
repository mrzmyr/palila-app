import * as React from 'react';
import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../constants/Colors";

import * as Haptics from 'expo-haptics';

export default function TrackingOptionButton({ style, stylePressed = {}, styleLabel = {}, onPress, icon, label = null }) {
  return (
    <View style={styles.buttonOptionContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonOption, 
          ...style,
          pressed ? stylePressed ? stylePressed : { opacity: 0.1 } : {}
        ]}
        onPressIn={() => {
          Haptics.selectionAsync()
        }}
        onPress={() => {
          onPress()
        }}
      >
        <Text style={[styles.buttonOptionText]}>
          {icon}
        </Text>
      </Pressable>
      {label && <Text style={[styles.buttonOptionLabel, styleLabel]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  buttonOption: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    borderColor: '#FFF',
    borderStyle: "solid",
    borderWidth: 3,
    backgroundColor: '#FFF',
    flex: 1,
    flexBasis: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOptionSelected: {
    borderColor: Colors.light.codes.period,
    borderStyle: "solid",
  },
  buttonOptionText: {
    textAlign: 'center',
    width: "100%",
    padding: 5,
  },
  buttonOptionLabel: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
  },
});
