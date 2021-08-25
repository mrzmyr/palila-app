import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { STORAGE_ENTRIES_KEY, TrackingProvider } from './services/useTracking';
import './services/i18n.js'

import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingEntry } from './types/tracking';

async function changeScreenOrientation() {
  try {
    // console.log(await ScreenOrientation.supportsOrientationLockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP))
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  } catch(e) {
    console.error(e)
  }
}

changeScreenOrientation()
enableScreens();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [initialEntries, setInitialEntries] = useState<null | TrackingEntry[]>(null);

  useEffect(() => {

    AsyncStorage.getItem(STORAGE_ENTRIES_KEY).then(entries => {
      try {
        if(entries === null) {
          setInitialEntries([]);
          AsyncStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify([]));
          console.log('entires were null, set to []')
        } else {
          setInitialEntries(JSON.parse(entries));
          console.log('loaded', JSON.parse(entries).length)
        }
      } catch(e) {
        console.error('loading error')
      }
    })
  }, [])

  if (!isLoadingComplete || initialEntries === null) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <TrackingProvider initialEntries={initialEntries}>
          <Navigation colorScheme={colorScheme} />
        </TrackingProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
