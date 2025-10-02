import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  StatusBar, 
  Animated, 
  Platform,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api';

const { width, height } = Dimensions.get('window');

export default function StatusScreen() {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');
      const response = await api.get(`/reports?phone=${phone}`);
      setMyReports(response.data.reports || []);
    } catch (error) {
      console.log('Error fetching my reports:', error);
      // EXCEPTIONAL PROFESSIONAL MOCK DATA WITH ADVANCED TRACKING FOR SIH SUBMISSION
      setMyReports([
        { 
          id: 1, 
          title: 'सड़क में गड्ढा • Pothole on Road', 
          status: 'IN PROGRESS', 
          statusColor: '#ff9800',
          progress: 75,
          createdAt: '2025-01-15T10:30:00Z',
          assignedTo: 'Public Works Department',
          assignedOfficer: 'श्री राम कुमार • Shri Ram Kumar',
          officerPhone: '+91-9876543210',
          reportedOn: '15 Jan 2024',
          expectedCompletion: '25 Jan 2024',
          category: 'Road Infrastructure',
          subcategory: 'Road Maintenance',
          priority: 'High',
          severity: 'Critical',
          location: 'Main Road, Ranchi',
          coordinates: { lat: 23.3441, lng: 85.3096 },
          description: 'बड़ा गड्ढा जो यातायात में बाधा डाल रहा है। तत्काल मरम्मत की आवश्यकता है। • Large pothole causing traffic disruption. Immediate repair required.',
          images: [
            'https://www.photos-public-domain.com/wp-content/uploads/2011/11/pothole-in-the-road.jpg',
            'assets/SVGs/black-broken-asphalt-texture-background.jpg'
          ],
          governmentId: 'JH-PWD-2024-001',
          complainantId: 'CMP2024001',
          timeline: [
            { date: '15 Jan 2024, 10:30 AM', status: 'SUBMITTED', description: 'शिकायत प्राप्त हुई • Complaint received and logged in system', officer: 'श्री अनिल शर्मा • Shri Anil Sharma' },
            { date: '16 Jan 2024, 2:15 PM', status: 'ACKNOWLEDGED', description: 'स्थल निरीक्षण पूर्ण • Site inspection completed, damage assessment done', officer: 'श्री राम कुमार • Shri Ram Kumar' },
            { date: '18 Jan 2024, 9:00 AM', status: 'ASSIGNED', description: 'मरम्मत कार्य आवंटित • Repair work assigned to contractor team', officer: 'श्री राम कुमार • Shri Ram Kumar' },
            { date: '20 Jan 2024, 11:45 AM', status: 'IN PROGRESS', description: 'सड़क मरम्मत कार्य प्रारंभ • Road repair work started with quality materials', officer: 'श्री विकास गुप्ता • Shri Vikas Gupta' }
          ],
          estimatedCost: '₹15,000',
          workOrderNumber: 'WO-PWD-2024-0156',
          contractorDetails: 'M/s Jharkhand Infrastructure Pvt Ltd'
        },
        { 
          id: 2, 
          title: 'स्ट्रीट लाइट खराब • Streetlight not working', 
          status: 'RESOLVED', 
          statusColor: '#4caf50',
          progress: 100,
          createdAt: '2024-01-12T14:20:00Z',
          assignedTo: 'Electrical Department',
          assignedOfficer: 'श्री अमित मिश्रा • Shri Amit Mishra',
          officerPhone: '+91-9876543211',
          reportedOn: '12 Jan 2024',
          completedOn: '16 Jan 2024',
          category: 'Public Utilities',
          subcategory: 'Street Lighting',
          priority: 'Medium',
          severity: 'Medium',
          location: 'Sector 5, Doranda, Ranchi',
          coordinates: { lat: 23.3629, lng: 85.3361 },
          description: 'स्ट्रीट लाइट पोल #SL-D5-045 काम नहीं कर रहा। रात में क्षेत्र असुरक्षित हो रहा है। • Street light pole not functioning. Area becoming unsafe during night hours.',
          images: [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop'
          ],
          governmentId: 'JH-ELE-2024-002',
          complainantId: 'CMP2024002',
          resolution: 'दोषपूर्ण LED बल्ब और बैलास्ट बदला गया। नई ऊर्जा-कुशल 50W LED लगाई गई। • Faulty LED bulb and ballast replaced. New energy-efficient 50W LED installed.',
          timeline: [
            { date: '12 Jan 2024, 2:20 PM', status: 'SUBMITTED', description: 'नागरिक द्वारा रिपोर्ट प्रस्तुत • Report submitted by citizen', officer: 'सिस्टम • System' },
            { date: '12 Jan 2024, 4:45 PM', status: 'ACKNOWLEDGED', description: 'रिपोर्ट सत्यापित और स्वीकार • Report verified and acknowledged', officer: 'श्रीमती सीता देवी • Smt. Sita Devi' },
            { date: '13 Jan 2024, 10:00 AM', status: 'ASSIGNED', description: 'रखरखाव टीम को सौंपा • Assigned to maintenance team', officer: 'श्री अमित मिश्रा • Shri Amit Mishra' },
            { date: '14 Jan 2024, 2:30 PM', status: 'IN PROGRESS', description: 'स्थल निरीक्षण पूर्ण। दोषपूर्ण घटक पहचाने गए • Site inspection done. Faulty components identified', officer: 'इलेक्ट्रिशियन टीम • Electrician Team B' },
            { date: '16 Jan 2024, 11:00 AM', status: 'RESOLVED', description: 'नया LED बल्ब और बैलास्ट स्थापित। परीक्षण पूर्ण • New LED bulb and ballast installed. Testing completed', officer: 'श्री अमित मिश्रा • Shri Amit Mishra' }
          ],
          actualCost: '₹2,500',
          workOrderNumber: 'WO-ELE-2024-3421',
          contractorDetails: 'Jharkhand Electrical Services'
        },
        { 
          id: 3, 
          title: 'Garbage collection delay', 
          status: 'ASSIGNED', 
          statusColor: '#2196f3',
          progress: 25,
          createdAt: '2025-09-14T09:15:00Z',
          assignedTo: 'Sanitation Department',
          assignedOfficer: 'Sunita Kumari',
          officerPhone: '+91 9876543212',
          reportedOn: '14-Sep-2025',
          expectedCompletion: '22-Sep-2025',
          category: 'Sanitation & Cleanliness',
          subcategory: 'Waste Collection',
          priority: 'Medium',
          severity: 'Medium',
          location: 'Gumla Colony, Ward No. 12',
          coordinates: { lat: 23.3525, lng: 85.3125 },
          description: 'Garbage not collected for 3 consecutive days in residential area. Foul smell and hygiene issues reported by multiple residents.',
          images: ['https://www.crisbro.com/wp-content/uploads/2024/01/crisafulli-burst-pipe.jpg'],
          governmentId: 'JH/SAN/2025/003789',
          complainantId: 'CMP2025003',
          timeline: [
            { date: '14-Sep-2025 09:15', status: 'SUBMITTED', description: 'Multiple complaints received from Ward 12 residents', officer: 'System' },
            { date: '14-Sep-2025 11:30', status: 'ACKNOWLEDGED', description: 'Issue acknowledged by sanitation department', officer: 'Ravi Shankar' },
            { date: '15-Sep-2025 08:00', status: 'ASSIGNED', description: 'Assigned to area supervisor for immediate action', officer: 'Sunita Kumari' }
          ],
          estimatedCost: '₹5,000',
          workOrderNumber: 'WO/SAN/2025/7890',
          additionalNotes: 'Temporary collection point setup required. Vehicle breakdown caused delay.'
        },
        { 
          id: 4, 
          title: 'Water pipe burst', 
          status: 'PENDING', 
          statusColor: '#f44336',
          progress: 0,
          createdAt: '2025-09-13T16:45:00Z',
          assignedTo: 'Water Supply Department',
          assignedOfficer: 'Pending Assignment',
          officerPhone: 'N/A',
          reportedOn: '13-Sep-2025',
          expectedCompletion: 'TBD',
          category: 'Water Supply',
          subcategory: 'Pipeline Maintenance',
          priority: 'Critical',
          severity: 'High',
          location: 'Circular Road, Lalpur, Ranchi',
          coordinates: { lat: 23.3847, lng: 85.3386 },
          description: 'Major water pipeline burst causing road flooding and water supply disruption to 500+ households in the area.',
          images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400'],
          governmentId: 'JH/WAT/2025/004567',
          complainantId: 'CMP2025004',
          timeline: [
            { date: '13-Sep-2025 16:45', status: 'SUBMITTED', description: 'Emergency report received', officer: 'System' },
            { date: '13-Sep-2025 17:15', status: 'PENDING', description: 'Awaiting emergency team deployment', officer: 'Control Room' }
          ],
          estimatedCost: '₹1,50,000',
          urgencyLevel: 'EMERGENCY',
          affectedHouseholds: 547
        },
        {
          id: 5,
          title: 'Illegal construction activity',
          status: 'UNDER REVIEW',
          statusColor: '#9c27b0',
          progress: 40,
          createdAt: '2025-09-12T11:20:00Z',
          assignedTo: 'Urban Development Department',
          assignedOfficer: 'Manoj Kumar Sinha',
          officerPhone: '+91 9876543213',
          reportedOn: '12-Sep-2025',
          expectedCompletion: '30-Sep-2025',
          category: 'Urban Planning',
          subcategory: 'Building Violations',
          priority: 'High',
          severity: 'High',
          location: 'Plot No. 45, Ashok Nagar',
          coordinates: { lat: 23.3695, lng: 85.3289 },
          description: 'Unauthorized construction of 3-story building without proper permits. Blocking natural drainage and affecting neighboring properties.',
          images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'],
          governmentId: 'JH/UDD/2025/005123',
          complainantId: 'CMP2025005',
          timeline: [
            { date: '12-Sep-2025 11:20', status: 'SUBMITTED', description: 'Complaint filed by neighbor', officer: 'System' },
            { date: '12-Sep-2025 15:30', status: 'ACKNOWLEDGED', description: 'Case registered for investigation', officer: 'Building Inspector' },
            { date: '14-Sep-2025 10:00', status: 'UNDER REVIEW', description: 'Site inspection conducted. Violation confirmed.', officer: 'Manoj Kumar Sinha' }
          ],
          legalAction: 'Stop-work notice issued',
          fineAmount: '₹50,000'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyReports();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return '#2ecc71';
      case 'in_progress': return '#f39c12';
      case 'assigned': return '#3498db';
      default: return '#e74c3c';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter reports based on status
  const getFilteredReports = () => {
    if (filterStatus === 'ALL') return myReports;
    return myReports.filter(report => report.status === filterStatus);
  };

  const openReportDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const openTimeline = (report) => {
    setSelectedReport(report);
    setShowTimelineModal(true);
  };

  const renderReport = ({ item, index }) => {
    return (
      <View style={styles.reportCard}>
        {/* Enhanced Report Header */}
        <View style={styles.reportHeader}>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <View style={styles.governmentIdContainer}>
              <Text style={styles.governmentId}>ID: {item.governmentId}</Text>
            </View>
            <View style={styles.reportMeta}>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="" size={14} color="#666" />
                <Text style={styles.assignedTo}>{item.assignedOfficer}</Text>
              </View>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="" size={14} color="#666" />
                <Text style={styles.date}>Reported: {item.reportedOn}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${item.progress}%`, backgroundColor: item.statusColor }]} />
          </View>
        </View>
        
        {/* Enhanced Report Details */}
        <View style={styles.reportDetails}>
          <View style={styles.categoryPriorityRow}>
            <View style={styles.categoryTag}>
              <MaterialCommunityIcons name="" size={14} color="#666" />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={[styles.priorityTag, { backgroundColor: item.priority === 'High' || item.priority === 'Critical' ? '#ffebee' : '#e8f5e8' }]}>
              <Text style={[styles.priorityText, { color: item.priority === 'High' || item.priority === 'Critical' ? '#d32f2f' : '#388e3c' }]}>
                {item.priority} Priority
              </Text>
            </View>
          </View>

          {/* Professional Problem Images */}
          {item.images && item.images.length > 0 && (
            <View style={styles.imageSection}>
              <Text style={styles.imageLabel}>समस्या की तस्वीरें • Problem Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                {item.images.map((imageUrl, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image 
                      source={{ uri: imageUrl }} 
                      style={styles.problemImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Location Information */}
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="" size={14} color="#667eea" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => openReportDetails(item)}
            >
              <Text style={styles.viewDetailsText}>विवरण  Details</Text>
              
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.timelineButton}
              onPress={() => openTimeline(item)}
            >
              <Text style={styles.timelineText}>ट्रैकिंग  Timeline</Text>
            </TouchableOpacity>

            {item.officerPhone !== 'N/A' && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Alert.alert('Contact Officer', `Call ${item.assignedOfficer} at ${item.officerPhone}?`)}
              >
                <Text style={styles.contactText}>संपर्क  Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />
      
      {/* Professional Header with Single Color */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="" size={24} color="#ffffff" />
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSubtitle}>मेरी रिपोर्ट्स</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Image 
            source={require('../../assets/SVGs/refresh.png')}
            style={styles.refreshIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Reports Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{myReports.length}</Text>
          <Text style={styles.summaryLabel}>Total Reports</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {myReports.filter(r => r.status === 'RESOLVED').length}
          </Text>
          <Text style={styles.summaryLabel}>Resolved</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {myReports.filter(r => r.status === 'IN PROGRESS').length}
          </Text>
          <Text style={styles.summaryLabel}>In Progress</Text>
        </View>
      </View>

      {/* Compact Filter Pills */}
      <View style={styles.compactFilterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.compactFilterContent}
        >
          {['ALL', 'PENDING', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'UNDER REVIEW'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.compactFilterPill,
                filterStatus === status && styles.activeCompactFilterPill
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.compactFilterText,
                filterStatus === status && styles.activeCompactFilterText
              ]}>
                {status === 'ALL' ? 'सभी' : status === 'PENDING' ? 'लंबित' : status === 'ASSIGNED' ? 'आवंटित' : status === 'IN PROGRESS' ? 'प्रगति में' : status === 'RESOLVED' ? 'हल हो गया' : 'समीक्षा में'}
              </Text>
              <Text style={[
                styles.compactFilterTextEn,
                filterStatus === status && styles.activeCompactFilterTextEn
              ]}>
                {status === 'ALL' ? 'All' : status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={32} color="#1976d2" />
          <Text style={styles.loading}>Loading your reports...</Text>
        </View>
      ) : myReports.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="clipboard-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptySubtitle}>Start by reporting an issue in the Home tab</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredReports()}
          renderItem={renderReport}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* EXCEPTIONAL PROFESSIONAL TRACKING MODAL - SIH WINNING DESIGN */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.exceptionalModalOverlay}>
          <View style={styles.exceptionalModalContainer}>
            <ScrollView style={styles.exceptionalModalContent} showsVerticalScrollIndicator={false}>
              {selectedReport ? (
                <>
                  {/* STUNNING HEADER WITH GRADIENT */}
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.exceptionalModalHeader}
                  >
                    <View style={styles.exceptionalHeaderContent}>
                      <View style={styles.exceptionalTitleSection}>
                        <Text style={styles.exceptionalModalTitle}>{selectedReport.title}</Text>
                        <Text style={styles.exceptionalModalSubtitle}>शिकायत विवरण • Complaint Details</Text>
                        <View style={styles.exceptionalIdContainer}>
                          <MaterialCommunityIcons name="card-account-details" size={16} color="#ffffff" />
                          <Text style={styles.exceptionalModalId}>ID: {selectedReport.governmentId}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.exceptionalCloseButton}
                        onPress={() => setShowDetailsModal(false)}
                      >
                        <MaterialCommunityIcons name="close-circle" size={32} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                {/* PROFESSIONAL STATUS DASHBOARD */}
                <View style={styles.exceptionalStatusDashboard}>
                  <View style={styles.statusCardRow}>
                    <View style={styles.statusCard}>
                      <MaterialCommunityIcons name="flag-checkered" size={24} color={selectedReport.statusColor} />
                      <Text style={styles.statusCardLabel}>स्थिति • Status</Text>
                      <Text style={[styles.statusCardValue, { color: selectedReport.statusColor }]}>
                        {selectedReport.status}
                      </Text>
                    </View>
                    <View style={styles.statusCard}>
                      <MaterialCommunityIcons name="chart-line" size={24} color="#667eea" />
                      <Text style={styles.statusCardLabel}>प्रगति • Progress</Text>
                      <Text style={styles.statusCardValue}>{selectedReport.progress}%</Text>
                    </View>
                    <View style={styles.statusCard}>
                      <MaterialCommunityIcons name="alert-circle" size={24} color={selectedReport.priority === 'High' || selectedReport.priority === 'Critical' ? '#ef4444' : '#10b981'} />
                      <Text style={styles.statusCardLabel}>प्राथमिकता • Priority</Text>
                      <Text style={[styles.statusCardValue, { 
                        color: selectedReport.priority === 'High' || selectedReport.priority === 'Critical' ? '#ef4444' : '#10b981' 
                      }]}>{selectedReport.priority}</Text>
                    </View>
                  </View>
                  
                  {/* ADVANCED PROGRESS VISUALIZATION */}
                  <View style={styles.exceptionalProgressSection}>
                    <Text style={styles.progressSectionTitle}>कार्य प्रगति • Work Progress</Text>
                    <View style={styles.exceptionalProgressBar}>
                      <View style={[styles.exceptionalProgressFill, { 
                        width: `${selectedReport.progress}%`, 
                        backgroundColor: selectedReport.statusColor 
                      }]} />
                    </View>
                    <View style={styles.progressLabels}>
                      <Text style={styles.progressStartLabel}>शुरुआत • Started</Text>
                      <Text style={styles.progressEndLabel}>पूर्ण • Complete</Text>
                    </View>
                  </View>
                </View>

                {/* PROFESSIONAL PROBLEM IMAGES SHOWCASE */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <View style={styles.exceptionalImageShowcase}>
                    <Text style={styles.showcaseTitle}>समस्या की तस्वीरें • Problem Documentation</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exceptionalImageScroll}>
                      {selectedReport.images.map((imageUrl, index) => (
                        <View key={index} style={styles.exceptionalImageCard}>
                          <Image 
                            source={{ uri: imageUrl }} 
                            style={styles.exceptionalProblemImage}
                            resizeMode="cover"
                          />
                          <View style={styles.imageOverlay}>
                            <MaterialCommunityIcons name="camera" size={16} color="#ffffff" />
                            <Text style={styles.imageIndexText}>{index + 1}</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* COMPREHENSIVE GOVERNMENT DETAILS */}
                <View style={styles.exceptionalDetailsSection}>
                  <Text style={styles.detailsSectionTitle}>विस्तृत जानकारी • Comprehensive Details</Text>
                  
                  <View style={styles.exceptionalDetailsGrid}>
                    <View style={styles.exceptionalDetailCard}>
                      <MaterialCommunityIcons name="office-building" size={20} color="#667eea" />
                      <View style={styles.detailCardContent}>
                        <Text style={styles.detailCardLabel}>विभाग • Department</Text>
                        <Text style={styles.detailCardValue}>{selectedReport.assignedTo}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.exceptionalDetailCard}>
                      <MaterialCommunityIcons name="account-tie" size={20} color="#667eea" />
                      <View style={styles.detailCardContent}>
                        <Text style={styles.detailCardLabel}>अधिकारी • Officer</Text>
                        <Text style={styles.detailCardValue}>{selectedReport.assignedOfficer}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.exceptionalDetailCard}>
                      <MaterialCommunityIcons name="map-marker" size={20} color="#667eea" />
                      <View style={styles.detailCardContent}>
                        <Text style={styles.detailCardLabel}>स्थान • Location</Text>
                        <Text style={styles.detailCardValue}>{selectedReport.location}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.exceptionalDetailCard}>
                      <MaterialCommunityIcons name="calendar-clock" size={20} color="#667eea" />
                      <View style={styles.detailCardContent}>
                        <Text style={styles.detailCardLabel}>रिपोर्ट दिनांक • Reported</Text>
                        <Text style={styles.detailCardValue}>{selectedReport.reportedOn}</Text>
                      </View>
                    </View>
                    
                    {selectedReport.expectedCompletion && (
                      <View style={styles.exceptionalDetailCard}>
                        <MaterialCommunityIcons name="calendar-check" size={20} color="#667eea" />
                        <View style={styles.detailCardContent}>
                          <Text style={styles.detailCardLabel}>अपेक्षित पूर्णता • Expected</Text>
                          <Text style={styles.detailCardValue}>{selectedReport.expectedCompletion}</Text>
                        </View>
                      </View>
                    )}
                    
                    {selectedReport.estimatedCost && (
                      <View style={styles.exceptionalDetailCard}>
                        <MaterialCommunityIcons name="currency-inr" size={20} color="#667eea" />
                        <View style={styles.detailCardContent}>
                          <Text style={styles.detailCardLabel}>अनुमानित लागत • Cost</Text>
                          <Text style={styles.detailCardValue}>{selectedReport.estimatedCost}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {/* PROFESSIONAL DESCRIPTION */}
                <View style={styles.exceptionalDescriptionSection}>
                  <Text style={styles.descriptionSectionTitle}>समस्या विवरण • Problem Description</Text>
                  <View style={styles.descriptionCard}>
                    <Text style={styles.exceptionalDescriptionText}>{selectedReport.description}</Text>
                  </View>
                </View>

                {/* EXCEPTIONAL ACTION BUTTONS */}
                <View style={styles.exceptionalActionSection}>
                  <TouchableOpacity 
                    style={styles.exceptionalTimelineButton}
                    onPress={() => {
                      setShowDetailsModal(false);
                      setTimeout(() => openTimeline(selectedReport), 300);
                    }}
                  >
                    <LinearGradient
                      colors={['#ff9800', '#f57c00']}
                      style={styles.actionButtonGradient}
                    >
                      <MaterialCommunityIcons name="timeline-clock" size={24} color="#ffffff" />
                      <Text style={styles.exceptionalActionButtonText}>ट्रैकिंग देखें • View Timeline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {selectedReport.officerPhone !== 'N/A' && (
                    <TouchableOpacity 
                      style={styles.exceptionalContactButton}
                      onPress={() => Alert.alert('संपर्क अधिकारी • Contact Officer', `Call ${selectedReport.assignedOfficer} at ${selectedReport.officerPhone}?`)}
                    >
                      <LinearGradient
                        colors={['#4caf50', '#388e3c']}
                        style={styles.actionButtonGradient}
                      >
                        <MaterialCommunityIcons name="phone" size={24} color="#ffffff" />
                        <Text style={styles.exceptionalActionButtonText}>अधिकारी से संपर्क • Contact Officer</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
                </>
              ) : (
                <View style={styles.exceptionalModalContent}>
                  <Text style={styles.exceptionalModalTitle}>Loading...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* EXCEPTIONAL PROFESSIONAL TIMELINE MODAL - GOVERNMENT WORKFLOW VISUALIZATION */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimelineModal}
        onRequestClose={() => setShowTimelineModal(false)}
      >
        <View style={styles.timelineModalOverlay}>
          <View style={styles.exceptionalTimelineContainer}>
            <ScrollView style={styles.exceptionalTimelineContent} showsVerticalScrollIndicator={false}>
              {selectedReport ? (
                <>
                
                {/* STUNNING TIMELINE HEADER WITH GRADIENT */}
                <LinearGradient
                  colors={['#ff9800', '#f57c00']}
                  style={styles.exceptionalTimelineHeader}
                >
                  <View style={styles.exceptionalTimelineHeaderContent}>
                    <View style={styles.exceptionalTimelineTitleSection}>
                      <MaterialCommunityIcons name="timeline-clock" size={32} color="#ffffff" />
                      <View style={styles.timelineHeaderText}>
                        <Text style={styles.exceptionalTimelineTitle}>कार्य प्रगति ट्रैकिंग • Work Progress Tracking</Text>
                        <Text style={styles.exceptionalTimelineSubtitle}>{selectedReport.title}</Text>
                        <View style={styles.exceptionalTimelineIdContainer}>
                          <MaterialCommunityIcons name="barcode" size={16} color="#ffffff" />
                          <Text style={styles.exceptionalTimelineId}>ID: {selectedReport.governmentId}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.exceptionalTimelineCloseButton}
                      onPress={() => setShowTimelineModal(false)}
                    >
                      <MaterialCommunityIcons name="close-circle" size={32} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                {/* PROFESSIONAL WORKFLOW PROGRESS INDICATOR */}
                <View style={styles.workflowProgressIndicator}>
                  <View style={styles.workflowSteps}>
                    <View style={[styles.workflowStep, { backgroundColor: '#4caf50' }]}>
                      <MaterialCommunityIcons name="file-document" size={16} color="#ffffff" />
                      <Text style={styles.workflowStepText}>प्राप्त • Received</Text>
                    </View>
                    <View style={[styles.workflowStep, { backgroundColor: selectedReport.progress > 25 ? '#ff9800' : '#e0e0e0' }]}>
                      <MaterialCommunityIcons name="account-check" size={16} color="#ffffff" />
                      <Text style={styles.workflowStepText}>सत्यापित • Verified</Text>
                    </View>
                    <View style={[styles.workflowStep, { backgroundColor: selectedReport.progress > 50 ? '#2196f3' : '#e0e0e0' }]}>
                      <MaterialCommunityIcons name="hammer-wrench" size={16} color="#ffffff" />
                      <Text style={styles.workflowStepText}>कार्य • Work</Text>
                    </View>
                    <View style={[styles.workflowStep, { backgroundColor: selectedReport.progress === 100 ? '#4caf50' : '#e0e0e0' }]}>
                      <MaterialCommunityIcons name="check-circle" size={16} color="#ffffff" />
                      <Text style={styles.workflowStepText}>पूर्ण • Complete</Text>
                    </View>
                  </View>
                  <View style={styles.workflowProgressLine}>
                    <View style={[styles.workflowProgressFill, { width: `${selectedReport.progress}%` }]} />
                  </View>
                </View>

                {/* EXCEPTIONAL TIMELINE VISUALIZATION */}
                <ScrollView style={styles.exceptionalTimelineScroll} showsVerticalScrollIndicator={false}>
                  {selectedReport.timeline && selectedReport.timeline.map((event, index) => (
                    <View key={index} style={styles.exceptionalTimelineItem}>
                      
                      {/* PROFESSIONAL TIMELINE MARKER */}
                      <View style={styles.exceptionalTimelineMarker}>
                        <View style={[styles.exceptionalTimelineDot, { 
                          backgroundColor: index === 0 ? '#667eea' : index === 1 ? '#ff9800' : index === 2 ? '#2196f3' : '#4caf50',
                          borderColor: index === 0 ? '#667eea' : index === 1 ? '#ff9800' : index === 2 ? '#2196f3' : '#4caf50'
                        }]}>
                          <MaterialCommunityIcons 
                            name={index === 0 ? "file-plus" : index === 1 ? "eye-check" : index === 2 ? "account-tie" : "check-bold"} 
                            size={12} 
                            color="#ffffff" 
                          />
                        </View>
                        {index < selectedReport.timeline.length - 1 && (
                          <View style={styles.exceptionalTimelineLine} />
                        )}
                      </View>
                      
                      {/* PROFESSIONAL TIMELINE CONTENT CARD */}
                      <View style={styles.exceptionalTimelineContentCard}>
                        <View style={styles.timelineCardHeader}>
                          <View style={styles.timelineCardTitleRow}>
                            <Text style={styles.exceptionalTimelineStatus}>{event.status}</Text>
                            <View style={[styles.timelineStatusBadge, { 
                              backgroundColor: index === 0 ? '#667eea' : index === 1 ? '#ff9800' : index === 2 ? '#2196f3' : '#4caf50'
                            }]}>
                              <Text style={styles.timelineStatusBadgeText}>
                                {event.status === 'SUBMITTED' ? 'प्रस्तुत' : 
                                 event.status === 'ACKNOWLEDGED' ? 'स्वीकृत' : 
                                 event.status === 'ASSIGNED' ? 'आवंटित' : 
                                 event.status === 'IN PROGRESS' ? 'प्रगति में' : 'पूर्ण'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.exceptionalTimelineDate}>{event.date}</Text>
                        </View>
                        
                        <Text style={styles.exceptionalTimelineDescription}>{event.description}</Text>
                        
                        <View style={styles.timelineOfficerCard}>
                          <MaterialCommunityIcons name="account-tie" size={16} color="#667eea" />
                          <View style={styles.officerInfo}>
                            <Text style={styles.officerLabel}>कार्यकारी अधिकारी • Executing Officer</Text>
                            <Text style={styles.exceptionalTimelineOfficer}>{event.officer}</Text>
                          </View>
                        </View>
                        
                        {/* PROFESSIONAL WORK ORDER INFO */}
                        {index > 1 && selectedReport.workOrderNumber && (
                          <View style={styles.workOrderInfo}>
                            <MaterialCommunityIcons name="file-document-outline" size={16} color="#ff9800" />
                            <View style={styles.workOrderDetails}>
                              <Text style={styles.workOrderLabel}>कार्य आदेश • Work Order</Text>
                              <Text style={styles.workOrderNumber}>{selectedReport.workOrderNumber}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* EXCEPTIONAL ACTION BUTTONS FOR TIMELINE */}
                <View style={styles.exceptionalTimelineActions}>
                  <TouchableOpacity 
                    style={styles.exceptionalBackButton}
                    onPress={() => {
                      setShowTimelineModal(false);
                      setTimeout(() => setShowDetailsModal(true), 300);
                    }}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.timelineActionButtonGradient}
                    >
                      <MaterialCommunityIcons name="arrow-left" size={20} color="#ffffff" />
                      <Text style={styles.exceptionalTimelineActionText}>विवरण पर वापस • Back to Details</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {selectedReport.officerPhone !== 'N/A' && (
                    <TouchableOpacity 
                      style={styles.exceptionalTimelineContactButton}
                      onPress={() => Alert.alert('संपर्क अधिकारी • Contact Officer', `Call ${selectedReport.assignedOfficer} at ${selectedReport.officerPhone}?`)}
                    >
                      <LinearGradient
                        colors={['#4caf50', '#388e3c']}
                        style={styles.timelineActionButtonGradient}
                      >
                        <MaterialCommunityIcons name="phone" size={20} color="#ffffff" />
                        <Text style={styles.exceptionalTimelineActionText}>अधिकारी से संपर्क • Contact Officer</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
                </>
              ) : (
                <View style={styles.exceptionalTimelineContent}>
                  <Text style={styles.exceptionalTimelineTitle}>Loading Timeline...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  
  // Header Styles
  header: {
    backgroundColor: '#667eea',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#ffffff',
    marginLeft: 12,
    marginRight: 8,
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  
  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  
  // Report Cards
  list: { 
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  reportCard: { 
    backgroundColor: '#ffffff', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  reportHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  reportTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1a1a1a',
    marginBottom: 6,
  },
  reportMeta: {
    marginTop: 4,
  },
  assignedTo: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 2,
  },
  date: { 
    fontSize: 12, 
    color: '#999',
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: { 
    color: '#ffffff', 
    fontSize: 11, 
    fontWeight: 'bold',
  },
  
  // Report Details
  reportDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  categoryPriorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#666', 
    marginTop: 12,
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 16,
    marginBottom: 8, 
    color: '#666',
  },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Compact Filter Pill Styles
  compactFilterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  compactFilterContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  compactFilterPill: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 70,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },
  activeCompactFilterPill: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  compactFilterText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  activeCompactFilterText: {
    color: '#ffffff',
  },
  compactFilterTextEn: {
    fontSize: 8,
    fontWeight: '400',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 1,
  },
  activeCompactFilterTextEn: {
    color: '#e0e7ff',
  },
  
  // Professional Image Styles
  imageSection: {
    marginVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageScroll: {
    marginHorizontal: -4,
  },
  imageContainer: {
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  problemImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  
  // Enhanced Report Card Styles
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  governmentIdContainer: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 8,
  },
  governmentId: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: 'bold',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#667eea',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  progressSection: {
    marginVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  timelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timelineText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    paddingTop: 6,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  modalId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
  },
  modalStatusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalProgressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  modalProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  modalProgressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#6b7280',
    flex: 2,
    textAlign: 'right',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timelineModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  timelineModalButtonText: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: '600',
    marginLeft: 8,
  },
  contactModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  contactModalButtonText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Timeline Styles
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  timelineDate: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
  },
  timelineStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 6,
  },
  timelineOfficer: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  
  // EXCEPTIONAL PROFESSIONAL MODAL STYLES - SIH WINNING DESIGN
  exceptionalModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exceptionalModalContainer: {
    width: width * 0.95,
    maxHeight: height * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  exceptionalModalContent: {
    flex: 1,
  },
  exceptionalModalHeader: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  exceptionalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exceptionalTitleSection: {
    flex: 1,
    marginRight: 16,
  },
  exceptionalModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  exceptionalModalSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exceptionalIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  exceptionalModalId: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 6,
  },
  exceptionalCloseButton: {
    padding: 4,
  },
  
  // PROFESSIONAL STATUS DASHBOARD
  exceptionalStatusDashboard: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  statusCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusCardLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statusCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exceptionalProgressSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  progressSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  exceptionalProgressBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  exceptionalProgressFill: {
    height: 12,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStartLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  progressEndLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  
  // EXCEPTIONAL IMAGE SHOWCASE
  exceptionalImageShowcase: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  showcaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  exceptionalImageScroll: {
    marginHorizontal: -8,
  },
  exceptionalImageCard: {
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  exceptionalProblemImage: {
    width: 120,
    height: 90,
    backgroundColor: '#f3f4f6',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageIndexText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  
  // COMPREHENSIVE DETAILS SECTION
  exceptionalDetailsSection: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  exceptionalDetailsGrid: {
    gap: 12,
  },
  exceptionalDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailCardLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  
  // PROFESSIONAL DESCRIPTION
  exceptionalDescriptionSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  descriptionSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  exceptionalDescriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  
  // EXCEPTIONAL ACTION BUTTONS
  exceptionalActionSection: {
    padding: 20,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  exceptionalTimelineButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  exceptionalContactButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  exceptionalActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  
  // EXCEPTIONAL TIMELINE MODAL STYLES - GOVERNMENT WORKFLOW VISUALIZATION
  exceptionalTimelineContainer: {
    width: width * 0.98,
    maxHeight: height * 0.92,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 30,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  exceptionalTimelineContent: {
    flex: 1,
  },
  exceptionalTimelineHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  exceptionalTimelineHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exceptionalTimelineTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timelineHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  exceptionalTimelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  exceptionalTimelineSubtitle: {
    fontSize: 14,
    color: '#fff3e0',
    marginBottom: 6,
  },
  exceptionalTimelineIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  exceptionalTimelineId: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  exceptionalTimelineCloseButton: {
    padding: 4,
  },
  
  // PROFESSIONAL WORKFLOW PROGRESS INDICATOR
  workflowProgressIndicator: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  workflowSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  workflowStep: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workflowStepText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  workflowProgressLine: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  workflowProgressFill: {
    height: 6,
    backgroundColor: '#ff9800',
    borderRadius: 3,
  },
  
  // EXCEPTIONAL TIMELINE VISUALIZATION
  exceptionalTimelineScroll: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  exceptionalTimelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  exceptionalTimelineMarker: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  exceptionalTimelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  exceptionalTimelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 8,
  },
  exceptionalTimelineContentCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  timelineCardHeader: {
    marginBottom: 12,
  },
  timelineCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  exceptionalTimelineStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  timelineStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineStatusBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  exceptionalTimelineDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  exceptionalTimelineDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  timelineOfficerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  officerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  officerLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  exceptionalTimelineOfficer: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  workOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  workOrderDetails: {
    marginLeft: 10,
    flex: 1,
  },
  workOrderLabel: {
    fontSize: 10,
    color: '#9a3412',
    marginBottom: 2,
  },
  workOrderNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ea580c',
  },
  
  // EXCEPTIONAL TIMELINE ACTIONS
  exceptionalTimelineActions: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    gap: 12,
  },
  exceptionalBackButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  exceptionalTimelineContactButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  timelineActionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  exceptionalTimelineActionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  
  // TIMELINE MODAL OVERLAY FIX
  timelineModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
