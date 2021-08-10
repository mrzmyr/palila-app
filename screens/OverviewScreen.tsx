import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, ScrollView, View, Image, Pressable, Dimensions } from 'react-native';

import { useTracking } from '../services/useTracking';
import { useTranslation } from 'react-i18next';
import { addDays, differenceInCalendarDays, format, sub, subDays } from 'date-fns';

import Card from '../components/Card';
import Headline from '../components/Headline';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarLine from '../components/CalendarLine';
import Colors from '../constants/Colors';

import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { getCycleDay, getCycleNextUp, getCycleStatus, getFertilityStatus } from '../services/TrackingService';
import { TrackingEntry } from '../types/tracking';

const openLink = async (link: string) => {
  await WebBrowser.openBrowserAsync(link);
};

function EmptyState() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image source={require('../assets/images/empty-home.png')} style={{ width: 250, height: 250, marginTop: 15 }} />
      <Headline level={3}>Your cycle status</Headline>
      <Text style={{ width: "70%", opacity: 0.5, textAlign: "center" }}>Add you first period dates now to see your cycle status</Text>
      <Pressable 
        onPress={() => navigation.navigate('CalendarQuickScreen')} 
        style={{
          backgroundColor: Colors.light.red[1],
          borderRadius: 20,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 20,
          paddingLeft: 20,
          marginTop: 15,
        }}
      >
        <Text style={{ color: "#FFF" }}>Log Period</Text>
      </Pressable>
    </View>
  )
}

function StatusIndicator({ cycleStatus }) {
  let color = 'grey';
  
  if(cycleStatus === 1) {
    color = Colors.light.codes.period;
  }
  if(cycleStatus === 3) {
    color = Colors.light.codes.fertilityPrediction;
  }
  if(cycleStatus === 4) {
    color = Colors.light.codes.ovulationPrediction;
  }
  if(cycleStatus === 2 || cycleStatus === 5) {
    color = Colors.light.codes.periodPrediction;
  }

  return (
    <View style={{ 
      width: 40, 
      height: 40, 
      borderRadius: 40, 
      backgroundColor: color, 
      marginRight: 15 
    }} />
  );
}

function Status({ date }: { date: Date }) {
  const { state } = useTracking();
  const { t } = useTranslation();

  let fertilityLevel = getFertilityStatus(date, state.periodWindows, state.entries, state.periodLength, state.cycleLength, state.ovulationDistance);
  let cycleStatus = getCycleStatus({ ...state, date });
  let [nextKey, nextVars] = getCycleNextUp({ ...state, date });
  
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
        <Headline level={2}>{format(date, "iiii, dd. MMM")}</Headline>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StatusIndicator cycleStatus={cycleStatus} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t(`cycle_status_${cycleStatus}`)}</Text>
              <Text style={{ fontSize: 15, marginTop: 5 }}>{t(nextKey, nextVars)}</Text>
            </View>
          </View>
          <Pressable 
            style={{ position: "absolute", right: 10, top: 5, padding: 5 }}
            onPress={() => openLink('https://palila-app.notion.site/Privacy-Policy-00655387c3d6485caaf6cf03b2642320')} 
          >
            <Ionicons name="information-circle-outline" size={24} color="#CCC" />
          </Pressable>
        </Card>
      </View>
      <View style={{ 
        paddingLeft: 20, 
        paddingRight: 20,
        flex: 1,
        justifyContent: "space-evenly",
        flexDirection: "row",
      }}>
        <Card style={{ flex: 0.5, marginRight: 5 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>Cycle Day</Text> 
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Day {getCycleDay(date, state.periodWindows)}</Text>
        </Card>
        <Card style={{ flex: 0.5, marginLeft: 5 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>Fertility</Text>
          <Text style={{ fontSize: 21, fontWeight: 'bold', flexWrap: 'wrap' }}>{t(`fertility_${fertilityLevel}`)}</Text>
        </Card>
      </View>
    </View>
  )
}

export default function OverviewScreen() {
  const { t } = useTranslation();
  const { dispatch, state } = useTracking();

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  
  useEffect(() => {
    console.log('OverviewScreen: entries', state.entries.length)
  })
  
  let entriesFiltered = state.entries.filter((entry: TrackingEntry) => [1,2,3].includes(entry.symptoms.bleeding))

  let sliderWidth = Dimensions.get("window").width;
  let today = new Date();

  let _flatListRef = null;

  const scrollToIndex = (index: TrackingCategories) => {
    _flatListRef.scrollToIndex({animated: false, index });
  }

  const handleScroll = (event) => {
    let index = event.nativeEvent.contentOffset.x / sliderWidth;
    setCurrentDate(addDays(today, index-3))
  }

  const _renderItem = ({ item }) => {
    return <View style={{ width: sliderWidth }}>{item}</View>;
  }

  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.spacer} />
      <View style={{ 
        paddingLeft: 20,
        paddingRight: 20,
        // backgroundColor: 'yellow'
      }}>
        <CalendarLine 
          selectedDate={currentDate} 
          startDate={sub(today, { days: 3 })} 
          onPress={(date) => {
            setCurrentDate(date)
            scrollToIndex(differenceInCalendarDays(date, today) + 3)
          }}
        />
      </View>
      {entriesFiltered.length < 3 && <EmptyState />}
      {/* {entriesFiltered.length >= 3 && <Status date={currentDate} />} */}
      <FlatList
        style={{
          flex: 1,
        }}
        onScroll={handleScroll}
        keyExtractor={(item, index) => index.toString()}
        data={[
          <Status date={subDays(today, 3)}  />,
          <Status date={subDays(today, 2)}  />,
          <Status date={subDays(today, 1)}  />,
          <Status date={today}  />,
          <Status date={addDays(today, 1)}  />,
          <Status date={addDays(today, 2)}  />,
          <Status date={addDays(today, 3)}  />,
        ]}
        renderItem={({ item }) => _renderItem({ item })}
        ref={(ref) => { _flatListRef = ref; }}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
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
