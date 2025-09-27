import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function PhotoEditor({ imageUri, onSave, onCancel }) {
  const [editedImage, setEditedImage] = useState(imageUri);

  const cropImage = () => {
    ImagePicker.openCropper({
      path: editedImage,
      width: 800,
      height: 600,
      cropping: true,
      cropperToolbarTitle: 'Crop Image',
      cropperActiveWidgetColor: '#2ecc71',
      cropperStatusBarColor: '#2ecc71',
      cropperToolbarColor: '#2ecc71',
      cropperToolbarWidgetColor: '#ffffff',
    }).then(image => {
      setEditedImage(image.path);
    }).catch(error => {
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Error', 'Failed to crop image');
      }
    });
  };

  const rotateImage = () => {
    // Simple rotation using ImagePicker
    ImagePicker.openCropper({
      path: editedImage,
      width: 800,
      height: 600,
      cropping: false,
      includeExif: true,
    }).then(image => {
      setEditedImage(image.path);
    }).catch(error => {
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Error', 'Failed to rotate image');
      }
    });
  };

  const addAnnotation = () => {
    // For now, we'll use the cropper's drawing tools
    ImagePicker.openCropper({
      path: editedImage,
      width: 800,
      height: 600,
      cropping: false,
      freeStyleCropEnabled: true,
      cropperToolbarTitle: 'Annotate Image',
      cropperActiveWidgetColor: '#e74c3c',
      cropperStatusBarColor: '#e74c3c',
      cropperToolbarColor: '#e74c3c',
      cropperToolbarWidgetColor: '#ffffff',
    }).then(image => {
      setEditedImage(image.path);
    }).catch(error => {
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Error', 'Failed to annotate image');
      }
    });
  };

  const saveImage = () => {
    onSave(editedImage);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Photo</Text>
        <TouchableOpacity onPress={saveImage}>
          <Icon name="check" size={24} color="#2ecc71" />
        </TouchableOpacity>
      </View>

      <View style={styles.toolsContainer}>
        <TouchableOpacity style={styles.tool} onPress={cropImage}>
          <Icon name="crop" size={32} color="#2ecc71" />
          <Text style={styles.toolText}>Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tool} onPress={rotateImage}>
          <Icon name="rotate-right" size={32} color="#3498db" />
          <Text style={styles.toolText}>Rotate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tool} onPress={addAnnotation}>
          <Icon name="draw" size={32} color="#e74c3c" />
          <Text style={styles.toolText}>Annotate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • Crop: Adjust image size and focus area
        </Text>
        <Text style={styles.instructionText}>
          • Rotate: Fix image orientation
        </Text>
        <Text style={styles.instructionText}>
          • Annotate: Add arrows or highlights to point out issues
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 32,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tool: {
    alignItems: 'center',
    padding: 16,
  },
  toolText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  instructions: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#2d5a2d',
    marginBottom: 4,
  },
});
