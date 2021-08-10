import * as React from 'react';
import Colors from './Colors';
import { Fontisto, Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export const get = (type: string, props = {}) => {
  switch(type) {
    case `tracking_option_bleeding_1`:
      return <Fontisto name="blood-drop" color={Colors.light.trackingOptions.bleeding} {...props} />
    case `tracking_option_bleeding_2`:
      return <Fontisto name="blood-drop" color={Colors.light.trackingOptions.bleeding} {...props} />
    case `tracking_option_bleeding_3`:
      return <Fontisto name="blood-drop" color={Colors.light.trackingOptions.bleeding} {...props} />
    case `tracking_option_bleeding_4`:
      return <Entypo name="water" color={Colors.light.trackingOptions.bleeding} {...props} />

    case `tracking_option_intercourse_1`:
      return <Entypo name="flower" color={Colors.light.trackingOptions.intercourse } {...props} />;
    case `tracking_option_intercourse_2`:
      return <FontAwesome name="life-ring" color={Colors.light.trackingOptions.intercourse } {...props} />;
    case `tracking_option_intercourse_3`:
      return <MaterialCommunityIcons name="rabbit" color={Colors.light.trackingOptions.intercourse } {...props} />;
    case `tracking_option_intercourse_4`:
      return <Ionicons name="heart-circle" color={Colors.light.trackingOptions.intercourse } {...props} />;

    case `tracking_option_pain_1`:
      return <FontAwesome name="bolt" color={Colors.light.trackingOptions.pain} {...props} />
    case `tracking_option_pain_2`:
      return <FontAwesome5 name="head-side-virus" color={Colors.light.trackingOptions.pain} {...props} />
    case `tracking_option_pain_3`:
      return <MaterialCommunityIcons name="volleyball" color={Colors.light.trackingOptions.pain} {...props} />
    case `tracking_option_pain_4`:
      return <MaterialCommunityIcons name="balloon" color={Colors.light.trackingOptions.pain} {...props} />

    case `tracking_option_emotion_1`:
      return <FontAwesome5 name="laugh-beam" color={Colors.light.trackingOptions.emotion} {...props} />
    case `tracking_option_emotion_2`:
      return <FontAwesome5 name="sad-cry" color={Colors.light.trackingOptions.emotion} {...props} />
    case `tracking_option_emotion_3`:
      return <FontAwesome5 name="feather-alt" color={Colors.light.trackingOptions.emotion} {...props} />
    case `tracking_option_emotion_4`:
      return <FontAwesome5 name="cloud-rain" color={Colors.light.trackingOptions.emotion} {...props} />

  }
}