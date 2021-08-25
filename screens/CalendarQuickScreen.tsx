import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import { useTracking } from "../services/useTracking";
import * as Haptics from 'expo-haptics';
import { CalendarList } from 'react-native-calendars';

import Colors from '../constants/Colors';
import CalendarQuickDay from '../components/CalendarQuickDay';
import { TrackingEntry, DEFAULT_TRACKING_SYMPTOMS } from '../types/tracking';
import { format } from '../services/i18n';

const defaultTrackingOptions: TrackingEntry = {
  date: format(new Date(), 'yyyy-MM-dd'),
  symptoms: DEFAULT_TRACKING_SYMPTOMS
};

export default function CalendarScreenQuick() {

  const { dispatch, state } = useTracking();

  // const [updated, setUpdated] = useState(+new Date());
  const [dots, setDots] = useState({});

  useEffect(() => {
    setDots(getPeriodDots())
  }, [])

  useEffect(() => {
    setDots(getPeriodDots())
  }, [state.entries])

  const onDayPress = (date) => {
    if(new Date() < new Date(date.dateString)) return;

    let entry = state.entries.find(e => e.date === date.dateString)
    if(entry === undefined) {
      let preliminaryEntry = {
        ...defaultTrackingOptions,
        symptoms: {
          ...defaultTrackingOptions.symptoms,
          bleeding: 2,
        },
        date: date.dateString
      };
      dispatch({ type: 'add_entry', payload: { entry: preliminaryEntry } })
    } else {
      dispatch({ type: 'remove_entry', payload: { date: date.dateString } })
    }

    setDots(getPeriodDots())
    Haptics.selectionAsync();
  };

  const dateStringToday = (new Date()).toISOString().split('T')[0];
  
  const getPeriodDots = () => {
    let result = {};
    
    state.entries.forEach((entry: TrackingEntry) => {
      if(entry.symptoms.bleeding > 0) {
        result[entry.date] = {
          customStyles: {
            container: { backgroundColor: Colors.light.codes.period },
            text: { color: 'white' }
          }
        }
      }
    });

    return result;
  }

  return (
    <View style={styles.container}>
      <CalendarList
        dayComponent={CalendarQuickDay}
        onDayPress={onDayPress}
        pastScrollRange={12}
        futureScrollRange={3}
        scrollEnabled={true}
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator={true}
        theme={{
          // textDisabledColor: Colors.light.text,
          'stylesheet.calendar.header': {
            week: { 
              marginTop: 7,
              marginBottom: 7,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 3,
              borderTopColor: 'rgba(0,0,0,0.1)',
              borderTopWidth: 1,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 1,
            },
            dayTextAtIndex0: { color: Colors.light.text },
            dayTextAtIndex1: { color: Colors.light.text },
            dayTextAtIndex2: { color: Colors.light.text },
            dayTextAtIndex3: { color: Colors.light.text },
            dayTextAtIndex4: { color: Colors.light.text },
            dayTextAtIndex5: { color: Colors.light.text },
            dayTextAtIndex6: { color: Colors.light.text },
          },
        }}
        markingType={'custom'}
        markedDates={dots}
        firstDay={1}
        selected={dateStringToday}
        maxDate={dateStringToday}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    // backgroundColor: Colors.light.background,
  },
});
