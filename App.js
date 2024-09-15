import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Linking, Text, View } from "react-native";
import { Styles } from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import DropDownPicker from "react-native-dropdown-picker";
import RNExitApp from "react-native-exit-app";

export default function App() {
  const [localVersion, setlocalVersion] = useState("N/A");
  const [latestLabel, setLatestLabel] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [loading, isLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState("");
  const [buttonLabel, setButtonLabel] = useState("CHECK FOR UPDATES");
  const [updateFound, wasUpdateFound] = useState(false);
  const [updateChecked, wasUpdateChecked] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [forceDownload, doForceDownload] = useState(false);
  const [forceCheckboxDisabled, isForceCheckboxDisabled] = useState(false);

  const [open, setOpen] = useState(false);
  const [apkValue, setApkValue] = useState("universal");
  const [apkItems, setApkItems] = useState([
    { label: "Universal", value: "universal" },
    { label: "arm64-v8a", value: "arm64-v8a" },
    { label: "armeabi-v7a", value: "armeabi-v7a" },
    { label: "x86_64", value: "x86_64" },
    { label: "x86", value: "x86" },
  ]);

  const DOWNLOAD_UPDATE = "DOWNLOAD UPDATE";
  const API_URL =
    "https://api.github.com/repos/InfinityLoop1308/PipePipe/releases/latest";

  useEffect(() => {
    (async () => {
      ver = await AsyncStorage.getItem("local-version");

      if (ver !== null) {
        setlocalVersion(ver);
      }

      apk = await AsyncStorage.getItem("apk-value");
      if (apk !== null) {
        setApkValue(apk);
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
      setStatusLabel("Unable to fetch!");
      isLoading(false);
    } else {
      data = await response.json();
      latest = data.name;
      dls = data.assets;

      for (var i = 0; i < dls.length; i++) {
        url = dls[i].browser_download_url;
        if (url.endsWith(`-${apkValue}-release.apk`)) {
          setDownloadUrl(url);
          break;
        }
      }

      setLatestLabel("Latest Version:");
      setLatestVersion(latest);
      isLoading(false);

      if (localVersion.localeCompare(latest) == 0) {
        setStatusLabel("Your version is up to date.");
        if (forceDownload) {
          setButtonLabel(DOWNLOAD_UPDATE);
          wasUpdateFound(true);
        }
      } else {
        setStatusLabel("New version found!");
        setButtonLabel(DOWNLOAD_UPDATE);
        wasUpdateFound(true);
      }

      wasUpdateChecked(true);
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
        <View style={Styles.dropDown}>
          <Text style={Styles.textApk}>APK to download:</Text>
          <DropDownPicker
            open={open}
            value={apkValue}
            items={apkItems}
            setOpen={setOpen}
            setValue={setApkValue}
            setItems={setApkItems}
            disableBorderRadius={true}
            onChangeValue={(value) => {
              (async () => {
                await AsyncStorage.setItem("apk-value", value);
              })();
            }}
          />
        </View>
      </View>
      <View style={Styles.footerContainer}>
        <Text>{statusLabel}</Text>
        <Button title={buttonLabel} onPress={updateCheck} />
        <View style={Styles.checkboxContainer}>
          <CheckBox
            style={Styles.checkbox}
            disabled={forceCheckboxDisabled}
            value={forceDownload}
            onValueChange={(newValue) => {
              doForceDownload(true);
              isForceCheckboxDisabled(true);

              if (updateChecked) {
                setButtonLabel(DOWNLOAD_UPDATE);
                wasUpdateFound(true);
              }
            }}
          />
          <Text style={Styles.checkBoxLabel}>FORCE DOWNLOAD</Text>
        </View>
        {loading && <Text />}
        {loading && <ActivityIndicator size="large" />}
        <Text />
      </View>
    </View>
  );
}
