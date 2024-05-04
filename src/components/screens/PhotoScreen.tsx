import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';

class PhotoScreen extends Component {
  camera: RNCamera | null | undefined;

  state = {
    photos: [],
    mode: 'list', // 'list' oder 'camera'
  };

  componentDidMount() {
    this.loadPhotos();
  }

  loadPhotos = async () => {
    // Hier könnte eine Funktion stehen, die die gespeicherten Bilder lädt
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: false};
      const data = await this.camera.takePictureAsync(options);
      const newFilePath =
        RNFS.ExternalDirectoryPath + `/photo_${Date.now()}.jpg`;
      await RNFS.moveFile(data.uri, newFilePath);
      this.setState({
        photos: [...this.state.photos, newFilePath],
        mode: 'list',
      });
    }
  };

  savePicture = async (uri: string) => {
    const newFilePath = RNFS.ExternalDirectoryPath + `/photo_${Date.now()}.jpg`;
    try {
      await RNFS.moveFile(uri, newFilePath);
      Alert.alert('Foto gespeichert', `Gespeichert unter: ${newFilePath}`);
    } catch (error) {
      console.log(error);
      Alert.alert('Fehler', 'Foto konnte nicht gespeichert werden!');
    }
  };

  renderCamera = () => (
    <View style={{flex: 1}}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{flex: 1, alignItems: 'center'}}
      />
      <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
        <Text style={styles.captureText}>Foto aufnehmen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.capture}
        onPress={() => this.setState({mode: 'list'})}>
        <Text style={styles.captureText}>Zurück zur Liste</Text>
      </TouchableOpacity>
    </View>
  );

  renderPhotoList = () => (
    <View style={{flex: 1}}>
      <FlatList
        data={this.state.photos}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Image
            source={{uri: `file://${item}`}}
            style={{width: 100, height: 100, margin: 5}}
          />
        )}
      />
      <TouchableOpacity
        style={styles.capture}
        onPress={() => this.setState({mode: 'camera'})}>
        <Text style={styles.captureText}>Kamera öffnen</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.mode === 'camera'
          ? this.renderCamera()
          : this.renderPhotoList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureText: {
    fontSize: 14,
    color: 'black',
  },
});

export default PhotoScreen;
