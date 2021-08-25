import React, { useRef } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Modal, Text, Platform } from "react-native";
import * as Haptics from 'expo-haptics';

import { CalendarList } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';

import { useTracking } from '../services/useTracking';
import Colors from '../constants/Colors';
import { format } from '../services/i18n';

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
import { isBefore, isSameDay } from 'date-fns';

export default function Calendar() {

  console.log('render', "Calendar")
  
  let calendarRef = null;
  const { dispatch, state } = useTracking();

  let dateStringToday = format(new Date(), 'yyyy-MM-dd');

  const defaultTrackingOptions: TrackingEntry = {
    date: format(new Date(), 'yyyy-MM-dd'),
    symptoms: DEFAULT_TRACKING_SYMPTOMS
  };
  
  const [currentDate, setCurrentDate] = useState(dateStringToday);
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState<TrackingEntry>(defaultTrackingOptions);
  const [dots, setDots] = useState({})
  const [calendarDayOverviewVisible, setCalendarDayOverviewVisible] = useState(true)

  const refreshDots = () => {

    let dots = {}
    
    const { periodWindows, periodLength, cycleLength, ovulationDistance } = state;
    
    if(periodWindows.length > 0) {
      periodWindows.forEach(pw => {
        let periodStartDate = pw[0].date;
        let fertilityPrediction = getFertilityPrediction(periodStartDate, ovulationDistance);
        let periodPredictionCurrentCycle = getPeriodPredictionCurrentCycle(periodStartDate, periodLength);
  
        dots = mergeDots(dots, getPredictionDots(fertilityPrediction))
        dots = mergeDots(dots, getPredictionDots(periodPredictionCurrentCycle))
      })

      let periodStartDate = periodWindows[periodWindows.length - 1][0].date
      let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
      let periodPredictionNextNextCycle = getPeriodPredictionNextCycle(periodPredictionNextCycle[0].date, periodLength, cycleLength);
      let periodPredictionNextNextNextCycle = getPeriodPredictionNextCycle(periodPredictionNextNextCycle[0].date, periodLength, cycleLength);
      let pmsPrediction = getPMSPrediction(periodStartDate, periodLength, cycleLength);
      let pmsPredictionNext = getPMSPrediction(periodPredictionNextCycle[0].date, periodLength, cycleLength);
      let pmsPredictionNextNext = getPMSPrediction(periodPredictionNextNextCycle[0].date, periodLength, cycleLength);
      dots = mergeDots(dots, getPredictionDots(pmsPrediction))
      dots = mergeDots(dots, getPredictionDots(pmsPredictionNext))
      dots = mergeDots(dots, getPredictionDots(pmsPredictionNextNext))
      dots = mergeDots(dots, getPredictionDots(periodPredictionNextCycle))
      dots = mergeDots(dots, getPredictionDots(periodPredictionNextNextCycle))
      dots = mergeDots(dots, getPredictionDots(periodPredictionNextNextNextCycle))
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
  }, [])

  useEffect(() => {
    refreshDots()
  }, [currentDate])

  useEffect(() => {
    refreshDots()
  }, [state.entries])

  const openTrackingScreen = ({ date }: { date: string }) => {
    console.log(date)
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
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [0, '30%', '60%'], []);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: 'red',
    }}>
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
            const isFuture = isBefore(new Date(), new Date(date.dateString)) && !isSameDay(new Date(), new Date(date.dateString));
            
            if(isFuture) return;

            if(currentDate !== date.dateString) {
              if(Platform.select({ ios: true, android: false })) Haptics.selectionAsync()
              setCurrentDate(date.dateString)
              setCalendarDayOverviewVisible(true)
              if(bottomSheetRef !== null) bottomSheetRef.current.snapTo(1)
            } else {
              if(Platform.select({ ios: true, android: false })) Haptics.selectionAsync()
              if(calendarDayOverviewVisible) {
                openTrackingScreen({ date: date.dateString })
              } else {
                if(bottomSheetRef !== null) bottomSheetRef.current.snapTo(1)
                setCalendarDayOverviewVisible(true)
              }
            }
          }}
          pastScrollRange={12}
          futureScrollRange={3}
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
          theme={{
            calendarBackground: Colors.light.background,
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
              dayTextAtIndex0: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex1: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex2: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex3: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex4: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex5: { color: 'rgba(0,0,0,0.3)' },
              dayTextAtIndex6: { color: 'rgba(0,0,0,0.3)' },
            },
          }}
          markingType={'custom'}
          markedDates={dots}
          firstDay={1}
          // selected={dateStringToday}
          // maxDate={dateStringToday}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 7,
        }}
      >
        <CalendarDayOverview
          isVisible={calendarDayOverviewVisible}
          onPressClose={() => {
            bottomSheetRef.current.snapTo(0)
            setCalendarDayOverviewVisible(false)
            setTimeout(() => {
              setCurrentDate(null)
            }, 50)
          }}
          entry={currentEntry}
          openTrackingScreen={openTrackingScreen}
          currentDate={currentDate}
        />
      </BottomSheet>
    </View>
  );
}
