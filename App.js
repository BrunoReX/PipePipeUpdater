import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { Styles } from './Styles';
import checkForUpdate from './Update'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [localVersion, setlocalVersion] = useState("N/A");
  const [latestLabel, setLatestLabel] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    (async () => {
      ver = await AsyncStorage.getItem('local-version');

      if (ver !== null) {
        setlocalVersion(ver);
      }
    })()
  }, []);

  const updateCheck = async () => {
    setlocalVersion("v1");

    isLoading(true);
    await new Promise(r => setTimeout(() => r(), 10000));
    latest = checkForUpdate('v1');
    isLoading(false);

    setLatestLabel("Latest Version:")
    setLatestVersion(latest)

    try {
      await AsyncStorage.setItem('local-version', checkForUpdate('v1'));
    } catch (e) { }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.innerContainer}>
        <Text style={Styles.text}>
          Installed Version:
        </Text>
        <Text style={Styles.text}>
          {localVersion}
        </Text>
        <Text />
        <Text style={Styles.text}>
          {latestLabel}
        </Text>
        <Text style={Styles.text}>
          {latestVersion}
        </Text>
      </View>
      <View style={Styles.footerContainer}>
        <Button title="CHECK FOR UPDATES" onPress={updateCheck} />
        {loading && <Text />}
        {loading && <ActivityIndicator size="large" />}
      </View>
    </View>
  );
}
