import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { Styles } from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [localVersion, setlocalVersion] = useState("N/A");
  const [latestLabel, setLatestLabel] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [loading, isLoading] = useState(false);
  const API_URL =
    "https://api.github.com/repos/InfinityLoop1308/PipePipe/releases/latest";

  useEffect(() => {
    (async () => {
      ver = await AsyncStorage.getItem("local-version");

      if (ver !== null) {
        setlocalVersion(ver);
      }
    })();
  }, []);

  function waitForUpdateCheck(localVersion) {
    checkForUpdate(localVersion);
  }

  const updateCheck = async () => {
    latest = localVersion;

    isLoading(true);

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      setLatestLabel("Unable to fetch!");
      isLoading(false);
    } else {
      data = await response.json();
      latest = data.name;
      dls = data.assets;

      download_url = "";
      for (var i = 0; i < dls.length; i++) {
        url = dls[i].browser_download_url;
        if (url.endsWith("-universal-release.apk")) {
          download_url = url;
          break;
        }
      }

      isLoading(false);
      setLatestLabel("Latest Version:");
      setLatestVersion(latest);

      try {
        await AsyncStorage.setItem("local-version", latest);
      } catch (e) {}
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.innerContainer}>
        <Text style={Styles.text}>Installed Version:</Text>
        <Text style={Styles.text}>{localVersion}</Text>
        <Text />
        <Text style={Styles.text}>{latestLabel}</Text>
        <Text style={Styles.text}>{latestVersion}</Text>
      </View>
      <View style={Styles.footerContainer}>
        <Button title="CHECK FOR UPDATES" onPress={updateCheck} />
        {loading && <Text />}
        {loading && <ActivityIndicator size="large" />}
      </View>
    </View>
  );
}
