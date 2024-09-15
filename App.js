import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Styles } from './Styles';
import checkForUpdate from './Update'


export default function App() {
  const [localVersion, setLocalVersion] = useState("N/A");

  const updateCheck = () => {
    setLocalVersion(checkForUpdate('v1'));
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.innerContainer}>
        <Text style={Styles.text}>
          Current Version:
        </Text>
        <Text style={Styles.text}>
          {localVersion}
        </Text>
      </View>
      <View style={Styles.footerContainer}>
          <Button title="CHECK FOR UPDATES"
          onPress={updateCheck} />
        </View>
    </View>
  );
}


