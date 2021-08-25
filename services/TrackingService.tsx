import { addDays, differenceInCalendarDays, isAfter, isBefore, isWithinInterval, subDays } from 'date-fns';
import { format } from '../services/i18n';

import { 
  PeriodPrediction,
  FertilityPrediction,
  PMSPredition,
  DayStatus,
  CYCLE_STATUSES,
  FERTILITY_LEVEL,
  CYCLE_LENGTH_STATUS,
  PERIOD_LENGTH_STATUS,
  TrackingEntry,
  PredictionType,
} from '../types/tracking';


const DATE_FORMAT = 'yyyy-MM-dd';

const MAX_PERIOD_BREAK = 2;
const MIN_LENGTH_PERIOD = 2;
const MIN_CYCLE_DISTANCE = 10;

const FERTILE_WINDOW_BEFORE_OVULATION = 5;
const FERTILE_WINDOW_AFTER_OVULATION = 2;

export const AVG_CYCLE_LENGTH = 28;
export const AVG_PERIOD_LENGTH = 5;
const PMS_BEFORE_PERIOD = 3;

// Period Windows
// ---------------------------------------------------

export const getPeriodWindows = (entries: TrackingEntry[]) => {
  
  let entries_filtered = entries.filter((entry) => [1,2,3].includes(entry.symptoms.bleeding))
  let entries_sorted = entries_filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let period_windows: any = []

  let period_window_entries: TrackingEntry[] = [];
  
  // interate from present to past
  entries_sorted.forEach((curr, i: number) => {
    const prev = i != 0 ? entries_sorted[i  - 1] : null;
    let day_diff: number = -Infinity;

    if(prev !== null) {
      day_diff = differenceInCalendarDays(new Date(prev.date), new Date(curr.date))
    }

    if (day_diff <= MAX_PERIOD_BREAK && prev !== null) {
      if(period_window_entries.length === 0) {
        period_window_entries.push(prev)
      }

      period_window_entries.push(curr)
    }
    
    if (
      day_diff > MAX_PERIOD_BREAK || 
      i === (entries_sorted.length - 1)
    ) {
      if(period_window_entries.length >= MIN_LENGTH_PERIOD) {
        if(period_windows.length > 0) {
          let first_date_of_last_window = period_windows[period_windows.length - 1][period_windows[period_windows.length - 1].length - 1].date;
          let first_date_of_current_window = period_window_entries[period_window_entries.length - 1].date;
          let window_day_diff = differenceInCalendarDays(new Date(first_date_of_last_window), new Date(first_date_of_current_window))

          if(window_day_diff > MIN_CYCLE_DISTANCE) {
            period_windows.push(period_window_entries)
          }
        } else {
          period_windows.push(period_window_entries)
        }
      }
      period_window_entries = []
    }
  });

  return period_windows.map(pw => pw.reverse()).reverse();
}

// Cycle Length
// ---------------------------------------------------

export const getAverageCycleLength = (periodWindows: TrackingEntry[][]): number => {

  if(periodWindows.length <= 1) return AVG_CYCLE_LENGTH;

  let count = 0;
  let total = 0;
  
  for (let i = 1; i < periodWindows.length; i++) {
    let curr = periodWindows[i];
    let prev = periodWindows[i - 1];
    let days_diff = differenceInCalendarDays(new Date(curr[curr.length - 1].date), new Date(prev[prev.length - 1].date))
    total += days_diff;
  }
  
  return periodWindows.length === 2 ?  total : Math.round(total / periodWindows.length);
}

export const getCycleLengthStatus = (cycleLength: number) => {
  return  cycleLength < 21 || cycleLength > 35 ? CYCLE_LENGTH_STATUS.ABNORMAL : CYCLE_LENGTH_STATUS.NORMAL;
}

// Period Length
// ---------------------------------------------------

export const getAveragePeriodLength = (periodWindows: TrackingEntry[][]): number => {
  if(periodWindows.length < 2) return AVG_PERIOD_LENGTH;
  let limitedPeriodWindows = periodWindows.slice(-3);
  return Math.round(limitedPeriodWindows.map(pw => pw.length).reduce((acc, c) => acc + c, 0) / limitedPeriodWindows.length);
}

