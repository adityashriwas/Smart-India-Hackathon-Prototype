import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SocialShare({ report, onClose }) {
  const shareReport = async (platform = 'general') => {
    try {
      const message = `🏛️ Civic Issue Reported via Jharkhand Municipal App\n\n` +
                     `📍 Issue: ${report.title}\n` +
                     `📝 Description: ${report.description}\n` +
                     `🏷️ Category: ${report.category}\n` +
                     `📅 Reported: ${new Date().toLocaleDateString()}\n\n` +
                     `Help make our city better! Download the Jharkhand Civic Services app.`;

      const shareOptions = {
        message: message,
        title: 'Civic Issue Report',
      };

      if (report.imageUri) {
        shareOptions.url = report.imageUri;
      }

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Report shared successfully!');
        onClose && onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share report');
    }
  };

  const shareToWhatsApp = () => {
    // WhatsApp sharing would require react-native-share for direct app integration
    shareReport('whatsapp');
  };

  const shareToTwitter = () => {
    shareReport('twitter');
  };

  const shareToFacebook = () => {
    shareReport('facebook');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Report</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Share this civic issue to raise awareness and encourage community participation
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={[styles.option, styles.whatsapp]} onPress={shareToWhatsApp}>
            <Icon name="whatsapp" size={32} color="white" />
            <Text style={styles.optionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.twitter]} onPress={shareToTwitter}>
            <Icon name="twitter" size={32} color="white" />
            <Text style={styles.optionText}>Twitter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.facebook]} onPress={shareToFacebook}>
            <Icon name="facebook" size={32} color="white" />
            <Text style={styles.optionText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.general]} onPress={() => shareReport()}>
            <Icon name="share-variant" size={32} color="white" />
            <Text style={styles.optionText}>More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            💡 Sharing helps create community awareness and faster resolution of civic issues
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  whatsapp: {
    backgroundColor: '#25D366',
  },
  twitter: {
    backgroundColor: '#1DA1F2',
  },
  facebook: {
    backgroundColor: '#4267B2',
  },
  general: {
    backgroundColor: '#6c757d',
  },
  optionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  disclaimer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});
