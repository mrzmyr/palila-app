import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, Text, Image, Dimensions } from 'react-native';

import { useTracking } from '../services/useTracking';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Card from '../components/Card';
import Headline from '../components/Headline';

import Constants from 'expo-constants';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getCycleLengthStatus, getPeriodLengthStatus } from '../services/TrackingService';
import { CYCLE_LENGTH_STATUS, PERIOD_LENGTH_STATUS } from '../types/tracking';

function Stats({ title, statusText = null, statusIcon = null, number, numberSuffix, containerStyles }) {
  return (
    <View style={{ ...styles.statsContainer, ...containerStyles }}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsNumber}>{number} {numberSuffix && numberSuffix}</Text>
      <View style={styles.statsStatus}>
        {statusIcon}
        {statusText && <Text style={styles.statsStatusText}>{statusText}</Text>}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  
  const { t } = useTranslation();
  const { state: { periodWindows, cycleLength, periodLength }, dispatch } = useTracking();

  const askToReset = () =>
  Alert.alert(
    "Erase all data",
    "All tracked data including periods, symptoms and other features will be permanently deleted.",
    [
      {
        text: "Reset my data",
        onPress: () => dispatch({ type: 'reset_entries' }),
        style: "destructive"
      },
      { 
        text: "Cancel", onPress: () =>  {},
        style: "cancel"
      }
    ],
    { cancelable: true }
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/images/mood-meditation.png')} style={{ marginTop: 15, borderRadius: 10, width: Dimensions.get('window').width-40, height: (Dimensions.get('window').width-40)/1.5 }} />
      <Headline level={3}>{t('home_last_cycles_headline')}</Headline>
      {periodWindows.map((pw, i) => {
        return (
          <Card key={i}>
            <Text style={{ fontSize: 15 }}>
              <Text style={{ fontWeight: "bold" }}>{periodWindows.length-i}. Period&nbsp;&nbsp;</Text>
              <Text>{format(new Date(pw[0].date), "EE, dd.MM.yyyy")} - {format(new Date(pw[pw.length - 1].date), "EE, dd.MM.yyyy")}</Text>
            </Text>
          </Card>
        )
      })}
      {periodWindows.length === 0 && <Text style={{ opacity: 0.5 }}>No cycles tracked until now.</Text>}
      <Headline level={3}>{t('home_status_headline')}</Headline>
      <View style={styles.statsRow}>
        <Stats
          containerStyles={{ marginRight: 10 }}
          title={t('average_cycle_length')} 
          number={cycleLength} 
          numberSuffix={t('unit_days')}
          statusText={t(`cycle_length_status_${getCycleLengthStatus(cycleLength)}`)}
          statusIcon={
            cycleLength < 15 ? <Text>🤯&nbsp;</Text> :
            getCycleLengthStatus(cycleLength) === CYCLE_LENGTH_STATUS.NORMAL ?
            <AntDesign style={styles.statsStatusIcon} name="checkcircle" size={16} color="#389E0D" /> :
            <Entypo style={styles.statsStatusIcon} name="warning" size={16} color="#FFAB08" />
          }
          ></Stats>
        <Stats 
          title={t('average_period_length')} 
          number={periodLength} 
          numberSuffix={t('unit_days')}
          statusText={t(`period_length_status_${getPeriodLengthStatus(periodLength)}`)}
          statusIcon={
            getPeriodLengthStatus(periodLength) === PERIOD_LENGTH_STATUS.NORMAL ?
            <AntDesign style={styles.statsStatusIcon} name="checkcircle" size={16} color="#389E0D" /> :
            <Entypo style={styles.statsStatusIcon} name="warning" size={16} color="#FFAB08" />
          }
        ></Stats>
      </View>
      <View style={{ height: 20 }} />
      <View style={{ flex: 1, alignItems: "center" }}>
      <Pressable style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 20, paddingRight: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', width: "50%" }} onPress={() => askToReset()}>
        <Text style={{ textAlign: "center" }}>Reset</Text>
      </Pressable>
      </View>
      <View style={{ height: 20 }} />
      <Text style={{ color: '#999', textAlign: "center" }}>App Version: {Constants.manifest?.version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.light.background,
    paddingLeft: "5%",
    paddingRight: "5%",
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
  statsRow: {
    flex: 1,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: "bold"
  },
  statsStatus: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  statsStatusIcon: {
    marginRight: 5,
  },
  statsStatusText: {
    fontSize: 12,
    textTransform: "uppercase",
  },
});
