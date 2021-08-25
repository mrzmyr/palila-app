import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FlatList, Text, StyleSheet, ScrollView, View, Image, Pressable, Dimensions, Button } from 'react-native';

import { useTracking } from '../services/useTracking';
import { useTranslation } from 'react-i18next';
import { addDays, differenceInCalendarDays, format, isSameDay, sub, subDays } from 'date-fns';
import { Feather } from '@expo/vector-icons';

import Card from '../components/Card';
import Headline from '../components/Headline';

import CalendarLine from '../components/CalendarLine';
import Colors from '../constants/Colors';

import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { getCycleNextUp, getCycleStatus, getFertilityStatus, getNextPeriod } from '../services/TrackingService';
import { CYCLE_STATUSES, TrackingEntry } from '../types/tracking';
import { get } from '../constants/Icons';
import LinkButton from '../components/LinkButton';
const width = Dimensions.get("window").width;

const openLink = async (link: string) => {
  await WebBrowser.openBrowserAsync(link);
};

function EmptyState() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image source={require('../assets/images/empty-home.png')} style={{ width: 250, height: 250, marginTop: 15 }} />
      <Headline level={3}>{t('screens_overview_track_period_title')}</Headline>
      <Text style={{ width: "70%", opacity: 0.5, textAlign: "center" }}>{t('screens_overview_track_period_body')}</Text>
      <Pressable 
        onPress={() => navigation.navigate('CalendarQuickScreen')} 
        style={({ pressed }) => [{
          backgroundColor: Colors.light.red[1],
          borderRadius: 20,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 20,
          paddingLeft: 20,
          marginTop: 15,
          opacity: pressed ? 0.8 : 1,
        }]}
      >
        <Text style={{ color: "#FFF" }}>{t('screens_overview_track_period_button')}</Text>
      </Pressable>
    </View>
  )
}

const getStatusCircleBackgroundColor = (cycleStatus: CYCLE_STATUSES) => {
  let color = 'grey';
  
  if(cycleStatus === 1) {
    color = Colors.light.red[1];
  }
  if(cycleStatus === 3) {
    color = Colors.light.codes.fertilityPrediction;
  }
  if(cycleStatus === 4) {
    color = Colors.light.codes.ovulationPrediction;
  }
  if(cycleStatus === 2 || cycleStatus === 5) {
    color = '#FFF';
  }
  if(cycleStatus === 6) {
    color = '#FFF';
  }

  return color;
}

const getStatusCircleTextColor = (cycleStatus: CYCLE_STATUSES) => {
  let color = '#000';
  
  if(cycleStatus === 1) {
    color = Colors.light.red[2];
  }
  if(cycleStatus === 3) {
    color = Colors.light.darkblue[0];
  }
  if(cycleStatus === 4) {
    color = '#FFF';
  }
  if(cycleStatus === 2 || cycleStatus === 5) {
    color = '#000';
  }
  if(cycleStatus === 6) {
    color = '#000';
  }

  return color;
}

