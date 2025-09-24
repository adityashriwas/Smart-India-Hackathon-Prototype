import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../api';

export default function MapScreen() {
  const [nearbyReports, setNearbyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyReports();
  }, []);

  const fetchNearbyReports = async () => {
    try {
      const response = await api.get('/reports');
      setNearbyReports(response.data.reports || []);
    } catch (error) {
      console.log('Error fetching reports:', error);
      // Mock data for demo
      setNearbyReports([
        { id: 1, title: 'Pothole on Main Road', status: 'pending', distance: '0.2 km' },
        { id: 2, title: 'Broken Streetlight', status: 'in_progress', distance: '0.5 km' },
        { id: 3, title: 'Garbage Collection Issue', status: 'resolved', distance: '1.1 km' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return '#2ecc71';
      case 'in_progress': return '#f39c12';
      default: return '#e74c3c';
    }
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity style={styles.reportCard} onPress={() => Alert.alert('Report Details', item.title)}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Reports</Text>
      {loading ? (
        <Text style={styles.loading}>Loading reports...</Text>
      ) : (
        <FlatList
          data={nearbyReports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  loading: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 50 },
  list: { flex: 1 },
  reportCard: { 
    backgroundColor: 'white', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 8, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reportTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  distance: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});
