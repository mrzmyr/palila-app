import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState, useReducer } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import {Picker} from '@react-native-picker/picker';
import { AVG_CYCLE_LENGTH, AVG_PERIOD_LENGTH } from '../services/TrackingService';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import CalendarQuickDay from '../components/CalendarQuickDay';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton';
import Switcher from '../components/Switcher';

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const cycleLengthArr = range(10, 90, 1);
const periodLengthArr = range(1, 20, 1);


function reducer(state, action) {
  switch (action.type) {
    case 'set_cycle_length':
      return {
        ...state,
        cycleLength: action.payload.cycleLength,
      };
    case 'set_period_length':
      return {
        ...state,
        periodLength: action.payload.periodLength,
      };
    case 'set_period_start':
      return {
        ...state,
        periodStart: action.payload.periodStart,
      };
    case 'set_predictions':
      return {
        ...state,
        predictions: action.payload.predictions,
      };
  }
}

const Headline = ({ children }) => {
  return (
    <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>{children}</Text>
  )
}

const Body = ({ children }) => {
  return (
    <Text style={{ padding: 15, fontSize: 16, textAlign: 'center' }}>{children}</Text>
  )
}

const Hint = ({ children, style = {} }) => {
  return (
    <Text style={{ 
      ...style,
      paddingTop: 5, 
      paddingBottom: 25, 
      paddingLeft: 20,
      paddingRight: 20,
      fontSize: 15, 
      opacity: 0.5,
    }}>{children}</Text>
  )
}

const Welcome = ({ goNext }) => {
  const { t } = useTranslation();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between',
    }}>
      <View></View>
      <View style={{ justifyContent: 'center' }}>
        <Headline>{t('intro_welcome_title')}</Headline>
        <Body>{t('intro_welcome_body')}</Body>
      </View>
      <View>
        <Button title={t('common_next')} onPress={goNext} style={{ marginTop: 10 }} />
        <View style={{ height: 40 }}></View>
      </View>
    </View>
  )
}

const PeriodStart = ({ goNext, goBack, dispatch }) => {
  const { t } = useTranslation();
  const dateStringToday = (new Date()).toISOString().split('T')[0];
  const [periodStart, setPeriodStart] = useState(dateStringToday);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
    }}>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton title={t('common_back')} onPress={goBack} icon={<AntDesign name="left" size={24} color={Colors.light.red[1]} />} />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Headline>{t('intro_period_start_title')}</Headline>
        <Body>{t('intro_period_start_body')}</Body>
        <View>
        <Calendar
          dayComponent={CalendarQuickDay}
          onDayPress={(date) => {
            setPeriodStart(date.dateString)
            dispatch('set_period_start', { periodStart: new Date(date.dateString) })
          }}
          // Enable or disable vertical scroll indicator. Default = false
          theme={{
            // textDisabledColor: Colors.light.text,
            calendarBackground: Colors.light.background,
            arrowColor: '#000',
            'stylesheet.calendar.header': {
              week: { 
                marginTop: 7,
                marginBottom: 7,
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 3,
                borderTopColor: 'rgba(0,0,0,0.1)',
                borderTopWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.1)',
                borderBottomWidth: 1,
              },
              dayTextAtIndex0: { color: Colors.light.text },
              dayTextAtIndex1: { color: Colors.light.text },
              dayTextAtIndex2: { color: Colors.light.text },
              dayTextAtIndex3: { color: Colors.light.text },
              dayTextAtIndex4: { color: Colors.light.text },
              dayTextAtIndex5: { color: Colors.light.text },
              dayTextAtIndex6: { color: Colors.light.text },
            },
          }}
          calendarWidth={320}
          markingType={'custom'}
          markedDates={{ [periodStart]: {
            customStyles: {
              container: { backgroundColor: Colors.light.codes.period },
              text: { color: 'white' }
            }
          }}}
          firstDay={1}
          selected={dateStringToday}
          maxDate={dateStringToday}
        />
        </View>
        <Hint style={{ textAlign: 'center' }}>{t('intro_period_start_hint')}</Hint>
      </View>
      <View>
      <Button 
          title={t('common_next')} 
          onPress={() => {
            dispatch({ type: 'set_period_start', payload: { periodStart } })
            goNext()
          }} 
          style={{ marginTop: 10 }} 
        />
        <LinkButton title={t('common_skip')} onPress={goNext} />
      </View>
    </View>
  )
}

const CycleLength = ({ goNext, goBack, dispatch }) => {
  const { t } = useTranslation();
  const [cycleLength, setCycleLength] = useState(AVG_CYCLE_LENGTH);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
    }}>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton title={t('common_back')} onPress={goBack} icon={<AntDesign name="left" size={24} color="black" />} />
      </View>
      <View style={{ justifyContent: 'center' }}>
      <Headline>{t('intro_cycle_length_title')}</Headline>
        <Body>{t('intro_cycle_length_body')}</Body>
        <Picker
          selectedValue={cycleLength}
          onValueChange={(itemValue, itemIndex) => setCycleLength(itemValue)}
        >
            {cycleLengthArr.map(i => <Picker.Item key={i.toString()} label={`${i} ${t('common_unit_days')}`} value={i} />)}
        </Picker>
        <Hint style={{ textAlign: 'center' }}>{t('intro_cycle_length_hint')}</Hint>
      </View>
      <View>
        <Button 
          title={t('common_next')} 
          onPress={() => {
            dispatch({ type: 'set_cycle_length', payload: { cycleLength } })
            goNext()
          }} 
          style={{ marginTop: 10 }} 
        />
        <LinkButton title={t('common_skip')} onPress={goNext} />
      </View>
    </View>
  )
}

