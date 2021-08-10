import { format } from "date-fns";
import React from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { Feather } from '@expo/vector-icons'; 
import TrackingOptionSymptomItem from './TrackingOptionSymptomItem';
import { getDayStatus } from "../services/TrackingService";
import { useTracking } from "../services/useTracking";

export default function CalendarDayOverview({ entry, currentDate, openTrackingScreen }: { entry: TrackingOptions | null, currentDate: string }) { 
  
  let { state } = useTracking();
  
  let entryHasSymptoms = entry !== undefined && (entry.symptoms.bleeding > 0 || Object.keys(entry.symptoms).filter(key => key !== 'bleeding').some(key => entry.symptoms[key]))

  const dayStatus = getDayStatus(new Date(currentDate), state.entries, state.periodWindows, state.periodLength, state.cycleLength, state.ovulationDistance)
  
  return (
    <View style={{
      // position: "absolute",
      height: 200,
      // bottom: 0,
      width: "100%",
      backgroundColor: '#FFF',
      paddingLeft: 20,
      paddingRight: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.1)',
      shadowOffset: {
        height: 7,
        width: 0
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
      <Text style={{
        fontSize: 18,
        fontWeight: "bold",
        paddingTop: 15,
        paddingBottom: 10,
      }}>{format(new Date(currentDate), 'iiii, dd. MMM')}</Text>
      {/* {new Date(currentDate) < new Date() && 
      <Pressable 
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
          marginLeft: "auto",
          padding: 10,
          borderRadius: 5,
          backgroundColor: Colors.light.red[2],
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => openTrackingScreen({ date: currentDate })}
      >
        {!entryHasSymptoms && <Feather name="plus" size={18} color={Colors.light.red[0]} />}
        {entryHasSymptoms && <Feather name="edit-3" size={18} color={Colors.light.red[0]} />}
      </Pressable>} */}
      </View>
      <View style={{ height: 1, backgroundColor: '#EEE', marginBottom: 10 }}></View>
      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
      <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", flexWrap: "wrap" }}>
        {!entryHasSymptoms && <Text style={{ marginTop: 40, opacity: 0.5 }}>No symptoms tracked.</Text>}
        {entryHasSymptoms && Object.keys(entry.symptoms).map(key => {
          if(entry.symptoms[key] === 0 || entry.symptoms[key] === false) return null;
          return <TrackingOptionSymptomItem key={key} type={key} symptoms={entry.symptoms} />
        })}
        {dayStatus !== undefined && <Text>{JSON.stringify(dayStatus)}</Text>}
      </View>
      </ScrollView>
    </View>
  );
}