import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import OverviewScreen from '../screens/OverviewScreen';
import CalendarScreenFull from '../screens/CalendarScreenFull';
import CalendarQuickScreen from '../screens/CalendarQuickScreen';
import CalendarHelpScreen from '../screens/CalendarHelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IntroScreen from '../screens/IntroScreen';
import WebViewScreen from '../screens/WebViewScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { View, Pressable, Text, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ navigation }) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const iconColor = colorScheme === 'light' ? '#000' : '#FFF';
  
  return (
    <BottomTab.Navigator
      initialRouteName={t('screens_overview_tabTitle')}
      screenOptions={{
      }}>
      <BottomTab.Screen
        name={t('screens_overview_tabTitle')}
        component={OverviewScreenNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Entypo style={{ marginTop: 5, marginBottom: 5, opacity: focused ? 1 : 0.5 }} name="home" size={24} color={iconColor} />,
          tabBarLabel: () => {},
        }}
      />
      <BottomTab.Screen
        name={t('screens_calendar_tabTitle')}
        component={CalendarScreenFullNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Entypo style={{ marginTop: 5, marginBottom: 5, opacity: focused ? 1 : 0.5 }} name="calendar" size={24} color={iconColor} />,
          tabBarLabel: () => {},
        }}
      />
      <BottomTab.Screen
        name={t('screens_settings_tabTitle')}
        component={SettingsScreenNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <Entypo style={{ marginTop: 5, marginBottom: 5, opacity: focused ? 1 : 0.5 }} name="cog" size={24} color={iconColor} />,
          tabBarLabel: () => {},
        }}
      />
    </BottomTab.Navigator>
  );
}

const CalendarStack = createNativeStackNavigator<TabOneParamList>();

function CalendarScreenFullNavigator({ navigation }) {
  const { t } = useTranslation();

  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'light' ? '#000' : '#FFF';
  
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarScreenFull"
        component={CalendarScreenFull}
        options={{ 
          headerTitle: t('screens_calendar_title'),
          headerRight: () => (
            <Pressable 
            style={({ pressed }) => [{
              padding: 7, borderRadius: 5, marginRight: -10,
            }, pressed ? { backgroundColor: '#EEE' } : {}]}
            onPress={() => navigation.navigate('CalendarHelpScreen')}>
              <Feather name="info" size={24} color={iconColor} />
            </Pressable>
          ),
        }}
      />
      <CalendarStack.Screen
        name="CalendarHelpScreen"
        component={CalendarHelpScreen}
        options={{ 
          headerTitle: 'Help',
          presentation: 'modal',
          headerLeft: () => {},
          headerRight: () => (
            <Pressable 
            style={({ pressed }) => [{
              padding: 5, borderRadius: 5, marginRight: 10,
              opacity: Platform.select({ ios: 1, android: 0 }),
            }, pressed ? { backgroundColor: '#EEE' } : {}]}
            onPress={() => navigation.navigate('CalendarScreenFull')}>
              <AntDesign name="close" size={24} color={iconColor} />
            </Pressable>
          ),
        }}
      />
    </CalendarStack.Navigator>
  );
}

const OverviewStack = createNativeStackNavigator<TabTwoParamList>();

function OverviewScreenNavigator({ navigation }) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? '#000' : '#FFF';
  
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen
        name="OverviewScreen"
        component={OverviewScreen}
        options={{
          headerStyle: {
            height: 50
          },
          headerTitle: t('screens_overview_title'),
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable 
               style={({ pressed }) => [{
                  paddingLeft: 15, 
                  paddingRight: 15,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 5,
                  marginRight: -10,
                  opacity: pressed ? 0.5 : 1
                }]}
                onPress={() => navigation.navigate('CalendarQuickScreen')}
              >
                <Text style={{ fontSize: 15, color: textColor }}>{t('screens_overview_add_period')}</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <OverviewStack.Screen
        name="CalendarQuickScreen"
        component={CalendarQuickScreen}
        options={{ 
          headerTitle: t('screens_overview_add_period'),
          presentation: 'modal',
          headerLeft: () => {},
          headerRight: () => (
            <Pressable 
            style={({ pressed }) => [{
              padding: 5, borderRadius: 5, marginRight: -10,
              opacity: Platform.select({ ios: 1, android: 0 })
            }, pressed ? { backgroundColor: '#EEE' } : {}]}
            onPress={() => navigation.navigate('OverviewScreen')}>
              <AntDesign name="close" size={24} color={'grey'} />
            </Pressable>
          ),
        }}
      />
      <OverviewStack.Group screenOptions={{ presentation: 'formSheet' }}>
        <OverviewStack.Screen 
          name="OverviewWebViewScreen" 
          component={WebViewScreen}
          options={{ 
            headerTitle: '',
            headerRight: () => {
              return <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={18} color="black" /></Pressable>
            }
          }}
        />
      </OverviewStack.Group>
    </OverviewStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsScreenNavigator({ navigation }) {
  const { t } = useTranslation();
  
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerTitle: t('screens_settings_title') }}
      />
      <SettingsStack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
        <SettingsStack.Screen name="IntroScreen" component={IntroScreen} />
      </SettingsStack.Group>
      <SettingsStack.Group screenOptions={{ presentation: 'formSheet' }}>
        <SettingsStack.Screen 
          name="SettingsWebViewScreen" 
          component={WebViewScreen}
          options={{ 
            headerTitle: '',
            headerRight: () => {
              return <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={18} color="black" /></Pressable>
            }
          }}
        />
      </SettingsStack.Group>
    </SettingsStack.Navigator>
  );
}