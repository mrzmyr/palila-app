import React, { useEffect, useContext, useState, useReducer } from 'react';
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
      state.entries.push(action.payload.entry)
      
      let addPeriodWindows = getPeriodWindows(state.entries);
      let addCycleLength = getAverageCycleLength(addPeriodWindows);
      let addPeriodLength = getAveragePeriodLength(addPeriodWindows);
      let addOvulationDistance = addCycleLength/2;
      
      return {
        ...state,
        entries: state.entries, 
        periodWindows: addPeriodWindows, 
        cycleLength: addCycleLength, 
        periodLength: addPeriodLength, 
        ovulationDistance: addOvulationDistance
      };

    case 'remove_entry':
      let removeIndex = state.entries.findIndex((e: TrackingEntry) => e.date === action.payload.date)
      if(removeIndex === -1) throw Error('entry not found')
      state.entries.splice(removeIndex, 1)

      let removePeriodWindows = getPeriodWindows(state.entries);
      let removeCycleLength = getAverageCycleLength(removePeriodWindows);
      let removePeriodLength = getAveragePeriodLength(removePeriodWindows);
      let removeOvulationDistance = removeCycleLength/2;

      return {
        ...state,
        entries: state.entries, 
        periodWindows: removePeriodWindows, 
        cycleLength: removeCycleLength, 
        periodLength: removePeriodLength, 
        ovulationDistance: removeOvulationDistance
      };

    case 'update_entry':
      let updateIndex = state.entries.findIndex((e: TrackingEntry) => e.date === action.payload.entry.date)
      if(updateIndex === -1) throw Error('entry not found')
      state.entries[updateIndex] = { ...state.entries[updateIndex], ...action.payload.entry };

      let updatePeriodWindows = getPeriodWindows(state.entries);
      let updateCycleLength = getAverageCycleLength(updatePeriodWindows);
      let updatePeriodLength = getAveragePeriodLength(updatePeriodWindows);
      let updateOvulationDistance = updateCycleLength/2;

      console.log('entry updated', state.entries[updateIndex].date)

      return {
        ...state,
        entries: state.entries, 
        periodWindows: updatePeriodWindows, 
        cycleLength: updateCycleLength, 
        periodLength: updatePeriodLength, 
        ovulationDistance: updateOvulationDistance
      };
    case 'reset_entries':
      return { ...state, entries: [] }
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
  }, [JSON.stringify(state.entries)])

  return (
    <TrackingContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackingContext.Provider>
  );
}

export const useTracking = () => useContext(TrackingContext)
