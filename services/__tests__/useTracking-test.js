import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useTracking, TrackingProvider, DEFAULT_TRACKING_SYMPTOMS } from "../useTracking";
import { useTranslation } from 'react-i18next';
import { 
  getCycleStatus, 
  getFertilityPrediction, 
  getPeriodPredictionNextCycle,
  getCycleNextUp
} from '../TrackingService'
import '../_i18n'
import { CYCLE_STATUSES } from '../../types/tracking';

let tracking = null;
let t = null;

const genEntry = (date, symptoms = {}) => ({ date, symptoms: { ...DEFAULT_TRACKING_SYMPTOMS, ...symptoms } });

const addEntry = (date) => {
  act(() => {
    tracking.current.dispatch({ 
      type: 'add_entry', 
      payload: { 
        entry: { date, symptoms: { ...DEFAULT_TRACKING_SYMPTOMS, bleeding: 2 } } 
      }
    })
  })
}

const removeEntry = (date) => {
  act(() => { 
    tracking.current.dispatch({
      type: 'remove_entry', 
      payload: { date } 
    })
  })
}

const initialEntries = [];

beforeEach(async () => {
  const wrapper = ({ children }) => <TrackingProvider initialEntries={initialEntries}>{children}</TrackingProvider>
  const response = renderHook(() => useTranslation());
  t = response.result.current.t;
  const { result, waitForNextUpdate } = renderHook(() => useTracking(), { wrapper })
  tracking = result;
  act(() => {
    tracking.current.dispatch({ type: 'reset_entries' })
  })
  // return waitForNextUpdate()
});

test(`add entries`, () => {
  addEntry("2021-07-01");
  expect(tracking.current.state.entries.length).toBe(1)
  removeEntry("2021-07-01")
})

test(`remove entries`, () => {
  addEntry("2021-07-01");
  addEntry("2021-07-03");
  expect(tracking.current.state.entries.length).toBe(2)
  removeEntry("2021-07-01")
  removeEntry("2021-07-03")
  expect(tracking.current.state.entries.length).toBe(0)
})

test(`getPeriodWindows`, () => {
  addEntry("2021-06-01");
  addEntry("2021-06-02");
  addEntry("2021-06-03");
  addEntry("2021-07-01");
  addEntry("2021-07-02");
  addEntry("2021-07-03");
  expect(tracking.current.state.periodWindows[0][0].date).toBe("2021-06-01")
  expect(tracking.current.state.periodWindows[0][1].date).toBe("2021-06-02")
  expect(tracking.current.state.periodWindows[0][2].date).toBe("2021-06-03")
  expect(tracking.current.state.periodWindows[1][0].date).toBe("2021-07-01")
  expect(tracking.current.state.periodWindows[1][1].date).toBe("2021-07-02")
  expect(tracking.current.state.periodWindows[1][2].date).toBe("2021-07-03")
})

test(`getFertilityPrediction`, () => {
  let predictions = getFertilityPrediction('2021-08-02', 14)
  
  expect(predictions.length).toBe(8)
  expect(predictions[0].date).toBe("2021-08-10")
  expect(predictions[1].date).toBe("2021-08-11")
  expect(predictions[2].date).toBe("2021-08-12")
  expect(predictions[3].date).toBe("2021-08-13")
  expect(predictions[4].date).toBe("2021-08-14")
  expect(predictions[5].date).toBe("2021-08-15")
  expect(predictions[5].fertilityType).toBe(3) // ovulation
  expect(predictions[6].date).toBe("2021-08-16")
  expect(predictions[7].date).toBe("2021-08-17")
})

test(`getPeriodPredictionNextCycle`, () => {
  let predictions = getPeriodPredictionNextCycle('2021-08-02', 5, 28);
  
  expect(predictions.length).toBe(5)
  expect(predictions[0].date).toBe("2021-08-30")
  expect(predictions[1].date).toBe("2021-08-31")
  expect(predictions[2].date).toBe("2021-09-01")
  expect(predictions[3].date).toBe("2021-09-02")
  expect(predictions[4].date).toBe("2021-09-03")
})

test(`getAverageCycleLength`, () => {
  addEntry("2021-04-12");
  addEntry("2021-04-13");
  addEntry("2021-04-14");
  addEntry("2021-04-15");

  addEntry("2021-05-07");
  addEntry("2021-05-08");
  addEntry("2021-05-09");
  addEntry("2021-05-10");

  addEntry("2021-05-31");
  addEntry("2021-06-01");
  addEntry("2021-06-02");
  addEntry("2021-06-03");
  
  addEntry("2021-06-23");
  addEntry("2021-06-24");
  addEntry("2021-06-25");
  addEntry("2021-06-26");

  addEntry("2021-07-16");
  addEntry("2021-07-17");
  addEntry("2021-07-18");
  addEntry("2021-07-19");
  
  expect(tracking.current.state.cycleLength).toBe(19)
  expect(tracking.current.state.entries.length).toBe(20)
})