function Status({ date, scrollToIndex }: { date: Date }) {
  const { state } = useTracking();
  const { t } = useTranslation();

  let fertilityLevel = getFertilityStatus(date, state.periodWindows, state.entries, state.periodLength, state.cycleLength, state.ovulationDistance);
  let cycleStatus = getCycleStatus({ ...state, date });
  let [nextKey, nextVars] = getCycleNextUp({ ...state, date });
  let [nextPeriodKey, nextPeriodVars] = getNextPeriod({ ...state, date });

  const navigation = useNavigation()
  
  return (
    <View>
      <View style={{ 
        flexDirection: "column", 
        justifyContent: "center", 
        flex: 1, 
        paddingLeft: 20, 
        paddingRight: 20, 
        // backgroundColor: 'red' 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: "center",
          padding: 25
        }}>
          <View style={{ 
            width: width * 0.70,
            height: width * 0.70,
            borderRadius: 9999,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: getStatusCircleBackgroundColor(cycleStatus),
          }}>
            <Text style={{ fontSize: 18, color: getStatusCircleTextColor(cycleStatus) }}>{t(`common_cycle_status_${cycleStatus}`)}</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, width: "70%", textAlign: "center", color: getStatusCircleTextColor(cycleStatus) }}>{t(`common_${nextKey}`, nextVars)}</Text>
            {nextKey === 'cycle_next_up_period_late' && 
              <Pressable
                style={({ pressed }) => ([{ 
                  marginTop: 15,
                  backgroundColor: pressed ? Colors.light.red[1] : Colors.light.red[0],
                  paddingTop: 7,
                  paddingBottom: 7, 
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 20,
                }])} 
                onPress={() => navigation.navigate('CalendarQuickScreen')}
              >
                <Text style={{ fontSize: 14, color: '#FFF', fontWeight: 'bold' }}>{t('screens_overview_track_period_button')}</Text>
              </Pressable>
            }
          </View>
        </View>
      </View>
      { nextKey !== 'cycle_next_up_period_late' &&
        <View style={{ 
          paddingLeft: 20, 
          paddingRight: 20,
          // flex: 1,
          // justifyContent: "space-evenly",
          flexDirection: "row",
        }}>
          <Card style={{ width: "100%" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {get('common_fertility', { color: Colors.light.codes.fertility, size: 14, style: { marginRight: 5 } })}
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.light.codes.fertility }}>{t('common_fertility')}</Text> 
              {/* <Feather onPress={() => navigation.navigate('OverviewWebViewScreen', { uri: t('link_fertility') } )} name="info" size={20} color="rgba(0,0,0,0.3)" style={{ position: 'absolute', right: 0, top: -5 }} /> */}
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{t(`common_fertility_${fertilityLevel}`)}</Text>
          </Card>
        </View>
      }
      { nextPeriodVars.days > 0 &&
      <View style={{ 
        paddingLeft: 20, 
        paddingRight: 20,
        flexDirection: "row",
      }}>
        <Card style={{ width: "100%" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {get('common_period', { color: Colors.light.codes.period, size: 14, style: { marginRight: 5 } })}
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.light.codes.period }}>{t('common_period')}</Text> 
            {/* <Feather onPress={() => navigation.navigate('OverviewWebViewScreen', { uri: t('link_cycle_length') } )} name="info" size={20} color="rgba(0,0,0,0.3)" style={{ position: 'absolute', right: 0, top: -5 }} /> */}
          </View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{t(`common_${nextPeriodKey}`, nextPeriodVars)}</Text>
        </Card>
      </View>
      }
      { !isSameDay(date, new Date()) && <LinkButton title={t('screens_overview_go_back_to_today')} onPress={() => scrollToIndex(1, true)} /> }
    </View>
  )
}

const DAYS_OFFSET = -1;
const sliderWidth = Dimensions.get("window").width;

export default function OverviewScreen() {
  const { t } = useTranslation();
  const { dispatch, state } = useTracking();

  const [currentDate, setCurrentDate] = useState<Date>(addDays(new Date(), -1))
  
  useEffect(() => {
    console.log('OverviewScreen: entries', state.entries.length)
  })
  
  let entriesFiltered = state.entries.filter((entry: TrackingEntry) => [1,2,3].includes(entry.symptoms.bleeding))

  let today = new Date();

  let _flatListRef = null;

  const handleScroll = (event) => {
    let index = event.nativeEvent.contentOffset.x / sliderWidth;
    setCurrentDate(addDays(today, index + DAYS_OFFSET))
  }

  const scrollToIndex = (index, animated = false) => {
    _flatListRef.scrollToIndex({animated, index });
  }

  const _renderItem = ({ item }) => {
    return <View style={{ width: sliderWidth }}>{item}</View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <CalendarLine 
        style={{
          marginTop: 25,
        }}
        selectedDate={currentDate} 
        startDate={addDays(today, DAYS_OFFSET)}
        onPress={(date) => {
          scrollToIndex(differenceInCalendarDays(date, today) + 1, true)
        }}
      />
      {entriesFiltered.length < 3 && <EmptyState />}
      {entriesFiltered.length >= 3 && 
      <FlatList
        initialScrollIndex={1}
        style={{
          flex: 1,
        }}
        onScrollToIndexFailed={({
          index,
          averageItemLength,
        }) => {
          _flatListRef.current?.scrollToOffset({
            offset: index * averageItemLength,
            animated: true,
          });
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => index.toString()}
        data={[0,1,2,3,4,5,6].map(d => <Status date={addDays(today, d + DAYS_OFFSET)} scrollToIndex={scrollToIndex} />)}
        renderItem={({ item }) => _renderItem({ item })}
        ref={(ref) => { _flatListRef = ref; }}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.light.background,
  },
  spacer: {
    height: 25
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
