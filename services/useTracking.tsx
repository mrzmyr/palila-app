import React, { useEffect, useContext, useState, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  TrackingEntry,
} from '../types/tracking';
import { getAverageCycleLength, getAveragePeriodLength, getPeriodWindows } from './TrackingService';

export const STORAGE_ENTRIES_KEY = '@entries'; 

const initialState = {
  entries: [],
  periodWindows: [],
  cycleLength: getAverageCycleLength([]),
  periodLength: getAveragePeriodLength([]),
  ovulationDistance: getAverageCycleLength([])/2
};

const TrackingContext = React.createContext({
  state: initialState,
  dispatch: (action: { type: string, payload?: {} }) => {},
})

function reducer(state, action) {

  switch (action.type) {
    case 'add_entry':
      const newEntries = [...state.entries, action.payload.entry]
      
      // showMessage({
      //   message: "Recalculating predictions…",
      // });
      
      let addPeriodWindows = getPeriodWindows(newEntries);
      let addCycleLength = getAverageCycleLength(addPeriodWindows);
      let addPeriodLength = getAveragePeriodLength(addPeriodWindows);
      let addOvulationDistance = addCycleLength/2;
      
      return {
        ...state,
        entries: newEntries,
        periodWindows: addPeriodWindows, 
        cycleLength: addCycleLength, 
        periodLength: addPeriodLength, 
        ovulationDistance: addOvulationDistance
      };

    case 'remove_entry':
      const newEntriesRemove = [...state.entries]

      let removeIndex = newEntriesRemove.findIndex((e: TrackingEntry) => e.date === action.payload.date)
      if(removeIndex === -1) throw Error('entry not found')
      newEntriesRemove.splice(removeIndex, 1)

      let removePeriodWindows = getPeriodWindows(newEntriesRemove);
      let removeCycleLength = getAverageCycleLength(removePeriodWindows);
      let removePeriodLength = getAveragePeriodLength(removePeriodWindows);
      let removeOvulationDistance = removeCycleLength/2;

      return {
        ...state,
        entries: newEntriesRemove, 
        periodWindows: removePeriodWindows, 
        cycleLength: removeCycleLength, 
        periodLength: removePeriodLength, 
        ovulationDistance: removeOvulationDistance
      };

    case 'update_entry':
      const newEntriesUpdate = [...state.entries]

      let updateIndex = newEntriesUpdate.findIndex((e: TrackingEntry) => e.date === action.payload.entry.date)
      if(updateIndex === -1) throw Error('entry not found')
      newEntriesUpdate[updateIndex] = { ...newEntriesUpdate[updateIndex], ...action.payload.entry };

      let updatePeriodWindows = getPeriodWindows(newEntriesUpdate);
      let updateCycleLength = getAverageCycleLength(updatePeriodWindows);
      let updatePeriodLength = getAveragePeriodLength(updatePeriodWindows);
      let updateOvulationDistance = updateCycleLength/2;

      console.log('entry updated', newEntriesUpdate[updateIndex].date)

      return {
        ...state,
        entries: newEntriesUpdate, 
        periodWindows: updatePeriodWindows, 
        cycleLength: updateCycleLength, 
        periodLength: updatePeriodLength, 
        ovulationDistance: updateOvulationDistance
      };
    case 'import_entries':

      let importPeriodWindows = getPeriodWindows(action.payload.entries);
      let importCycleLength = getAverageCycleLength(importPeriodWindows);
      let importPeriodLength = getAveragePeriodLength(importPeriodWindows);
      let importOvulationDistance = importCycleLength/2;

      return {
        ...state,
        entries: action.payload.entries, 
        periodWindows: importPeriodWindows, 
        cycleLength: importCycleLength, 
        periodLength: importPeriodLength, 
        ovulationDistance: importOvulationDistance
      };
      
    case 'reset_entries':
      return { ...initialState }
    default:
      throw new Error();
  }
}

export const TrackingProvider = ({ children, initialEntries }) => {

  let initialPeriodWindows = getPeriodWindows(initialEntries);
  let initialCycleLength = getAverageCycleLength(initialPeriodWindows);
  let initialPeriodLength = getAveragePeriodLength(initialPeriodWindows);
  let initialOvulationDistance = initialCycleLength/2;
  
  const [state, dispatch] = useReducer(reducer, { 
    ...initialState, 
    entries: initialEntries,
    periodWindows: initialPeriodWindows,
    cycleLength: initialCycleLength,
    periodLength: initialPeriodLength,
    ovulationDistance: initialOvulationDistance,
  });
  
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(state.entries));
    console.log('save entries to async storage')
  }, [state.entries])

  return (
    <TrackingContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
      {children}
    </TrackingContext.Provider>
  );
}

export const useTracking = () => useContext(TrackingContext)
