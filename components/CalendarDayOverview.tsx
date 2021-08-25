import { format } from '../services/i18n';
import React, { useEffect, useRef } from "react";
import { Pressable, View, Text, ScrollView, Animated } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons'; 
import TrackingOptionSymptomItem from './TrackingOptionSymptomItem';
import { getDayStatus } from "../services/TrackingService";
import { useTracking } from "../services/useTracking";
import Colors from "../constants/Colors";
import { get } from "../constants/Icons";
import { useTranslation } from "react-i18next";
import { isBefore, isSameDay } from 'date-fns';

const PredictionItem = ({ type }) => {
  const { t } = useTranslation();

  let icon = 'common_fertility';
  let textColor = Colors.light.codes.fertility;
  let backgroundColor = Colors.light.darkblue[3];
  let title = t('common_unknown_predicted');
  
  if(type === 'fertilePrediciton') {
    icon = 'common_fertility';
    textColor = Colors.light.codes.fertility;
    backgroundColor = Colors.light.darkblue[3];
    title = t('common_fertility_predicted');
  }
  if(type === 'periodPrediction') {
    icon = 'common_period';
    textColor = Colors.light.red[1];
    backgroundColor = Colors.light.red[2];
    title = t('common_period_predicted');
  }
  if(type === 'pmsPrediction') {
    icon = 'common_pms';
    textColor = Colors.light.yellow[5];
    backgroundColor = Colors.light.yellow[0];
    title = t('common_pms_predicted');
  }
  
  return (
    <View style={{ 
      paddingTop: 5, 
      paddingBottom: 5, 
      paddingLeft: 10, 
      paddingRight: 10, 
      borderRadius: 5, 
      backgroundColor, 
      marginBottom: 15,
      flexDirection: 'row', 
      alignItems: 'center' 
    }}>
    {get(icon, { color: textColor, size: 14, style: { marginRight: 5 } })}
    <Text style={{ color: textColor }}>{title}</Text>
    </View>
  )
}

export default function CalendarDayOverview({ entry, currentDate, isVisible, onPressClose, openTrackingScreen }: { entry: TrackingOptions | null, currentDate: string }) { 
  
  let { state } = useTracking();
  const { t } = useTranslation();

  // const fadeAnim = useRef(new Animated.Value(0)).current
  
  let entryHasSymptoms = entry !== undefined && (entry.symptoms.bleeding > 0 || Object.keys(entry.symptoms).filter(key => key !== 'bleeding').some(key => entry.symptoms[key]))

  const dayStatus = getDayStatus(new Date(currentDate), state.entries, state.periodWindows, state.periodLength, state.cycleLength, state.ovulationDistance)
  
  // useEffect(() => {
  //   if(isVisible) {
  //     Animated.timing(fadeAnim, { 
  //       toValue: 0, 
  //       duration: 150,
  //       useNativeDriver: true,
  //     }).start();
  //   } else {
  //     Animated.timing(fadeAnim, { 
  //       toValue: HEIGHT, 
  //       duration: 50,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [isVisible])

  const isFuture = isBefore(new Date(), new Date(currentDate)) && !isSameDay(new Date(), new Date(currentDate));

  return (
    <View style={{
      height: 400,
      width: "100%",
      backgroundColor: '#FFF',
      paddingLeft: 20,
      paddingRight: 20,
      // shadowOffset: {
      //   height: 7,
      //   width: 0
      // },
      // shadowOpacity: 0.2,
      // shadowRadius: 10,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <Text style={{
          fontSize: 18,
          fontWeight: "bold",
          paddingTop: 0,
          paddingBottom: 10,
        }}>{format(new Date(currentDate), 'iiii, dd. MMM')}</Text>
        {/* <Pressable 
          style={({ pressed }) => [{
            paddingTop: 5,
            paddingBottom: 5,
            padding: 5, 
            borderRadius: 5,
            // backgroundColor: 'rgba(0,0,0,0.05)',
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "auto",
          }, pressed ? { backgroundColor: 'rgba(0,0,0,0.05)' } : {}]}
          onPress={onPressClose}
        >
          <AntDesign name="close" size={24} color={'rgba(0,0,0,0.3)'} />
        </Pressable> */}
      </View>
      <View style={{ height: 1, backgroundColor: '#EEE', marginBottom: 10 }}></View>
      {/* { new Date(currentDate) > new Date() && [dayStatus?.fertilePrediciton, dayStatus?.ovulationPrediciton, dayStatus?.periodPrediction, dayStatus?.pmsPrediction].some(d => d === true) &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {dayStatus?.fertilePrediciton && <PredictionItem type="fertilePrediciton" />}
          {dayStatus?.periodPrediction && <PredictionItem type="periodPrediction" />}
          {dayStatus?.pmsPrediction && <PredictionItem type="pmsPrediction" />}
        </View>
      } */}
      {/* { !isFuture && <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{t('common_symptoms')}</Text>} */}
      <View>
        <View style={{ alignItems: 'center', flexDirection: "row", flexWrap: "wrap" }}>
          {/* {!entryHasSymptoms && <Text style={{ marginTop: 25, opacity: 0.5 }}>{t('screens_calendar_no_symptoms_tracked')}</Text>} */}
          {entryHasSymptoms && Object.keys(entry.symptoms).map(key => {
            if(entry.symptoms[key] === 0 || entry.symptoms[key] === false) return null;
            return <TrackingOptionSymptomItem key={key} type={key} symptoms={entry.symptoms} />
          })}
          {/* {dayStatus !== undefined && <Text>{JSON.stringify(dayStatus)}</Text>} */}
        </View>
        <View style={{ alignItems: 'flex-start' }}>
        {!isFuture && 
          <Pressable 
            style={({ pressed }) => [{
              marginTop: 5,
              marginBottom: 10,
              marginRight: 10,
              // marginLeft: "auto",
              paddingTop: 7,
              paddingBottom: 7,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0,0,0,0.05)',
              alignItems: "center",
              flexDirection: "row",
              opacity: pressed ? 0.5 : 1
            }]}
            onPress={() => openTrackingScreen({ date: currentDate })}
          >
            {!entryHasSymptoms && <View style={{ flexDirection: "row", alignItems: 'center' }}><Feather name="plus" size={18} color="#333" style={{ marginRight: 5 }} /><Text style={{ color: '#333' }}>{t('screens_calendar_add_symptoms')}</Text></View>}
            {entryHasSymptoms && <View style={{ flexDirection: "row", alignItems: 'center' }}><Feather name="edit-3" size={18} color="#333" style={{ marginRight: 5 }} /><Text style={{ color: '#333' }}>{t('screens_calendar_edit_symptoms')}</Text></View>}
          </Pressable>}
          </View>
      </View>
    </View>
  );
}