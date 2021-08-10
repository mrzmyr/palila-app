import * as React from 'react';
import { View } from "react-native";
import Colors from "../constants/Colors";

import TrackingOptionButton from './TrackingOptionButton';

import { useTranslation } from 'react-i18next';
import Headline from './Headline';
import { get } from '../constants/Icons';

export default function TrackingOptionsEmotion({ trackingSymptoms, setTrackingSymptom }) {
  const { t } = useTranslation();
  
  return (
    <View>
    <Headline
      style={{ paddingLeft: 20, paddingRight: 20 }}
      level={3}
    >{t('tracking_option_emotion_headline')}</Headline>
    <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
      <TrackingOptionButton
        label={t(`tracking_option_emotion_1`)}
        icon={get(`tracking_option_emotion_1`, { size: 40 })}
        style={[trackingSymptoms.emotion_1 ? { borderColor: Colors.light.trackingOptions.emotion } : {}]}
        onPress={() => setTrackingSymptom('emotion_1', !trackingSymptoms.emotion_1 )}
      />
      <TrackingOptionButton
        label={t(`tracking_option_emotion_2`)}
        icon={get(`tracking_option_emotion_2`, { size: 40 })}
        style={[trackingSymptoms.emotion_2 ? { borderColor: Colors.light.trackingOptions.emotion } : {}]}
        onPress={() => setTrackingSymptom('emotion_2', !trackingSymptoms.emotion_2 )}
      />
    </View>
    <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
      <TrackingOptionButton
        label={t(`tracking_option_emotion_3`)}
        icon={get(`tracking_option_emotion_3`, { size: 40 })}
        style={[trackingSymptoms.emotion_3 ? { borderColor: Colors.light.trackingOptions.emotion } : {}]}
        onPress={() => setTrackingSymptom('emotion_3', !trackingSymptoms.emotion_3 )}
      />
      <TrackingOptionButton
        label={t(`tracking_option_emotion_4`)}
        icon={get(`tracking_option_emotion_4`, { size: 40 })}
        style={[trackingSymptoms.emotion_4 ? { borderColor: Colors.light.trackingOptions.emotion } : {}]}
        onPress={() => setTrackingSymptom('emotion_4', !trackingSymptoms.emotion_4 )}
      />
    </View>
    </View>
  );
}
