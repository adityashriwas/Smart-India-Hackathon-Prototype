import Voice from '@react-native-voice/voice';
import { Alert } from 'react-native';

class VoiceService {
  constructor() {
    this.isListening = false;
    this.setupVoiceRecognition();
  }

  setupVoiceRecognition = () => {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechError = this.onSpeechError;
  };

  onSpeechStart = (e) => {
    console.log('Speech started');
    this.isListening = true;
  };

  onSpeechEnd = (e) => {
    console.log('Speech ended');
    this.isListening = false;
  };

  onSpeechResults = (e) => {
    console.log('Speech results:', e.value);
    if (this.onResultCallback) {
      this.onResultCallback(e.value[0]);
    }
  };

  onSpeechError = (e) => {
    console.log('Speech error:', e.error);
    Alert.alert('Voice Error', 'Could not recognize speech. Please try again.');
    this.isListening = false;
  };

  startListening = async (callback) => {
    try {
      this.onResultCallback = callback;
      await Voice.start('en-US');
    } catch (error) {
      console.log('Start listening error:', error);
      Alert.alert('Error', 'Could not start voice recognition');
    }
  };

  stopListening = async () => {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.log('Stop listening error:', error);
    }
  };

  destroy = () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };

  isAvailable = async () => {
    try {
      const available = await Voice.isAvailable();
      return available;
    } catch (error) {
      return false;
    }
  };
}

export default new VoiceService();
