import * as React from 'react';
import { View } from "react-native";
import Colors from "../constants/Colors";

import { get } from '../constants/Icons'

import TrackingOptionButton from './TrackingOptionButton';
import { useTranslation } from 'react-i18next';
import Headline from './Headline';

export default function TrackingOptionsBleeding({ trackingSymptoms, setTrackingSymptom }) {
  const { t } = useTranslation();
  
  return (
    <View>
      <Headline
        style={{ paddingLeft: 20, paddingRight: 20 }}
        level={3}
      >{t('tracking_option_bleeding_headline')}</Headline>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`tracking_option_bleeding_1`)}
          icon={get(`tracking_option_bleeding_1`, { size: 25 })}
          style={[trackingSymptoms.bleeding === 1 ? { borderColor: Colors.light.trackingOptions.bleeding } : {}]}
          onPress={() => setTrackingSymptom('bleeding', trackingSymptoms.bleeding === 1 ? 0 : 1)}
        />
        <TrackingOptionButton
          label={t(`tracking_option_bleeding_2`)}
          icon={get(`tracking_option_bleeding_2`, { size: 35 })}
          style={[trackingSymptoms.bleeding === 2 ? { borderColor: Colors.light.trackingOptions.bleeding } : {}]}
          onPress={() => setTrackingSymptom('bleeding', trackingSymptoms.bleeding === 2 ? 0 : 2)}
        />
      </View>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`tracking_option_bleeding_3`)}
          icon={get(`tracking_option_bleeding_3`, { size: 45 })}
          style={[trackingSymptoms.bleeding === 3 ? { borderColor: Colors.light.trackingOptions.bleeding } : {}]}
          onPress={() => setTrackingSymptom('bleeding', trackingSymptoms.bleeding === 3 ? 0 : 3)}
        />
        <TrackingOptionButton
          label={t(`tracking_option_bleeding_4`)}
          icon={get(`tracking_option_bleeding_4`, { size: 40 })}
          style={[trackingSymptoms.bleeding === 4 ? { borderColor: Colors.light.trackingOptions.bleeding } : {}]}
          onPress={() => setTrackingSymptom('bleeding', trackingSymptoms.bleeding === 4 ? 0 : 4)}
        />
      </View>
    </View>
    );
}
