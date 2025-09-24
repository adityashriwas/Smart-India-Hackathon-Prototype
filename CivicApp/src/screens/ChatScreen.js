import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-native-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import io from 'socket.io-client';

export default function ChatScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Add welcome message
      setMessages([{
        id: Date.now(),
        text: 'Hello! I\'m here to help with your civic issues. How can I assist you today?',
        sender: 'admin',
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('admin_message', (message) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: message.text,
        sender: 'admin',
        timestamp: message.timestamp
      }]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Send to server
    socket.emit('user_message', {
      text: inputText,
      timestamp: newMessage.timestamp
    });

    setInputText('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.adminMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.adminMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Icon name="chat" size={24} color="#2ecc71" />
        <Text style={styles.headerTitle}>Live Support</Text>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#2ecc71' : '#e74c3c' }]} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  messagesList: { flex: 1 },
  messagesContainer: { padding: 16 },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2ecc71'
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  messageText: { fontSize: 16 },
  userMessageText: { color: 'white' },
  adminMessageText: { color: '#333' },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'flex-end'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    marginRight: 12
  },
  sendButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: { backgroundColor: '#bdc3c7' }
});
