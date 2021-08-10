import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Modal, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

import { CalendarList } from 'react-native-calendars';

import { useTracking } from '../services/useTracking';
import Colors from '../constants/Colors';
import format from 'date-fns/format';

import TrackingScreen from './TrackingScreen';
import CalendarDayOverview from '../components/CalendarDayOverview';
import CalendarDay from '../components/CalendarDay';
import { DEFAULT_TRACKING_SYMPTOMS, TrackingEntry } from '../types/tracking';
import { 
  getFertilityPrediction, 
  getPeriodPredictionCurrentCycle, 
  getPeriodPredictionNextCycle, 
  getPMSPrediction
} from '../services/TrackingService';

import {
  getEntryDots, getPredictionDots, mergeDots
} from '../services/CalendarService'

export default function Calendar() {

  console.log('render', "Calendar")
  
  let calendarRef = null;
  const { dispatch, state } = useTracking();

  let dateStringToday = (new Date()).toISOString().split('T')[0];

  const defaultTrackingOptions: TrackingEntry = {
    date: format(new Date(), 'yyyy-MM-dd'),
    symptoms: DEFAULT_TRACKING_SYMPTOMS
  };
  
  const [currentDate, setCurrentDate] = useState(dateStringToday);
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState<TrackingEntry>(defaultTrackingOptions);
  const [dots, setDots] = useState({})

  const refreshDots = () => {

    let dots = {}
    
    const { periodWindows, periodLength, cycleLength, ovulationDistance } = state;
    
    if(periodWindows.length > 0) {
      periodWindows.forEach(pw => {
        let periodStartDate = pw[0].date;
        let fertilityPrediction = getFertilityPrediction(periodStartDate, ovulationDistance);
        let pmsPrediction = getPMSPrediction(periodStartDate, periodLength, cycleLength);
        let periodPredictionCurrentCycle = getPeriodPredictionCurrentCycle(periodStartDate, periodLength);
  
        dots = mergeDots(dots, getPredictionDots(fertilityPrediction))
        dots = mergeDots(dots, getPredictionDots(pmsPrediction))
        dots = mergeDots(dots, getPredictionDots(periodPredictionCurrentCycle))
      })

      let periodStartDate = periodWindows[periodWindows.length - 1][0].date
      let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
      dots = mergeDots(dots, getPredictionDots(periodPredictionNextCycle))
    }

    dots = mergeDots(dots, getEntryDots(state.entries))

    if(dots[currentDate] !== undefined) {
      dots[currentDate] = {
        ...dots[currentDate],
        isCurrentDate: true
      }
    } else {
      dots[currentDate] = {
        isCurrentDate: true
      }
    }

    setDots(dots)
  }

  useEffect(() => {
    refreshDots()
    calendarRef.scrollToMonth('2021-07-01', 0, false)
  }, [])
  
  useEffect(() => {
    refreshDots()
  }, [currentDate])

  useEffect(() => {
    refreshDots()
  }, [JSON.stringify(state.entries)])

  // useEffect(() => {
  //   setModalVisible(true)
  // }, [])

  const openTrackingScreen = ({ date }: { date: string }) => {
    let entry = state.entries.find(e => e.date === date)
    if(entry === undefined) {
      let preliminaryEntry = {
        ...defaultTrackingOptions,
        date: date
      };
      setTrackingOptions(preliminaryEntry)
    } else {
      setTrackingOptions(entry)
    }
    setModalVisible(true)
  }
  
  const currentEntry = state.entries.find(e => e.date === currentDate);
  
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        style={{
          backgroundColor: Colors.light.background
        }}
      >
      <TrackingScreen
        onPressClose={() => {
          setTrackingOptions(defaultTrackingOptions);
          setModalVisible(false)
        }}
        trackingOptions={trackingOptions}
        saveEntry={(trackingOptions) => {
          let entry = state.entries.find(e => e.date === trackingOptions.date)
          if(entry === undefined) {
            dispatch({ type: 'add_entry', payload: { entry: { ...trackingOptions, created_at: +new Date() } } })
          } else {
            dispatch({ type: 'update_entry', payload: { entry: { ...trackingOptions, updated_at: +new Date() } } })
          }
          refreshDots()
          setTrackingOptions(trackingOptions)
        }}
      />
      </Modal>
      <View style={{
        flex: 1,
      }}>
      <CalendarList
        ref={(c) => calendarRef = c}
          dayComponent={CalendarDay}
          onDayPress={(date) => {
            if(currentDate !== date.dateString) {
              Haptics.selectionAsync()
              setCurrentDate(date.dateString)
            } else {
              if(new Date(date.dateString) > new Date()) return;
              Haptics.selectionAsync()
              openTrackingScreen({ date: date.dateString })
            }
          }}
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
          // selected={dateStringToday}
          // maxDate={dateStringToday}
        />
      </View>
      <CalendarDayOverview
        entry={currentEntry}
        openTrackingScreen={openTrackingScreen}
        currentDate={currentDate}
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
