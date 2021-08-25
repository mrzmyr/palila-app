import * as React from 'react';
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useTracking } from "../services/useTracking";

import { format } from 'date-fns';
import { TrackingEntry, DEFAULT_TRACKING_SYMPTOMS } from '../types/tracking';
import Colors from '../constants/Colors';

import CalendarDayDot from '../components/CalendarDayDot';
import Headline from '../components/Headline';

const BubbleLine = ({ color, label, description }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 }}>
      <View style={[{
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: color,
        marginRight: 10,
      }]} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
        <Text style={{ fontSize: 16, opacity: 0.6 }}>{description}</Text>
      </View>
    </View>
  )
}

const DotLine = ({ color, label, description }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 }}>
      <View style={[{
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }]}>
        <CalendarDayDot color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
        <Text style={{ fontSize: 16, opacity: 0.6 }}>{description}</Text>
      </View>
    </View>
  )
}

export default function CalendarScreenQuick() {

  const { dispatch, state } = useTracking();

  return (
    <ScrollView style={styles.container}>
      <Headline>Day Marks</Headline>
      <BubbleLine color={Colors.light.codes.period} label="Period" description="This color marks days with tracked menstruation" /> 
      <BubbleLine color={Colors.light.codes.periodPrediction} label="Period Prediction" description="This color marks a day with menstruation prediction" /> 
      <BubbleLine color={Colors.light.codes.fertilityPrediction} label="Fertility Window Prediction" description="This color marks a day with prediction of the fertility window" /> 
      <BubbleLine color={Colors.light.codes.ovulationPrediction} label="Ovulation Prediction" description="This color marks the predicted day for ovulation" /> 
      <BubbleLine color={Colors.light.codes.pmsPrediction} label="PMS Prediction" description="This color marks a day with PMS prediction" />
      <Headline>Tracking</Headline>
      <DotLine color={Colors.light.trackingOptions.emotion} label="Emotion" description="This color marks a day with a tracked emotion" />
      <DotLine color={Colors.light.trackingOptions.pain} label="Pain" description="This color marks a day with tracked indication of pain" />
      <DotLine color={Colors.light.trackingOptions.intercourse} label="Intercourse" description="This color marks a day with tracked intercourse" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-start",
    flexDirection: "column",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: Colors.light.background,
  },
});
