import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

class PhotoScreen extends Component {
  camera: RNCamera | null | undefined;

  state = {
    photos: [], // List of photos with paths
    mode: 'list', // 'list', 'camera', or 'full'
    selectedPhoto: null, // Path of the photo currently displayed in full screen
  };

  componentDidMount() {
    this.loadPhotos();
  }

  // Load previously taken photos
  loadPhotos = async () => {
    try {
      const files = await RNFS.readDir(RNFS.ExternalDirectoryPath);
      const photoFiles = files
        .filter(
          file =>
            file.isFile() &&
            file.name.startsWith('photo_') &&
            file.name.endsWith('.jpg'),
        )
        .map(file => file.path);
      this.setState({photos: photoFiles});
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: false};
      const data = await this.camera.takePictureAsync(options);
      const newFilePath = `${
        RNFS.ExternalDirectoryPath
      }/photo_${Date.now()}.jpg`;
      await RNFS.moveFile(data.uri, newFilePath);
      this.setState({
        photos: [...this.state.photos, newFilePath],
        mode: 'list',
      });
    }
  };

  confirmDeletePhoto = (photoPath: string) => {
    Alert.alert(
      'Foto löschen',
      'Möchten Sie dieses Foto wirklich löschen?',
      [
        {text: 'Abbrechen', style: 'cancel'},
        {
          text: 'Löschen',
          onPress: () => this.deletePhoto(photoPath),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  deletePhoto = async (photoPath: string) => {
    try {
      // Remove file from the filesystem
      await RNFS.unlink(photoPath);

      // Update the photos state by filtering out the deleted photo
      const updatedPhotos = this.state.photos.filter(
        path => path !== photoPath,
      );
      this.setState({photos: updatedPhotos});
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Fehler', 'Foto konnte nicht gelöscht werden.');
    }
  };

  openFullScreen = (photoPath: string) => {
    this.setState({mode: 'full', selectedPhoto: photoPath});
  };

  renderCamera = () => (
    <View style={{flex: 1}}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{flex: 1}}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => this.setState({mode: 'list'})}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
        <Icon name="camera-alt" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  renderFullScreen = () => (
    <View style={{flex: 1}}>
      <Image
        source={{uri: `file://${this.state.selectedPhoto}`}}
        style={{flex: 1, resizeMode: 'contain'}}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => this.setState({mode: 'list', selectedPhoto: null})}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  renderPhotoList = () => (
    <View style={styles.photoListContainer}>
      <FlatList
        data={this.state.photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onLongPress={() => this.confirmDeletePhoto(item)}
            onPress={() => this.openFullScreen(item)}>
            <View style={styles.photoItemContainer}>
              <Image
                source={{uri: `file://${item}`}}
                style={styles.photoThumbnail}
              />
              <Text style={styles.photoLabel}>{`Foto ${index + 1}`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => this.setState({mode: 'camera'})}>
        <Icon name="photo-camera" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.mode === 'camera'
          ? this.renderCamera()
          : this.state.mode === 'full'
          ? this.renderFullScreen()
          : this.renderPhotoList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  photoListContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  photoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  photoLabel: {
    fontSize: 16,
    color: 'black',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 25,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    fontSize: 14,
    color: 'black',
  },
});

export default PhotoScreen;
