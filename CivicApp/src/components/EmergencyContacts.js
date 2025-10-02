import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DEFAULT_CONTACTS = [
  { id: '1', name: 'Police Emergency', number: '100', type: 'police', icon: 'police-badge' },
  { id: '2', name: 'Fire Department', number: '101', type: 'fire', icon: 'fire-truck' },
  { id: '3', name: 'Ambulance', number: '108', type: 'medical', icon: 'ambulance' },
  { id: '4', name: 'Municipal Corporation', number: '1800-XXX-XXXX', type: 'civic', icon: 'city' },
  { id: '5', name: 'Water Emergency', number: '1916', type: 'water', icon: 'water' },
  { id: '6', name: 'Electricity Board', number: '1912', type: 'electricity', icon: 'flash' },
];

export default function EmergencyContacts({ onClose }) {
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [customContacts, setCustomContacts] = useState([]);

  useEffect(() => {
    loadCustomContacts();
  }, []);

  const loadCustomContacts = async () => {
    try {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) {
        setCustomContacts(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading emergency contacts:', error);
    }
  };

  const makeCall = (number, name) => {
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Error', 'Unable to make call');
            });
          }
        }
      ]
    );
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'police': return '#3498db';
      case 'fire': return '#e74c3c';
      case 'medical': return '#2ecc71';
      case 'civic': return '#f39c12';
      case 'water': return '#3498db';
      case 'electricity': return '#f1c40f';
      default: return '#95a5a6';
    }
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => makeCall(item.number, item.name)}
    >
      <View style={styles.contactInfo}>
        <Icon 
          name={item.icon} 
          size={32} 
          color={getIconColor(item.type)} 
          style={styles.contactIcon}
        />
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactNumber}>{item.number}</Text>
        </View>
      </View>
      <Icon name="phone" size={24} color="#2ecc71" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Contacts</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Quick access to important emergency and civic service numbers
        </Text>

        <FlatList
          data={[...contacts, ...customContacts]}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.disclaimer}>
          <Icon name="information" size={16} color="#f39c12" />
          <Text style={styles.disclaimerText}>
            For life-threatening emergencies, call 112 (National Emergency Number)
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
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
});
