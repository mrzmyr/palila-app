import { isBefore, isSameDay } from "date-fns";
import React, { useMemo } from "react";
import { Pressable, View, Text } from "react-native";
import Colors from "../constants/Colors";
import { PredictionType } from "../types/tracking";
import CalendarDayDot from "./CalendarDayDot";

const fertileTypeColors = {
  1: Colors.light.codes.fertilityPrediction,
  2: Colors.light.codes.fertilityPrediction,
  3: Colors.light.codes.ovulationPrediction,
}

const hasSymptom = (entry, type) => {
  return Object.keys(entry.symptoms).filter(key => key.includes(type)).some(key => entry.symptoms[key])
}

export default ({ marking, date, onPress }) => {
  
  let textStyles = {};
  let containerStyles = {};

  if(marking && marking.prediction) {
    
    if(marking.prediction.type === PredictionType.Fertility) {
      containerStyles = { backgroundColor: fertileTypeColors[marking.prediction.fertilityType] }
      textStyles = { color: marking.prediction.fertilityType === 3 ? '#FFF' : Colors.light.text }
    }
    if(marking.prediction.type === PredictionType.PMS) {
      containerStyles = { backgroundColor: Colors.light.codes.pmsPrediction }
      textStyles = { color: Colors.light.text }
    }
    if(marking.prediction.type === PredictionType.Period) {
      containerStyles = { backgroundColor: Colors.light.codes.periodPrediction }
      textStyles = { color: Colors.light.text }
    }
  }

  if(marking && marking.entry) {
    if(marking.entry.symptoms.bleeding > 0) {
      containerStyles = { backgroundColor: Colors.light.codes.period }
      textStyles = { color: 'white' }
    }
  }

   return (
     <Pressable 
       onPress={() => onPress(date)}
       style={({ pressed }) => [
         containerStyles, {
           borderRadius: 40, 
           width: 40, 
           flex: 1, 
           marginTop: -8, 
           flexBasis: 40, 
           justifyContent: 'center',
           opacity: pressed ? 0.5 : 1,
         },
        //  pressed ? { borderColor: Colors.light.red[1] } : {}
       ]}
     >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text 
            style={[
              textStyles, { 
                fontSize: 15, 
                textAlign: 'center', 
                fontWeight: isSameDay(new Date(date.dateString), new Date()) ? 'bold': 'normal',
                opacity: isBefore(new Date(), new Date(date.dateString)) && !isSameDay(new Date(), new Date(date.dateString)) ? 0.3 : 1
              }
            ]}
          >
            {date.day}
          </Text>
          <View style={{
            flexDirection: "row"
          }}>
          { marking && marking.entry && marking.entry.symptoms && hasSymptom(marking.entry, 'emotion') && <CalendarDayDot color={Colors.light.trackingOptions.emotion} /> }
          { marking && marking.entry && marking.entry.symptoms && hasSymptom(marking.entry, 'pain') && <CalendarDayDot color={Colors.light.trackingOptions.pain} /> }
          { marking && marking.entry && marking.entry.symptoms && hasSymptom(marking.entry, 'intercourse') && <CalendarDayDot color={Colors.light.trackingOptions.intercourse} /> }
          </View>
        </View>
        {marking?.isCurrentDate && 
          <View style={{
            position: "absolute",
            left: -5,
            borderRadius: 60,
            width: 50,
            height: 50,
            borderWidth: 3,
            borderColor: 'rgba(0,0,0,0.1)',
          }}></View>
        }
     </Pressable>
   );
}