test(`getCycleStatus`, () => {

  addEntry("2021-08-02");
  addEntry("2021-08-03");
  addEntry("2021-08-04");
  addEntry("2021-08-05");

  expect(getCycleStatus({ date: new Date('2021-08-02'), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-03"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-04"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-05"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-06"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-07"), ...tracking.current.state })).toBe(CYCLE_STATUSES.POST_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-08"), ...tracking.current.state })).toBe(CYCLE_STATUSES.POST_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-09"), ...tracking.current.state })).toBe(CYCLE_STATUSES.POST_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-10"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-11"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-12"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-13"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-14"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-15"), ...tracking.current.state })).toBe(CYCLE_STATUSES.OVULATION)
  expect(getCycleStatus({ date: new Date("2021-08-16"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-17"), ...tracking.current.state })).toBe(CYCLE_STATUSES.FERTILITY_WINDOW)
  expect(getCycleStatus({ date: new Date("2021-08-18"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-19"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-20"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-21"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-22"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-23"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-24"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-25"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-26"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-27"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-28"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-29"), ...tracking.current.state })).toBe(CYCLE_STATUSES.PRE_MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-30"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-08-31"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
  expect(getCycleStatus({ date: new Date("2021-09-01"), ...tracking.current.state })).toBe(CYCLE_STATUSES.MENSTRUATION)
})

test(`getCycleNextUp 1 period`, () => {
  addEntry("2021-08-02");
  addEntry("2021-08-03");
  addEntry("2021-08-04");

  let { periodWindows, periodLength, cycleLength, ovulationDistance, entries } = tracking.current.state;
  
  let opts = { periodWindows, periodLength, cycleLength, ovulationDistance, entries }
  
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-02") })).toStrictEqual(['cycle_next_up_period_end', { days: 4 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-03") })).toStrictEqual(['cycle_next_up_period_end', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-04") })).toStrictEqual(['cycle_next_up_period_end', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-05") })).toStrictEqual(['cycle_next_up_period_end', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-06") })).toStrictEqual(['cycle_next_up_period_end', { days: 0 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-07") })).toStrictEqual(['cycle_next_up_fertility_window_start', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-08") })).toStrictEqual(['cycle_next_up_fertility_window_start', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-09") })).toStrictEqual(['cycle_next_up_fertility_window_start', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-10") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 5 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-11") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 4 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-12") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-13") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-14") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-15") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-16") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-17") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 0 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-18") })).toStrictEqual(['cycle_next_up_period_start', { days: 12 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-19") })).toStrictEqual(['cycle_next_up_period_start', { days: 11 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-20") })).toStrictEqual(['cycle_next_up_period_start', { days: 10 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-21") })).toStrictEqual(['cycle_next_up_period_start', { days: 9 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-22") })).toStrictEqual(['cycle_next_up_period_start', { days: 8 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-23") })).toStrictEqual(['cycle_next_up_period_start', { days: 7 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-24") })).toStrictEqual(['cycle_next_up_period_start', { days: 6 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-25") })).toStrictEqual(['cycle_next_up_period_start', { days: 5 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-26") })).toStrictEqual(['cycle_next_up_period_start', { days: 4 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-27") })).toStrictEqual(['cycle_next_up_period_start', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-28") })).toStrictEqual(['cycle_next_up_period_start', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-29") })).toStrictEqual(['cycle_next_up_period_start', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-30") })).toStrictEqual(['cycle_next_up_period_end', { days: 4 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-08-31") })).toStrictEqual(['cycle_next_up_period_end', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-09-01") })).toStrictEqual(['cycle_next_up_period_end', { days: 2 }])
})

test(`getCycleNextUp 2 periods`, async () => {
  addEntry("2021-06-01");
  addEntry("2021-06-02");
  addEntry("2021-06-03");
  
  addEntry("2021-06-15");
  addEntry("2021-06-16");
  addEntry("2021-06-17");

  let { periodWindows, periodLength, cycleLength, ovulationDistance, entries } = tracking.current.state;
  
  let opts = { periodWindows, periodLength, cycleLength, ovulationDistance, entries }
  
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-18") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-19") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-20") })).toStrictEqual(['cycle_next_up_ovulation_start', { days: 1 }])

  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-21") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-22") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-23") })).toStrictEqual(['cycle_next_up_fertility_window_end', { days: 0 }])

  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-24") })).toStrictEqual(['cycle_next_up_period_start', { days: 5 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-25") })).toStrictEqual(['cycle_next_up_period_start', { days: 4 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-26") })).toStrictEqual(['cycle_next_up_period_start', { days: 3 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-27") })).toStrictEqual(['cycle_next_up_period_start', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-28") })).toStrictEqual(['cycle_next_up_period_start', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-29") })).toStrictEqual(['cycle_next_up_period_end', { days: 2 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-30") })).toStrictEqual(['cycle_next_up_period_end', { days: 1 }])
  expect(getCycleNextUp({ ...opts, date: new Date("2021-06-31") })).toStrictEqual(['cycle_next_up_period_end', { days: 0 }])
})


// it(`remove entries`, async () => {
//   await TrackingServie.removeEntry("22-06-2021")
//   expect(TrackingServie.entries.length).toBe(3);
// });

// xit(`getLastCreatedEntry`, async () => {
//   let last_entry = await TrackingServie.getLastCreatedEntry();
  
//   expect(last_entry.date).toBe('26-06-2021');
// });

// afterAll(async () => {
//   await TrackingServie.resetEntries()
// })