import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import OverviewScreen from '../screens/OverviewScreen';
import CalendarScreenFull from '../screens/CalendarScreenFull';
import CalendarQuickScreen from '../screens/CalendarQuickScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TrackScreen from '../screens/TrackScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTracking } from '../services/useTracking';
import { View, Button, Pressable, Text } from 'react-native';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ navigation }) {
  const colorScheme = useColorScheme();
  const tracking = useTracking();

  return (
    <BottomTab.Navigator
      initialRouteName="Overview"
      tabBarOptions={{ 
        activeTintColor: Colors[colorScheme].tint 
      }}>
      <BottomTab.Screen
        name="Overview"
        component={OverviewScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="power-cycle" size={24} color={Colors[colorScheme].text} />,
        }}
      />
      {/* <BottomTab.Screen
        name="Track"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <AntDesign name="pluscircle" size={30} color={Colors.light.red[1]} />,
        }}
      /> */}
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreenFullNavigator}
        options={{
          tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color={Colors[colorScheme].text} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="cog" size={24} color={Colors[colorScheme].text} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function CalendarScreenFullNavigator({ navigation }) {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="CalendarScreenFull"
        component={CalendarScreenFull}
        options={{ 
          headerTitle: `Calendar`,
        }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
 
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TrackScreen"
        component={TrackScreen}
        options={{ headerTitle: `Track` }}
      />
    </TabTwoStack.Navigator>
  );
}

function OverviewScreenNavigator({ navigation }) {
  const colorScheme = useColorScheme();
  const tracking = useTracking()
  
  return (
    <TabTwoStack.Navigator mode="modal">
      <TabTwoStack.Screen
        name="OverviewScreen"
        component={OverviewScreen}
        options={{ 
          headerTitle: 'Overview',
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={() => navigation.navigate('CalendarQuickScreen')}>
                <Text style={{ fontSize: 15, paddingLeft: 10, paddingRight: 10, marginRight: 10 }}>Add Period</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <TabOneStack.Screen
        name="CalendarQuickScreen"
        component={CalendarQuickScreen}
        options={{ 
          headerTitle: `Add Period`,
          headerLeft: () => {},
          headerRight: () => (
            <Pressable style={{ padding: 5, borderRadius: 5, marginRight: 10, backgroundColor: '#EEE' }} onPress={() => navigation.navigate('OverviewScreen')}>
              <AntDesign name="close" size={24} color={'grey'} />
            </Pressable>
          ),
        }}
      />
    </TabTwoStack.Navigator>
  );
}

function SettingsScreenNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
    </TabTwoStack.Navigator>
  );
}
