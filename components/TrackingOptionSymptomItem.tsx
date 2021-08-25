import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { get } from '../constants/Icons';

export default function TrackingOptionSymptomItem({ type, symptoms }) {
  const { t } = useTranslation();

  let key = type === 'bleeding' ? `tracking_option_bleeding_${symptoms.bleeding}` : `tracking_option_${type}`;
  let symptom_type_key = type.split('_')[0];

  return (
    <View key={key} style={styles.container}>
      <View style={[styles.iconContainer, { borderColor: Colors.light.trackingOptions[symptom_type_key] }]}>{get(key, { size: 16 })}</View>
      <Text style={[styles.text]}>{t(`common_${key}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center",
    width: "50%",
    marginBottom: 15,
  },
  iconContainer: {
    padding: 5,
    borderRadius: 5,
    borderColor: '#FFF',
    borderStyle: "solid",
    borderWidth: 2,
    marginRight: 5,
    flexBasis: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
  },
});
