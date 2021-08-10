export interface TrackingContextType {
  entries: TrackingEntry[],
  periodWindows: TrackingEntry[][],
  ovulationDistance: number,
  cycleLength: number,
  periodLength: number,
  getEntry(date: string): TrackingEntry | void,
  addEntry(entry: TrackingEntry): void,
  removeEntry(date: string): void,
  updateEntry(options: TrackingEntry): void,
  resetEntries(): void,
}

export interface TrackingEntrySymptoms {
  bleeding: number,
  intercourse_1: boolean,
  intercourse_2: boolean,
  intercourse_3: boolean,
  intercourse_4: boolean,
  pain_1: boolean,
  pain_2: boolean,
  pain_3: boolean,
  pain_4: boolean,
  emotion_1: boolean,
  emotion_2: boolean,
  emotion_3: boolean,
  emotion_4: boolean,
}

export const DEFAULT_TRACKING_SYMPTOMS: TrackingEntrySymptoms = {
  bleeding: 0,
  intercourse_1: false,
  intercourse_2: false,
  intercourse_3: false,
  intercourse_4: false,
  pain_1: false,
  pain_2: false,
  pain_3: false,
  pain_4: false,
  emotion_1: false,
  emotion_2: false,
  emotion_3: false,
  emotion_4: false,
}

export interface TrackingEntry {
  date: string,
  symptoms: TrackingEntrySymptoms,
  created_at?: number,
  updated_at?: number,
}

export enum PredictionType {
  PMS,
  Period,
  Fertility,
}

export interface PeriodPrediction {
  date: string,
  type: PredictionType.Period
}

export interface FertilityPrediction {
  date: string,
  fertilityType: 1 | 2 | 3,
  type: PredictionType.Fertility
}

export interface PMSPredition {
  date: string,
  type: PredictionType.PMS
}

export enum CYCLE_STATUSES {
  UNKNOWN = 0,
  MENSTRUATION = 1,
  POST_MENSTRUATION = 2,
  FERTILITY_WINDOW = 3,
  OVULATION = 4,
  PRE_MENSTRUATION = 5,
}

export enum FERTILITY_LEVEL {
  UNKNOWN = 0,
  LEAST = 1,
  LESS = 2,
  POSSIBLE = 3,
  MOST = 4,
}

export enum CYCLE_LENGTH_STATUS {
  UNKNOWN = 0,
  ABNORMAL = 1,
  NORMAL = 2,
}

export enum PERIOD_LENGTH_STATUS {
  UNKNOWN = 0,
  ABNORMAL = 1,
  NORMAL = 2,
}

export interface DayStatus {
  period: boolean,
  fertilePrediciton: boolean,
  ovulationPrediciton: boolean,
  periodPrediction: boolean,
  pmsPrediction: boolean,
}
