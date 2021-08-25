import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, Text, Image, Dimensions } from 'react-native';

import { useTracking } from '../services/useTracking';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const openLink = async (link: string) => {
  await WebBrowser.openBrowserAsync(link);
};
import Headline from '../components/Headline';

import Constants from 'expo-constants';
import { AntDesign, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getCycleLengthStatus, getPeriodLengthStatus } from '../services/TrackingService';
import { CYCLE_LENGTH_STATUS, PERIOD_LENGTH_STATUS, TrackingEntry } from '../types/tracking';
import MenuList from '../components/MenuList';
import MenuListItem from '../components/MenuListItem';
import { useNavigation } from '@react-navigation/native';

function Stats({ title, onPressInfo = null, statusText = null, statusIcon = null, number, numberSuffix, containerStyles }) {
  return (
    <View style={{ ...styles.statsContainer, ...containerStyles }}>
      <Text style={styles.statsTitle}>{title}</Text>
      <View style={{
        position: 'absolute', 
        right: 10, 
        top: 5,
        padding: 10,
      }}>
      {/* <Feather onPress={onPressInfo} name="info" size={20} color="rgba(0,0,0,0.3)" /> */}
      </View>
      <Text style={styles.statsNumber}>{number} {numberSuffix && numberSuffix}</Text>
      <View style={styles.statsStatus}>
        {statusIcon}
        {statusText && <Text style={styles.statsStatusText}>{statusText}</Text>}
      </View>
    </View>
  );
}


let openShareDialogAsync = async (uri) => {
  if (!(await Sharing.isAvailableAsync())) {
    alert(`Uh oh, sharing isn't available on your platform`);
    return;
  }

  await Sharing.shareAsync(uri);
}; 

const importEntries = async () => {
  let doc = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true });
  let contents = await FileSystem.readAsStringAsync(doc.uri);
  return JSON.parse(contents);
}

const exportEntries = async (entries: TrackingEntry[]) => {
  await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `export.json`, JSON.stringify(entries));
  openShareDialogAsync(FileSystem.documentDirectory + `export.json`)
}

export default function SettingsScreen() {
  
  const { t } = useTranslation();
  const { state: { entries, periodWindows, cycleLength, periodLength }, dispatch } = useTracking();

  const navigation = useNavigation();

  const askToReset = () => {    
    Alert.alert(
      t('screens_settings_delete_data_modal_title'),
      t('screens_settings_delete_data_modal_body'),
      [
        {
          text: t('screens_settings_delete_data_modal_confirm'),
          onPress: () => {
            dispatch({ type: 'reset_entries' })
            showMessage({
              message: t('screens_settings_delete_data_modal_notification'),
            });
          },
          style: "destructive"
        },
        { 
          text: t('screens_settings_delete_data_modal_cancel'), 
          onPress: () =>  {},
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Headline level={4}>{t('screens_settings_your_cycles')}</Headline>
      <View style={styles.statsRow}>
        <Stats
          containerStyles={{ marginRight: 10 }}
          title={t('common_average_cycle_length')} 
          number={cycleLength}
          numberSuffix={t('common_unit_days')}
          onPressInfo={() => navigation.navigate('SettingsWebViewScreen', { uri: t('links_faq') } )}
          statusText={t(`common_cycle_length_status_${getCycleLengthStatus(cycleLength)}`)}
          statusIcon={
            getCycleLengthStatus(cycleLength) === CYCLE_LENGTH_STATUS.NORMAL ?
            <AntDesign style={styles.statsStatusIcon} name="checkcircle" size={16} color="#389E0D" /> :
            <Entypo style={styles.statsStatusIcon} name="warning" size={16} color="#FFAB08" />
          }
          ></Stats>
        <Stats 
          title={t('common_average_period_length')} 
          number={periodLength} 
          numberSuffix={t('common_unit_days')}
          onPressInfo={() => navigation.navigate('SettingsWebViewScreen', { uri: t('links_period_length') } )}
          statusText={t(`common_period_length_status_${getPeriodLengthStatus(periodLength)}`)}
          statusIcon={
            getPeriodLengthStatus(periodLength) === PERIOD_LENGTH_STATUS.NORMAL ?
            <AntDesign style={styles.statsStatusIcon} name="checkcircle" size={16} color="#389E0D" /> :
            <Entypo style={styles.statsStatusIcon} name="warning" size={16} color="#FFAB08" />
          }
        ></Stats>
      </View>
      <Headline level={4}>{t('screens_settings_your_data')}</Headline>
      <MenuList>
        <MenuListItem
          title={t('screens_settings_your_data_export')}
          onPress={() => exportEntries(entries)}
          icon={<AntDesign name="upload" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
        <MenuListItem
          title={t('screens_settings_your_data_import')}
          onPress={async () => {
            let newEntries = await importEntries()
            dispatch({ type: 'import_entries', payload: { entries: newEntries } })
          }}
          icon={<AntDesign name="download" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
        <MenuListItem
          title={t('screens_settings_your_data_delete_data')}
          onPress={() => askToReset()}
          icon={<AntDesign name="delete" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
      </MenuList>
      <Headline level={4}>{t('screens_settings_help')}</Headline>
      <MenuList>
        <MenuListItem
          title={t('screens_settings_help_faq')}
          onPress={() => navigation.navigate('SettingsWebViewScreen', { uri: t('links_faq') } )}
          icon={<AntDesign name="right" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
        <MenuListItem
          title={t('screens_settings_help_restart_intro')}
          onPress={() =>   navigation.navigate('IntroScreen')}
          icon={<SimpleLineIcons name="screen-smartphone" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
      </MenuList>
      <Headline level={4}>{t('screens_settings_about')}</Headline>
      <MenuList>
        <MenuListItem
          title={t('screens_settings_about_tos')}
          onPress={() => navigation.navigate('SettingsWebViewScreen', { uri: t('links_terms_of_use') } )}
          icon={<AntDesign name="right" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
        <MenuListItem
          title={t('screens_settings_about_privacy')}
          onPress={() => navigation.navigate('SettingsWebViewScreen', { uri: t('links_privacy_policy') } )}
          icon={<AntDesign name="right" size={18} color="rgba(0,0,0,0.2)" />}
        ></MenuListItem>
      </MenuList>
      <View style={{ height: 20 }} />
      <Text style={{ color: 'rgba(0,0,0,0.5)', textAlign: "center" }}>{t('screens_settings_app_version')}: {Constants.manifest?.version}</Text>
      <View style={{ height: 20 }} />
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
    justifyContent: "space-between",
    flexDirection: "row",
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 0.5,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    width: "80%",
  },
  statsNumber: {
    fontSize: 28,
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