const PeriodLength = ({ goNext, goBack, dispatch }) => {
  const { t } = useTranslation();
  const [periodLength, setPeriodLength] = useState(AVG_PERIOD_LENGTH);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
    }}>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton title={t('common_back')} onPress={goBack} icon={<AntDesign name="left" size={24} color="black" />} />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Headline>{t('intro_period_length_title')}</Headline>
        <Body>{t('intro_period_length_body')}</Body>
        <Picker
          selectedValue={periodLength}
          onValueChange={(itemValue, itemIndex) => setPeriodLength(itemValue)}
        >
            {periodLengthArr.map(i => <Picker.Item key={i.toString()} label={`${i} ${t('common_unit_days')}`} value={i} />)}
        </Picker>
        <Hint style={{ textAlign: 'center' }}>{t('intro_period_length_hint')}</Hint>
      </View>
      <View>
      <Button 
          title={t('common_next')} 
          onPress={() => {
            dispatch({ type: 'set_period_length', payload: { periodLength } })
            goNext()
          }} 
          style={{ marginTop: 10 }} 
        />
        <LinkButton title={t('common_skip')} onPress={goNext} />
      </View>
    </View>
  )
}

const Predictions = ({ goNext, goBack, dispatch }) => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState({
    period: true,
    pms: true,
    fertility: false,
  });

  return (
    <View style={{
      flex: 1,
      justifyContent: 'flex-start',
    }}>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton title={t('common_back')} onPress={goBack} icon={<AntDesign name="left" size={24} color="black" />} />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Headline>{t('intro_predictions_title')}</Headline>
        <Body>{t('intro_predictions_body')}</Body>
        <Switcher title={t('intro_predictions_period_title')} onValueChange={() => setPredictions({ ...predictions, period: !predictions.period })} value={predictions.period} />
        <Hint>{t('intro_predictions_period_hint')}</Hint>
        <Switcher title={t('intro_predictions_fertility_title')} onValueChange={() => setPredictions({ ...predictions, fertility: !predictions.fertility })} value={predictions.fertility} />
        <Hint>{t('intro_predictions_fertility_hint')}</Hint>
        <Switcher title={t('intro_predictions_pms_title')} onValueChange={() => setPredictions({ ...predictions, pms: !predictions.pms })} value={predictions.pms} />
        <Hint>{t('intro_predictions_pms_hint')}</Hint>
      </View>
      <View>
      <Button 
          title={t('common_done')} 
          onPress={() => {
            dispatch({ type: 'set_predictions', payload: { predictions } })
            goNext()
          }} 
          style={{ marginTop: 10 }} 
        />
        <View style={{ height: 40 }}></View>
      </View>
    </View>
  )
}

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function IntroScreen() {
  
  const navigation = useNavigation()
  
  let sliderWidth = WINDOW_WIDTH;
  let _flatListRef = null;

  const scrollToIndex = (index, animated = true) => {
    _flatListRef.scrollToIndex({animated, index });
  }

  const _renderItem = ({ item }) => {
    return <View style={{ width: sliderWidth, paddingTop: 60, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>{item}</View>;
  }

  useEffect(() => {
    scrollToIndex(0, false)
  }, [_flatListRef])

  const [state, dispatch] = useReducer(reducer, {
    cycleLength: AVG_CYCLE_LENGTH,
    periodLength: AVG_PERIOD_LENGTH,
    periodStart: new Date(),
  });

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.light.background,
    }}>
      <FlatList
        style={{
          flex: 1,
        }}
        keyExtractor={(item, index) => index.toString()}
        data={[
          <Welcome goNext={() => scrollToIndex(1)} />,
          <PeriodStart dispatch={dispatch} goNext={() => scrollToIndex(2)} goBack={() => scrollToIndex(0)} />,
          <PeriodLength dispatch={dispatch} goNext={() => scrollToIndex(3)} goBack={() => scrollToIndex(1)} />,
          <CycleLength dispatch={dispatch} goNext={() => scrollToIndex(4)} goBack={() => scrollToIndex(2)} />,
          <Predictions dispatch={dispatch} goNext={() => navigation.goBack()} goBack={() => scrollToIndex(3)} />,
        ]}
        onScrollToIndexFailed={({
          index,
          averageItemLength,
        }) => {
          // Layout doesn't know the exact location of the requested element.
          // Falling back to calculating the destination manually
          _flatListRef.current?.scrollToOffset({
            offset: index * averageItemLength,
            animated: true,
          });
        }}
        renderItem={({ item }) => _renderItem({ item })}
        ref={(ref) => { _flatListRef = ref; }}
        scrollEnabled={false}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});