export const getPeriodLengthStatus = (periodLength: number) => {
  return  periodLength > 7 || periodLength < 3 ? PERIOD_LENGTH_STATUS.ABNORMAL : PERIOD_LENGTH_STATUS.NORMAL;
}


// Period Dates
// ---------------------------------------------------

export const getPeriodStartDate = (periodWindows: TrackingEntry[][]) => {
  if(periodWindows.length < 1) return null;
  return periodWindows[periodWindows.length - 1][0].date;
}

export const getPeriodEndDate = (periodStartDate: string, periodLength: number): string => {
  return format(addDays(new Date(periodStartDate), periodLength), DATE_FORMAT);
}

export const getPeriodPredictionCurrentCycle = (periodStartDate: string, periodLength: number): PeriodPrediction[] => {
  let result: PeriodPrediction[] = []

  for (let p = 0; p < periodLength; p++) {
    result.push({ 
      date: format(addDays(new Date(periodStartDate), p), DATE_FORMAT),
      type: PredictionType.Period
    })
  }
  
  return result;
}

export const getPeriodPredictionNextCycle = (periodStartDate: string, periodLength: number, cycleLength: number): PeriodPrediction[] => {
let first_day = addDays(new Date(periodStartDate), cycleLength - 1);
  
  let result: PeriodPrediction[] = []

  for (let i = 1; i <= periodLength; i++) {
    result.push({ 
      date: format(addDays(first_day, i), DATE_FORMAT),
      type: PredictionType.Period
    })
  }
  
  return result;
}


// Fertility Dates
// ---------------------------------------------------

export const getOvulationDate = (periodStartDate: string, ovulationDistance: number): string => {
  return format(addDays(new Date(periodStartDate), ovulationDistance - 1), DATE_FORMAT)
}

export const getFertilityPrediction = (periodStartDate: string, ovulationDistance: number): FertilityPrediction[] => {

  let ovulationDate = new Date(getOvulationDate(periodStartDate, ovulationDistance))
  let result: FertilityPrediction[] = []
  
  for (let i = FERTILE_WINDOW_BEFORE_OVULATION; i > 0; i--) {
    result.push({
      date: format(subDays(ovulationDate, i), DATE_FORMAT),
      type: PredictionType.Fertility,
      fertilityType: 2,
    })
  }

  result.push({ 
    date: format(ovulationDate, DATE_FORMAT), 
    type: PredictionType.Fertility,
    fertilityType: 3 
  })

  for (let i = 1; i <= FERTILE_WINDOW_AFTER_OVULATION; i++) {
    result.push({
      date: format(addDays(ovulationDate, i), DATE_FORMAT),
      type: PredictionType.Fertility,
      fertilityType: 2,
    })
  }

  return result;
}

export const getFertilityStatus = (date: Date, periodWindows: TrackingEntry[][], entries: TrackingEntry[], periodLength: number, cycleLength: number, ovulationDistance: number): FERTILITY_LEVEL => {
  let currentCycleStatus = getCycleStatus({ date, periodWindows, entries, periodLength, cycleLength, ovulationDistance });
  let currentCycleDay = getCycleDay(date, periodWindows);
  let periodStartDate = getPeriodStartDate(periodWindows);

  if(periodStartDate === null) return FERTILITY_LEVEL.UNKNOWN;
  
  let periodEndDate = getPeriodEndDate(periodStartDate, periodLength);
  let ovulationDate = getOvulationDate(periodStartDate, ovulationDistance);

  let cycleDayOvulation = differenceInCalendarDays(new Date(ovulationDate), new Date(periodStartDate)) + 1;
  let cycleDayPeriodEnd = differenceInCalendarDays(new Date(periodEndDate), new Date(periodStartDate)) + 1
  
  if(currentCycleStatus === CYCLE_STATUSES.MENSTRUATION) return FERTILITY_LEVEL.LEAST;
  if(currentCycleStatus === CYCLE_STATUSES.POST_MENSTRUATION) return FERTILITY_LEVEL.POSSIBLE;
  if(currentCycleStatus === CYCLE_STATUSES.FERTILITY_WINDOW) return FERTILITY_LEVEL.LIKELY;
  if(currentCycleDay >= cycleDayOvulation - 2 && currentCycleDay <= cycleDayOvulation) return FERTILITY_LEVEL.MOST;

  if(currentCycleDay > cycleDayOvulation && currentCycleDay <= cycleDayOvulation + 2) return FERTILITY_LEVEL.POSSIBLE;

  // 2 days after ovulation
  if(currentCycleDay >= cycleDayOvulation + 2) return FERTILITY_LEVEL.LESS;

  return FERTILITY_LEVEL.UNKNOWN;
}

  // PMS Dates
