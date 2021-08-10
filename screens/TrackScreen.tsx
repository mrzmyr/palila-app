import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useTracking } from '../services/useTracking';

export default function Track() {
  const tracking = useTracking();
  
  return (
    <View style={styles.container}>
      <Pressable
        onPress={async () => tracking.resetEntries()}
      >
        <Text style={{ fontSize: 100, padding: 20 }}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
