import * as React from 'react';
import { View } from "react-native";
import Colors from "../constants/Colors";

import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TrackingOptionButton from './TrackingOptionButton';
import Headline from './Headline';
import { useTranslation } from 'react-i18next';
import { get } from '../constants/Icons';

export enum TRACKING_OPTION_INTERCOURSE {
  UNPROTECTED = 1,
  PRODTECTED = 2,
  HIGH_SEX_DRIVE = 3,
  MASTURBATION = 4,
}

export default function TrackingOptionsIntercourse({ trackingSymptoms, setTrackingSymptom }) {
  const { t } = useTranslation();

  return (
    <View>
      <Headline
        style={{ paddingLeft: 20, paddingRight: 20 }}
        level={3}
      >{t('tracking_option_intercourse_headline')}</Headline>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`tracking_option_intercourse_${1}`)}
          icon={get(`tracking_option_intercourse_${1}`, { size: 40 })}
          style={[trackingSymptoms.intercourse_1 ? { borderColor: Colors.light.trackingOptions.intercourse } : {}]}
          onPress={() => setTrackingSymptom('intercourse_1', !trackingSymptoms.intercourse_1 )}
        />
        <TrackingOptionButton
          label={t(`tracking_option_intercourse_${2}`)}
          icon={get(`tracking_option_intercourse_${2}`, { size: 40 })}
          style={[trackingSymptoms.intercourse_2 ? { borderColor: Colors.light.trackingOptions.intercourse } : {}]}
          onPress={() => setTrackingSymptom('intercourse_2', !trackingSymptoms.intercourse_2 )}
        />
      </View>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`tracking_option_intercourse_${3}`)}
          icon={get(`tracking_option_intercourse_${3}`, { size: 40 })}
          style={[trackingSymptoms.intercourse_3 ? { borderColor: Colors.light.trackingOptions.intercourse } : {}]}
          onPress={() => setTrackingSymptom('intercourse_3', !trackingSymptoms.intercourse_3 )}
        />
        <TrackingOptionButton
          label={t(`tracking_option_intercourse_${4}`)}
          icon={get(`tracking_option_intercourse_${4}`, { size: 40 })}
          style={[trackingSymptoms.intercourse_4 ? { borderColor: Colors.light.trackingOptions.intercourse } : {}]}
          onPress={() => setTrackingSymptom('intercourse_4', !trackingSymptoms.intercourse_4 )}
        />
      </View>
    </View>
  );
}
