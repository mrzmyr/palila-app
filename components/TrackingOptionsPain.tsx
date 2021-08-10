import * as React from 'react';
import { View } from "react-native";
import Colors from "../constants/Colors";

import TrackingOptionButton from './TrackingOptionButton';
import { useTranslation } from 'react-i18next';
import Headline from './Headline';
import { get } from '../constants/Icons';

export default function TrackingOptionsPain({ trackingSymptoms, setTrackingSymptom }) {
  const { t } = useTranslation();
  
  return (
    <View>
      <Headline
        style={{ paddingLeft: 20, paddingRight: 20 }}
        level={3}
      >{t('tracking_option_pain_headline')}</Headline>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`tracking_option_pain_1`)}
          icon={get(`tracking_option_pain_1`, { size: 40, color: Colors.light.trackingOptions.pain })}
          style={[trackingSymptoms.pain_1 ? { borderColor: Colors.light.trackingOptions.pain } : {}]}
          onPress={() => setTrackingSymptom('pain_1', !trackingSymptoms.pain_1 )}
        />
        <TrackingOptionButton
          label={t(`tracking_option_pain_2`)}
          icon={get(`tracking_option_pain_2`, { size: 40, color: Colors.light.trackingOptions.pain })}
          style={[trackingSymptoms.pain_2 ? { borderColor: Colors.light.trackingOptions.pain } : {}]}
          onPress={() => setTrackingSymptom('pain_2', !trackingSymptoms.pain_2 )}
        />
      </View>
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20, justifyContent: 'flex-start' }}>
        <TrackingOptionButton
          label={t(`tracking_option_pain_3`)}
          icon={get(`tracking_option_pain_3`, { size: 40, color: Colors.light.trackingOptions.pain })}
          style={[trackingSymptoms.pain_3 ? { borderColor: Colors.light.trackingOptions.pain } : {}]}
          onPress={() => setTrackingSymptom('pain_3', !trackingSymptoms.pain_3 )}
        />
        <TrackingOptionButton
          label={t(`tracking_option_pain_4`)}
          icon={get(`tracking_option_pain_4`, { size: 40, color: Colors.light.trackingOptions.pain })}
          style={[trackingSymptoms.pain_4 ? { borderColor: Colors.light.trackingOptions.pain } : {}]}
          onPress={() => setTrackingSymptom('pain_4', !trackingSymptoms.pain_4 )}
        />
      </View>
    </View>
  );
}
