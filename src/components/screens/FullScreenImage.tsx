import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhotoEditor from 'react-native-photo-editor';

interface FullScreenImageProps {
  photoPath: string;
  onBack: () => void;
  onEditDone: () => void; // Callback nach Abschluss der Bearbeitung
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  photoPath,
  onBack,
  onEditDone,
}) => {
  // Funktion zum Starten des Editors
  const openPhotoEditor = () => {
    PhotoEditor.Edit({
      path: photoPath,
      stickers: [],
      hiddenControls: ['share', 'save'],
      onDone: onEditDone, // Rückruf bei erfolgreicher Bearbeitung
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `file://${photoPath}?timestamp=${Date.now()}`,
        }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={openPhotoEditor}>
        <Icon name="edit" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
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

export default FullScreenImage;
