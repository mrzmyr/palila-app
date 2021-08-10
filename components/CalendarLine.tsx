import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

import { add, format, isSameDay } from 'date-fns';
import Colors from '../constants/Colors';
import { useTracking } from '../services/useTracking';
import { getDayStatus } from '../services/TrackingService';

export default function CalendarLine({ startDate, todayDate = new Date(), selectedDate = new Date(), onPress = () => {} }) {

  const { state } = useTracking();

  let days = [];

  for (let i = 0; i < 7; i++) {
    days.push(add(startDate, { days: i }))
  }
  
  return (
    <View style={styles.calendarLine}>
      <View style={styles.weekdaysContainer}>
        {days.map(date => {
          return (
            <View key={date} style={{...styles.weekdayContainer, ...{ backgroundColor: isSameDay(date, todayDate) ? 'white' : 'white' }}}>
              <Text style={{...styles.weekdayText, ...{ fontWeight: isSameDay(date, todayDate) ? 'bold' : 'normal' }}}>{format(date, "E")}</Text>
            </View>
          )}
        )}
      </View>
      <View style={styles.weekdatesContainer}>
      {days.map(date => {
          let additionalStyles = {};
          let details = getDayStatus(date, state.entries, state.periodWindows, state.periodLength, state.cycleLength, state.ovulationDistance);

          if(details !== null) {
            if(details.periodPrediction) {
              additionalStyles.backgroundColor = Colors.light.codes.periodPrediction;
            }
            if(details.fertilePrediciton) {
              additionalStyles.backgroundColor = Colors.light.codes.fertilityPrediction;
            }
            if(details.ovulationPrediciton) {
              additionalStyles.backgroundColor = Colors.light.codes.ovulationPrediction;
            }
            if(details.pmsPrediction) {
              additionalStyles.backgroundColor = Colors.light.codes.pmsPrediction;
            }
            if(details.period) {
              additionalStyles.backgroundColor = Colors.light.codes.period;
            }
          }
        
          return (
            <Pressable key={date} onPress={() => onPress(date)}>
              <View style={{...styles.weekdateContainer, ...additionalStyles}}>
                {isSameDay(date, selectedDate) && 
                  <View style={{
                    position: "absolute",
                    left: -5,
                    borderRadius: 60,
                    width: 50,
                    height: 50,
                    borderWidth: 3,
                    borderColor: Colors.light.codes.period,
                  }}></View>
                }
                
                <Text 
                  style={{...styles.weekdateText, ...{ 
                    fontWeight: isSameDay(date, todayDate) ? 'bold' : 'normal', 
                    color: additionalStyles.backgroundColor === Colors.light.codes.period ? 'white' : Colors.light.text,
                  }}}
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
    backgroundColor: 'white',
    fontSize: 16,
    // fontWeight: "bold",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    justifyContent: "flex-start"
  },
  weekdaysContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  weekdayContainer: {
    alignItems: "center",
    justifyContent: "center",
    // fontWeight: "bold",
    width: 40,
  },
  weekdayText: {
    // fontWeight: "bold",
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
    // fontWeight: "bold",
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  weekdateText: {
    // fontWeight: "bold",
    fontSize: 16,
  },
})
