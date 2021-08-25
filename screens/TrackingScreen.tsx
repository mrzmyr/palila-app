import React, { useState } from "react";
import { StyleSheet, View, FlatList, Dimensions, Pressable, Text, Platform } from "react-native";

import TrackingOptionsBleeding from '../components/TrackingOptionsBleeding';
import TrackingOptionsIntercourse from '../components/TrackingOptionsIntercourse';
import TrackingOptionsPain from '../components/TrackingOptionsPain';
import TrackingOptionsEmotion from '../components/TrackingOptionsEmotion';
import TrackingOptionButton from '../components/TrackingOptionButton';
import { format } from '../services/i18n';
import Colors from "../constants/Colors";
import Headline from "../components/Headline";
import { get } from "../constants/Icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/core";

enum TrackingCategories {
  period = 1,
  intercourse = 2,
  pain = 3,
  emotion = 4,
}

export default function TrackingScreen({ onPressClose, trackingOptions, saveEntry }: { trackingOptions: TrackingOptions }) {

  const { t } = useTranslation();
  
  const [categorySelected, setCategorySelected] = useState<TrackingCategories>(TrackingCategories.period);

  let sliderWidth = Dimensions.get("window").width;
  
  let _flatListRef = null;

  const scrollToIndex = (index: TrackingCategories) => {
    _flatListRef.scrollToIndex({animated: true, index });
  }
  
  const _renderItem = ({ item }) => {
    return <View style={{ width: sliderWidth }}>{item}</View>;
  }
  
  const handleScroll = (event) => {
    let index = event.nativeEvent.contentOffset.x / sliderWidth;
    if([0, 1,2,3,4].includes(index)) {
      setCategorySelected(index + 1)
    }
  }

  const setTrackingSymptom = (key: string, value: number | boolean) => {
    console.log('set tracking option detail', key, value)
    saveEntry({
      ...trackingOptions,
      symptoms: {
        ...trackingOptions.symptoms,
        [key]: value
      }
    });

  }
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: Colors.light.background,
        paddingTop: Platform.select({ ios: 44 + 10, android: 0 + 10 }),
        // paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable 
            style={({ pressed }) => [{
              paddingLeft: 15, 
              paddingRight: 15,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 5,
              marginRight: 0,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }, pressed ? { backgroundColor: 'rgba(0,0,0,0.1)' } : {}]}
            onPress={() => onPressClose()}
          >
            <Text style={{ fontSize: 18 }}>{t('common_save')}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.modalView}>
      <Headline style={{ 
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
        }} 
        level={2}
      >{format(new Date(trackingOptions.date), 'iiii, dd. MMM')}</Headline>
        
      <View style={{ flexDirection: "row", width: "100%", paddingLeft: 20, paddingRight: 20 }}>
        <TrackingOptionButton
          label={t(`common_tracking_option_bleeding_headline`)}
          styleLabel={{ fontSize: 15 }}
          icon={get('tracking_option_bleeding_1', { size: 30, color: Colors.light.trackingOptions.bleeding })}
          style={[
            categorySelected === TrackingCategories.period ? { borderColor: Colors.light.trackingOptions.bleeding } : {},
            { flexBasis: 85 },
          ]}
          onPress={() => {
            setCategorySelected(TrackingCategories.period)
            scrollToIndex(0)
          }}
        />
        <TrackingOptionButton
          label={t(`common_tracking_option_intercourse_headline`)}
          styleLabel={{ fontSize: 15 }}
          icon={get('tracking_option_intercourse_1', { size: 30, color: Colors.light.trackingOptions.intercourse })}
          style={[
            categorySelected === TrackingCategories.intercourse ? { borderColor: Colors.light.trackingOptions.intercourse } : {},
            { flexBasis: 85 },
          ]}
          onPress={() => {
            setCategorySelected(TrackingCategories.intercourse)
            scrollToIndex(1)
          }}
        />
        <TrackingOptionButton
          label={t(`common_tracking_option_pain_headline`)}
          styleLabel={{ fontSize: 15 }}
          icon={get('tracking_option_pain_1', { size: 30, color: Colors.light.trackingOptions.pain })}
          style={[
            categorySelected === TrackingCategories.pain ? { borderColor: Colors.light.trackingOptions.pain } : {},
            { flexBasis: 85 },
          ]}
          onPress={() => {
            setCategorySelected(TrackingCategories.pain)
            scrollToIndex(2)
          }}
        />
        <TrackingOptionButton
          label={t(`common_tracking_option_emotion_headline`)}
          styleLabel={{ fontSize: 15 }}
          icon={get('tracking_option_emotion_1', { size: 30, color: Colors.light.trackingOptions.emotion })}
          style={[
            categorySelected === TrackingCategories.emotion ? { borderColor: Colors.light.trackingOptions.emotion } : {},
            { flexBasis: 85 },
          ]}
          onPress={() => {
            setCategorySelected(TrackingCategories.emotion)
            scrollToIndex(3)
          }}
        />
      </View>
      <FlatList
        onScroll={handleScroll}
        keyExtractor={(item, index) => index.toString()}
        data={[
          <TrackingOptionsBleeding 
            trackingSymptoms={trackingOptions.symptoms} 
            setTrackingSymptom={setTrackingSymptom}
          />,
          <TrackingOptionsIntercourse 
            trackingSymptoms={trackingOptions.symptoms} 
            setTrackingSymptom={setTrackingSymptom}
          />,
          <TrackingOptionsPain 
            trackingSymptoms={trackingOptions.symptoms} 
            setTrackingSymptom={setTrackingSymptom}
          />,
          <TrackingOptionsEmotion 
            trackingSymptoms={trackingOptions.symptoms} 
            setTrackingSymptom={setTrackingSymptom}
          />,
        ]}
        renderItem={({ item }) => _renderItem({ item })}
        ref={(ref) => { _flatListRef = ref; }}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 5,
  },
});