// ---------------------------------------------------

export const getPMSPrediction = (periodStartDate: string, periodLength: number, cycleLength: number): PMSPredition[] => {
  let periodPredictions = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
  
  if(periodPredictions.length < 1) return [];

  let dateOfFirstDayOfPredictedPeriod = new Date(periodPredictions[0].date)

  let result = [];

  for (let i = 1; i <= PMS_BEFORE_PERIOD; i++) {
    result.push({ 
      date: format(subDays(dateOfFirstDayOfPredictedPeriod, i), DATE_FORMAT),
      type: PredictionType.PMS
    })      
  }
  
  return result;
}

export const getDayStatus = (date: Date, entries: TrackingEntry[], periodWindows: TrackingEntry[][], periodLength: number, cycleLength: number, ovulationDistance: number): DayStatus | null => {
  
  let periodStartDate = getPeriodStartDate(periodWindows);
  if(periodStartDate === null) return null;
  
  let periodPredictionCurrentCycle = getPeriodPredictionCurrentCycle(periodStartDate, periodLength);
  let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
  let periodPredictionNextNextCycle = getPeriodPredictionNextCycle(periodPredictionNextCycle[0].date, periodLength, cycleLength);
  let periodPredictionNextNextNextCycle = getPeriodPredictionNextCycle(periodPredictionNextNextCycle[0].date, periodLength, cycleLength);

  let pmsPredictionDates = getPMSPrediction(periodStartDate, periodLength, cycleLength).map(p => p.date);
  let pmsPredictionDatesNext = getPMSPrediction(periodPredictionNextCycle[0].date, periodLength, cycleLength).map(p => p.date);
  let pmsPredictionDatesNextNext = getPMSPrediction(periodPredictionNextNextCycle[0].date, periodLength, cycleLength).map(p => p.date);
  
  let fertilePredictions = getFertilityPrediction(periodStartDate, ovulationDistance);
  let fertilePredictionDates = fertilePredictions.map(p => p.date);
  let periodDates = entries.filter(p => [1,2,3].includes(p.symptoms.bleeding)).map(p => p.date);

  let ovulationDay = fertilePredictions.find(p => p.fertilityType === 3);

  let dateString = format(date, DATE_FORMAT)
  
  return {
    period: periodDates.includes(dateString),
    fertilePrediciton: fertilePredictionDates.includes(dateString),
    ovulationPrediciton: ovulationDay !== undefined && ovulationDay.date == dateString,
    periodPrediction: [
      ...periodPredictionCurrentCycle.map(d => d.date),
      ...periodPredictionNextCycle.map(d => d.date),
      ...periodPredictionNextNextCycle.map(d => d.date),
      ...periodPredictionNextNextNextCycle.map(d => d.date),
    ].includes(dateString),
    pmsPrediction: [
      ...pmsPredictionDates,
      ...pmsPredictionDatesNext,
      ...pmsPredictionDatesNextNext,
    ].includes(dateString)
  }
}

// Cycle Status

export const getCycleDay = (date: Date, periodWindows: TrackingEntry[][]): number => {
  const periodStartDate = getPeriodStartDate(periodWindows);
  if(periodStartDate === null) return -1;
  return differenceInCalendarDays(date, new Date(periodStartDate)) + 1;
}

