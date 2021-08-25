import Colors from '../constants/Colors';
import { 
  TrackingEntry, 
  PMSPredition, 
  FertilityPrediction, 
  PeriodPrediction,
} from '../types/tracking'

export const getEntryDots = (entries: TrackingEntry[]) => {
  let result = {};
  entries.forEach(entry => result[entry.date] = { entry });
  return result;
}

export const getPredictionDots = (predictions: PMSPredition[] | FertilityPrediction[] | PeriodPrediction[]) => {
  let result = {};
  predictions.forEach(prediction => result[prediction.date] = { prediction: prediction });
  return result;
}

export const mergeDots = (d1, d2) => {
  let result = { ...d1 };
  
  Object.keys(d2).forEach(date => {

    if(d1[date] !== undefined) {
      result[date] = {
        ...d1[date],
        ...d2[date]
      }
    } else {
      result[date] = d2[date]
    }
  })

  return result;
}