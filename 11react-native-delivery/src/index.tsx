import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import { ServerContainer } from '@react-navigation/native';

const App: React.FC = () => (
  <View style={{ flex: 1 }}>
    <StatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent
    />
    <Routes />
  </View>
);

export default App;

// yarn json-server server.json -p 3333
// adb reverse tcp:3333 tcp:3333