export const getCycleStatus = ({ date, periodWindows, entries, periodLength, cycleLength, ovulationDistance }: { date: Date, periodWindows: TrackingEntry[][], entries: TrackingEntry[], periodLength: number, cycleLength: number, ovulationDistance: number }): CYCLE_STATUSES => {
  
  let dayStatus = getDayStatus(date, entries, periodWindows, periodLength, cycleLength, ovulationDistance);
  let periodStartDate = getPeriodStartDate(periodWindows);
  
  if(periodStartDate === null || dayStatus === null) return CYCLE_STATUSES.UNKNOWN;
  
  let currentCycleDay = getCycleDay(date, periodWindows);
  let ovulationDay = getOvulationDate(periodStartDate, ovulationDistance);

  let cycleDayOvulation = 1 + differenceInCalendarDays(
    new Date(ovulationDay), 
    new Date(periodStartDate)
  );

  if(dayStatus.periodPrediction || dayStatus.period) {
    let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
    let firstDayDateOf2ndPeriod = periodPredictionNextCycle[0].date;
    let diff = differenceInCalendarDays(new Date(firstDayDateOf2ndPeriod), date);
    if(diff < 0) {
      return CYCLE_STATUSES.MENSTRUATION_LATE;
    } else {
      return CYCLE_STATUSES.MENSTRUATION;
    }
  }
  if(dayStatus.ovulationPrediciton) return CYCLE_STATUSES.OVULATION;
  if(dayStatus.fertilePrediciton) return CYCLE_STATUSES.FERTILITY_WINDOW;
  if(currentCycleDay < cycleDayOvulation) return CYCLE_STATUSES.POST_MENSTRUATION;
  if(currentCycleDay > cycleDayOvulation) return CYCLE_STATUSES.PRE_MENSTRUATION;

  return CYCLE_STATUSES.UNKNOWN;
}

export const getNextPeriod = ({ date, periodWindows, periodLength, cycleLength }: { date: Date, periodWindows: TrackingEntry[][], periodLength: number, cycleLength: number }) => {

  const periodStartDate = getPeriodStartDate(periodWindows);

  if(periodStartDate === null) return null;
  
  let periodPredictionCurrentCycle = getPeriodPredictionCurrentCycle(periodStartDate, periodLength);
  let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);

  let firstDayDateOfPeriod = periodPredictionCurrentCycle[0].date;
  let firstDayDateOf2ndPeriod = periodPredictionNextCycle[0].date;

  if(isAfter(date, new Date(firstDayDateOfPeriod))) {
    return ['period_start_in', { days: differenceInCalendarDays(new Date(firstDayDateOf2ndPeriod), date) }]
  }

  return ['period_start_in', { days: differenceInCalendarDays(new Date(firstDayDateOfPeriod), date) }]
}

