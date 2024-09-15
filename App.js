import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Linking, Text, View } from "react-native";
import { Styles } from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import RNExitApp from "react-native-exit-app";

export default function App() {
  const [localVersion, setlocalVersion] = useState("N/A");
  const [latestLabel, setLatestLabel] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [loading, isLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [buttonText, setButtonText] = useState("CHECK FOR UPDATES");
  const [updateFound, wasUpdateFound] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [forceDownload, doForceDownload] = useState(false);

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

  const updateCheck = async () => {
    if (updateFound) {
      try {
        await AsyncStorage.setItem("local-version", latestVersion);
      } catch (e) {}

      Linking.openURL(downloadUrl);
      RNExitApp.exitApp();
      return;
    }

    latest = localVersion;

    isLoading(true);

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      setStatus("Unable to fetch!");
      isLoading(false);
    } else {
      data = await response.json();
      latest = data.name;
      dls = data.assets;

      for (var i = 0; i < dls.length; i++) {
        url = dls[i].browser_download_url;
        if (url.endsWith("-universal-release.apk")) {
          setDownloadUrl(url);
          break;
        }
      }

      setLatestLabel("Latest Version:");
      setLatestVersion(latest);
      isLoading(false);

      if (localVersion.localeCompare(latest) == 0) {
        setStatus("Your version is up to date.");
        if (forceDownload) {
          setButtonText("DOWNLOAD UPDATE");
          wasUpdateFound(true);
        }
      } else {
        setStatus("New version found!");
        setButtonText("DOWNLOAD UPDATE");
        wasUpdateFound(true);
      }
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.innerContainer}>
        <Text style={Styles.textTitle}>PipePipe Updater</Text>
        <Text style={Styles.text}></Text>
        <Text style={Styles.text}>Installed Version:</Text>
        <Text style={Styles.text}>{localVersion}</Text>
        <Text />
        <Text style={Styles.text}>{latestLabel}</Text>
        <Text style={Styles.text}>{latestVersion}</Text>
      </View>
      <View style={Styles.footerContainer}>
        <Text>{status}</Text>
        <Text />
        <Button title={buttonText} onPress={updateCheck} />
        {loading && <Text />}
        {loading && <ActivityIndicator size="large" />}
        <Text />
      </View>
      <View style={Styles.checkboxContainer}>
        <CheckBox
          style={Styles.checkbox}
          disabled={false}
          value={forceDownload}
          onValueChange={(newValue) => doForceDownload(newValue)}
        />
        <Text style={Styles.checkText}>FORCE DOWNLOAD</Text>
      </View>
    </View>
  );
}
