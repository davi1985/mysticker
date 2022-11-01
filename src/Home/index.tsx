import { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import {
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PositionChoice } from "../components/PositionChoice";

import { styles } from "./styles";
import { POSITIONS, PositionProps } from "../utils/positions";

export function Home() {
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();

    setPhotoURI(photo.uri);
  }

  async function shareScreenShot() {
    const screenShot = await captureRef(screenShotRef);

    await Sharing.shareAsync("file://" + screenShot);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then((response) =>
      setHasCameraPermission(response.granted)
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            {hasCameraPermission && !photoURI ? (
              <Camera
                style={styles.camera}
                ref={cameraRef}
                type={CameraType.front}
              />
            ) : (
              <Image
                source={{
                  uri: photoURI
                    ? photoURI
                    : "https://imgs.search.brave.com/IskXUlHDNot-NlFVFJ1eBIi35EDNhAmWXidjqQvRWEg/rs:fit:512:512:1/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvemVpci13YXlm/aW5kaW5nLXZvbC0x/LzI1L2NhbWVyYV9w/cm9oaWJpdGVkX25v/dF9hbGxvd2VkX2Zv/cmJpZGRlbi01MTIu/cG5n",
                }}
                onLoad={shareScreenShot}
                style={styles.camera}
              />
            )}

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity onPress={() => setPhotoURI(null)}>
          <Text style={styles.retry}>Nova foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