// maximum: 1 next cycle period prediction
export const getCycleNextUp = ({ date, entries, periodWindows, periodLength, cycleLength, ovulationDistance }: {date: Date, entries: TrackingEntry[], periodWindows: TrackingEntry[][], periodLength: number, cycleLength: number, ovulationDistance: number }): [string, object] | [null, null] => {
  
  date = new Date(format(date, DATE_FORMAT))
  
  const periodStartDate = getPeriodStartDate(periodWindows);

  if(periodStartDate === null) return [null, null];

  let cycleStatus = getCycleStatus({ date, periodWindows, entries, periodLength, cycleLength, ovulationDistance })
  
  let periodPredictionCurrentCycle = getPeriodPredictionCurrentCycle(periodStartDate, periodLength);
  let periodPredictionNextCycle = getPeriodPredictionNextCycle(periodStartDate, periodLength, cycleLength);
  let fertilePredictions = getFertilityPrediction(periodStartDate, ovulationDistance);
  let ovulationDayDate = getOvulationDate(periodStartDate, ovulationDistance);
  
  let firstDayDateOfPeriod = periodPredictionCurrentCycle[0].date;
  let lastDayDateOfPeriod = periodPredictionCurrentCycle[periodPredictionCurrentCycle.length - 1].date;
  let firstDayDateOf2ndPeriod = periodPredictionNextCycle[0].date;
  let lastDayDateOf2ndPeriod = periodPredictionNextCycle[periodPredictionNextCycle.length - 1].date;
  let firstFertileDayDate = fertilePredictions[0].date;
  let lastFertileDayDate = fertilePredictions[fertilePredictions.length - 1].date;

  // console.log(date, cycleStatus)
  
  // BETWEEN [first day of period] AND [last day of period]
  if(cycleStatus === CYCLE_STATUSES.MENSTRUATION) {
    // is first period (prediction)
    if(isWithinInterval(date, { start: new Date(firstDayDateOfPeriod), end: new Date(lastDayDateOfPeriod) })) {
      let diff = differenceInCalendarDays(new Date(lastDayDateOfPeriod), date);

      if(diff === 1) return ['cycle_next_up_period_end_tomorrow', {}]
      if(diff === 0) return ['cycle_next_up_period_end_today', {}]
      
      return ['cycle_next_up_period_end', { days: diff }]
    }
    // is second period (prediction)
    if(isWithinInterval(date, { start: new Date(firstDayDateOf2ndPeriod), end: new Date(lastDayDateOf2ndPeriod) })) {
      let diff = differenceInCalendarDays(new Date(lastDayDateOfPeriod), date);

      if(diff === 1) return ['cycle_next_up_period_end_tomorrow', {}]
      if(diff === 0) return ['cycle_next_up_period_end_today', {}]
      
      return ['cycle_next_up_period_end', { days: diff }]
    }
  }

  // BETWEEN [first day of fertility window] AND [ovulation]
  if(cycleStatus === CYCLE_STATUSES.FERTILITY_WINDOW && isBefore(date, new Date(ovulationDayDate))) {
    let diff = differenceInCalendarDays(new Date(ovulationDayDate), date);
    
    if(diff === 1) return ['cycle_next_up_ovulation_start_tomorrow', {}]
    if(diff === 0) return ['cycle_next_up_ovulation_start_today', {}]
    
    return ['cycle_next_up_ovulation_start', { days: diff }]
  }
  
  // [ovulation]
  if(cycleStatus === CYCLE_STATUSES.OVULATION) {
    let diff = differenceInCalendarDays(new Date(lastFertileDayDate), date);
    
    if(diff === 1) return ['cycle_next_up_fertility_window_end_tomorrow', {}]
    if(diff === 0) return ['cycle_next_up_fertility_window_end_today', {}]
    
    return ['cycle_next_up_fertility_window_end', { days: diff }]
  }

  // BETWEEN [ovulation] AND [last day of fertility window]
  if(cycleStatus === CYCLE_STATUSES.FERTILITY_WINDOW && isAfter(date, new Date(ovulationDayDate))) {
    let diff = differenceInCalendarDays(new Date(lastFertileDayDate), date);
    
    if(diff === 1) return ['cycle_next_up_fertility_window_end_tomorrow', {}]
    if(diff === 0) return ['cycle_next_up_fertility_window_end_today', {}]
    
    return ['cycle_next_up_fertility_window_end', { days: diff }]
  }
  
  // BETWEEN [last day of fertility window] and 
  if(CYCLE_STATUSES.POST_MENSTRUATION) {
    // is first period (prediction)
    if(isBefore(date, new Date(ovulationDayDate))) {
      let diff = differenceInCalendarDays(new Date(firstFertileDayDate), date);

      if(diff === 1) return ['cycle_next_up_fertility_window_start_tomorrow', {}]
      if(diff === 0) return ['cycle_next_up_fertility_window_start_today', {}]
      
      return ['cycle_next_up_fertility_window_start', { days: diff }]
    }
    // is second period (prediction)
    if(isWithinInterval(date, { start: new Date(firstDayDateOf2ndPeriod), end: new Date(lastDayDateOf2ndPeriod) })) {
      return null;
    }
  }
  
  // BETWEEN [last day of fertility window] AND [next period]
  if(CYCLE_STATUSES.PRE_MENSTRUATION) {
    let diff = differenceInCalendarDays(new Date(firstDayDateOf2ndPeriod), date);
    if(diff > 0) {
      if(diff === 1) return ['cycle_next_up_period_start_tomorrow', {}]
      return ['cycle_next_up_period_start', { days: diff }]
    }
    return ['cycle_next_up_period_late', { days: -1 * diff }]
  }

  return null;
}
