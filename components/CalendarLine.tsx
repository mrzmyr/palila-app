import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

import { format } from '../services/i18n';
import { add, isSameDay } from 'date-fns';
import Colors from '../constants/Colors';
import { useTracking } from '../services/useTracking';
import { getDayStatus } from '../services/TrackingService';

export default function CalendarLine({ startDate, style = {}, todayDate = new Date(), selectedDate = new Date(), onPress }) {

  const { state } = useTracking();

  let days = [];

  for (let i = 0; i < 7; i++) {
    days.push(add(startDate, { days: i }))
  }
  
  return (
    <View style={[styles.calendarLine, style]}>
      <View style={styles.weekdaysContainer}>
        {days.map(date => {
          return (
            <View key={date.toString()} style={{...styles.weekdayContainer }}>
              <Text style={[styles.weekdayText]}>{format(date, "eeeee")}</Text>
            </View>
          )}
        )}
      </View>
      <View style={styles.weekdatesContainer}>
      {days.map(date => {
          let additionalStyles = {};
          let details = getDayStatus(date, state.entries, state.periodWindows, state.periodLength, state.cycleLength, state.ovulationDistance);

          if(details !== null) {
            if(details.fertilePrediciton) {
              additionalStyles.backgroundColor = Colors.light.codes.fertilityPrediction;
            }
            if(details.ovulationPrediciton) {
              additionalStyles.backgroundColor = Colors.light.codes.ovulationPrediction;
            }
            if(details.pmsPrediction) {
              additionalStyles.backgroundColor = Colors.light.codes.pmsPrediction;
            }
            if(details.periodPrediction) {
              additionalStyles.backgroundColor = Colors.light.codes.periodPrediction;
            }
            if(details.period) {
              additionalStyles.backgroundColor = Colors.light.codes.period;
            }
          }
        
          return (
            <Pressable 
              key={date.toString()} 
              onPress={() => onPress(date)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1
              })}
            >
              <View style={{...styles.weekdateContainer, ...additionalStyles}}>
                {isSameDay(date, selectedDate) && 
                  <View style={{
                    position: "absolute",
                    left: -5,
                    borderRadius: 60,
                    width: 50,
                    height: 50,
                    borderWidth: 3,
                    borderColor: '#000',
                    opacity: 0.1
                  }}></View>
                }
                <Text 
                  style={[{
                    fontSize: isSameDay(date, todayDate) ? 18 : 15, 
                    fontWeight: isSameDay(date, todayDate) ? 'bold' : 'normal', 
                    color:  [Colors.light.codes.ovulationPrediction, Colors.light.codes.period].includes(additionalStyles.backgroundColor) ? 'white' : Colors.light.text,
                  }]}
                >{format(date, "dd")}</Text>
              </View>
            </Pressable>
          )}
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  calendarLine: {
    // backgroundColor: 'white',
    fontSize: 16,
    // fontWeight: "bold",
    // paddingTop: 15,
    // paddingBottom: 15,
    borderRadius: 10,
    justifyContent: "flex-start"
  },
  weekdaysContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  weekdayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  weekdayText: {
    fontSize: 12,
  },
  weekdatesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  weekdateContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    borderRadius: 100,
  },
})
