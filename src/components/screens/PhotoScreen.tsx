import React, {useEffect, useRef, useState} from 'react';
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
import PhotoEditor from 'react-native-photo-editor';

const MODES = {
  LIST: 'list',
  CAMERA: 'camera',
  FULL: 'full',
};

const PhotoScreen = () => {
  const cameraRef = useRef<RNCamera | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [mode, setMode] = useState<string>(MODES.LIST);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
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
      setPhotos(photoFiles);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const takePicture = async () => {
    const camera = cameraRef.current;
    if (camera) {
      const options = {quality: 0.5, base64: false};
      const data = await camera.takePictureAsync(options);
      const newFilePath = `${
        RNFS.ExternalDirectoryPath
      }/photo_${Date.now()}.jpg`;
      await RNFS.moveFile(data.uri, newFilePath);
      setPhotos([...photos, newFilePath]);
      setMode(MODES.LIST);
    }
  };

  const confirmDeletePhoto = (photoPath: string) => {
    Alert.alert(
      'Foto löschen',
      'Möchten Sie dieses Foto wirklich löschen?',
      [
        {text: 'Abbrechen', style: 'cancel'},
        {
          text: 'Löschen',
          onPress: () => deletePhoto(photoPath),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const deletePhoto = async (photoPath: string) => {
    try {
      await RNFS.unlink(photoPath);
      const updatedPhotos = photos.filter(path => path !== photoPath);
      setPhotos(updatedPhotos);
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Fehler', 'Foto konnte nicht gelöscht werden.');
    }
  };

  const openFullScreen = (photoPath: string) => {
    setMode(MODES.FULL);
    setSelectedPhoto(photoPath);
  };

  const openPhotoEditor = () => {
    if (!selectedPhoto) return;

    PhotoEditor.Edit({
      path: selectedPhoto,
      stickers: [],
      hiddenControls: ['share', 'save'],
      onDone: loadPhotos,
      onCancel: () => {
        console.log('Editing canceled');
      },
    });
  };

  const renderCamera = () => (
    <View style={{flex: 1}}>
      <RNCamera ref={cameraRef} style={{flex: 1}} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setMode(MODES.LIST)}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Icon name="camera-alt" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderFullScreen = () => (
    <View style={{flex: 1}}>
      <Image
        source={{
          uri: `file://${selectedPhoto}?timestamp=${Date.now()}`,
        }}
        style={{flex: 1, resizeMode: 'contain'}}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setMode(MODES.LIST);
          setSelectedPhoto(null);
          loadPhotos();
        }}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={openPhotoEditor}>
        <Icon name="edit" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderPhotoList = () => (
    <View style={styles.photoListContainer}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onLongPress={() => confirmDeletePhoto(item)}
            onPress={() => openFullScreen(item)}>
            <View style={styles.photoItemContainer}>
              <Image
                source={{uri: `file://${item}?timestamp=${Date.now()}`}}
                style={styles.photoThumbnail}
              />
              <Text style={styles.photoLabel}>{`Foto ${index + 1}`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => setMode(MODES.CAMERA)}
        accessibilityLabel="Kamera öffnen">
        <Icon name="photo-camera" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {mode === MODES.CAMERA
        ? renderCamera()
        : mode === MODES.FULL
        ? renderFullScreen()
        : renderPhotoList()}
    </View>
  );
};

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
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoScreen;
