import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen({ navigation, route }) {
  const { reportId } = route?.params || { reportId: 1 };
  const [trackingData, setTrackingData] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Professional tracking data matching government standards
  const sampleTrackingData = {
    id: reportId,
    complaintNumber: 'CCP/2024/000' + reportId,
    title: 'सड़क पर गड्ढा',
    titleEn: 'Pothole on main road',
    description: 'मुख्य सड़क पर बड़ा गड्ढा है जो खतरनाक है और तत्काल ध्यान देने की आवश्यकता है।',
    descriptionEn: 'Large pothole on main road that is dangerous and needs immediate attention.',
    category: 'सड़क और परिवहन',
    categoryEn: 'Roads & Transport',
    submittedDate: '२१ सितंबर २०२४',
    submittedDateEn: '21 September 2024',
    expectedResolution: '२८ सितंबर २०२४',
    expectedResolutionEn: '28 September 2024',
    priority: 'उच्च',
    priorityEn: 'High',
    priorityColor: '#ef4444',
    location: {
      address: 'सेक्टर २२, गुरुग्राम, हरियाणा १२२००१',
      addressEn: 'Sector 22, Gurugram, Haryana 122001',
      coordinates: { lat: 28.4595, lng: 77.0266 }
    },
    assignedOfficer: {
      name: 'श्री राजेश कुमार',
      nameEn: 'Shri Rajesh Kumar',
      designation: 'सहायक अभियंता',
      designationEn: 'Assistant Engineer',
      department: 'लोक निर्माण विभाग',
      departmentEn: 'Public Works Department',
      contact: '+91-98765-43210'
    },
    currentStatus: 'कार्य प्रगति में',
    currentStatusEn: 'Work in Progress',
    progressPercentage: 65,
    trackingSteps: [
      {
        step: 1,
        title: 'रिपोर्ट दर्ज',
        titleEn: 'Report Submitted',
        description: 'शिकायत सफलतापूर्वक दर्ज की गई',
        descriptionEn: 'Complaint successfully registered',
        timestamp: '२१ सितंबर २०२४, ०९:३० AM',
        timestampEn: '21 Sept 2024, 09:30 AM',
        status: 'पूर्ण',
        statusEn: 'Completed',
        icon: '✅',
        completed: true
      },
      {
        step: 2,
        title: 'सत्यापन',
        titleEn: 'Verification',
        description: 'अधिकारी द्वारा साइट का निरीक्षण',
        descriptionEn: 'Site inspection by officer',
        timestamp: '२२ सितंबर २०२४, ११:१५ AM',
        timestampEn: '22 Sept 2024, 11:15 AM',
        status: 'पूर्ण',
        statusEn: 'Completed',
        icon: '🔍',
        completed: true
      },
      {
        step: 3,
        title: 'कार्य आवंटन',
        titleEn: 'Work Assignment',
        description: 'ठेकेदार को कार्य सौंपा गया',
        descriptionEn: 'Work assigned to contractor',
        timestamp: '२३ सितंबर २०२४, ०२:४५ PM',
        timestampEn: '23 Sept 2024, 02:45 PM',
        status: 'पूर्ण',
        statusEn: 'Completed',
        icon: '📋',
        completed: true
      },
      {
        step: 4,
        title: 'कार्य प्रगति',
        titleEn: 'Work in Progress',
        description: 'सड़क मरम्मत का कार्य चालू है',
        descriptionEn: 'Road repair work is ongoing',
        timestamp: '२४ सितंबर २०२४, ०८:०० AM',
        timestampEn: '24 Sept 2024, 08:00 AM',
        status: 'प्रगति में',
        statusEn: 'In Progress',
        icon: '🔧',
        completed: false,
        current: true
      },
      {
        step: 5,
        title: 'गुणवत्ता जांच',
        titleEn: 'Quality Check',
        description: 'कार्य पूर्णता की जांच',
        descriptionEn: 'Work completion verification',
        timestamp: 'अपेक्षित: २७ सितंबर २०२४',
        timestampEn: 'Expected: 27 Sept 2024',
        status: 'लंबित',
        statusEn: 'Pending',
        icon: '⏳',
        completed: false
      },
      {
        step: 6,
        title: 'समाधान',
        titleEn: 'Resolution',
        description: 'शिकायत का समाधान',
        descriptionEn: 'Complaint resolution',
        timestamp: 'अपेक्षित: २८ सितंबर २०२४',
        timestampEn: 'Expected: 28 Sept 2024',
        status: 'लंबित',
        statusEn: 'Pending',
        icon: '🎯',
        completed: false
      }
    ],
    images: [
      { id: 1, uri: 'report_image_1.jpg', caption: 'प्रारंभिक शिकायत तस्वीर' },
      { id: 2, uri: 'progress_image_1.jpg', caption: 'कार्य प्रगति तस्वीर' },
    ],
    updates: [
      {
        id: 1,
        message: 'मरम्मत सामग्री साइट पर पहुंच गई है।',
        messageEn: 'Repair materials have arrived at site.',
        timestamp: '२४ सितंबर २०२४, ०९:३० AM',
        by: 'श्री राजेश कुमार'
      },
      {
        id: 2,
        message: 'कार्य आरंभ हो गया है, ५०% पूर्ण।',
        messageEn: 'Work has started, 50% completed.',
        timestamp: '२४ सितंबर २०२४, ०३:१५ PM',
        by: 'श्री राजेश कुमार'
      }
    ]
  };

  useEffect(() => {
    setTrackingData(sampleTrackingData);
    
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: sampleTrackingData.progressPercentage / 100,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const getStepColor = (step) => {
    if (step.completed) return '#10b981';
    if (step.current) return '#f59e0b';
    return '#d1d5db';
  };

  const renderTrackingStep = (step, index) => (
    <View key={step.step} style={styles.trackingStep}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepCircle, { backgroundColor: getStepColor(step) }]}>
          <Text style={styles.stepIcon}>{step.icon}</Text>
        </View>
        {index < trackingData.trackingSteps.length - 1 && (
          <View style={[styles.stepLine, { backgroundColor: step.completed ? '#10b981' : '#d1d5db' }]} />
        )}
      </View>
      
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepTitleEn}>{step.titleEn}</Text>
        </View>
        
        <Text style={styles.stepDescription}>{step.description}</Text>
        <Text style={styles.stepDescriptionEn}>{step.descriptionEn}</Text>
        
        <View style={styles.stepMeta}>
          <Text style={styles.stepTimestamp}>{step.timestamp}</Text>
          <View style={[styles.stepStatus, { backgroundColor: getStepColor(step) }]}>
            <Text style={styles.stepStatusText}>{step.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (!trackingData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>ट्रैकिंग जानकारी लोड हो रही है...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Professional Header */}
      <View style={styles.professionalHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>ट्रैक रिपोर्ट / Track Report</Text>
            <Text style={styles.headerSubtitle}>#{trackingData.complaintNumber}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Complaint Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.complaintHeader}>
              <View style={styles.complaintInfo}>
                <Text style={styles.complaintTitle}>{trackingData.title}</Text>
                <Text style={styles.complaintTitleEn}>{trackingData.titleEn}</Text>
                <Text style={styles.complaintCategory}>{trackingData.category}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: trackingData.priorityColor }]}>
                <Text style={styles.priorityText}>{trackingData.priority}</Text>
              </View>
            </View>

            <Text style={styles.complaintDescription}>{trackingData.description}</Text>
            <Text style={styles.complaintDescriptionEn}>{trackingData.descriptionEn}</Text>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>प्रगति / Progress</Text>
                <Text style={styles.progressPercentage}>{trackingData.progressPercentage}%</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </View>
              <Text style={styles.currentStatus}>{trackingData.currentStatus}</Text>
            </View>
          </View>

          {/* Officer Information */}
          <View style={styles.officerCard}>
            <Text style={styles.sectionTitle}>नियुक्त अधिकारी / Assigned Officer</Text>
            <View style={styles.officerInfo}>
              <View style={styles.officerAvatar}>
                <Text style={styles.officerInitials}>
                  {trackingData.assignedOfficer.nameEn.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.officerDetails}>
                <Text style={styles.officerName}>{trackingData.assignedOfficer.name}</Text>
                <Text style={styles.officerNameEn}>{trackingData.assignedOfficer.nameEn}</Text>
                <Text style={styles.officerDesignation}>{trackingData.assignedOfficer.designation}</Text>
                <Text style={styles.officerDepartment}>{trackingData.assignedOfficer.department}</Text>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Alert.alert('संपर्क / Contact', trackingData.assignedOfficer.contact)}
              >
                <Text style={styles.contactIcon}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Information */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>स्थान / Location</Text>
            <View style={styles.locationInfo}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationDetails}>
                <Text style={styles.locationAddress}>{trackingData.location.address}</Text>
                <Text style={styles.locationAddressEn}>{trackingData.location.addressEn}</Text>
              </View>
              <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>मैप / Map</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tracking Timeline */}
          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>ट्रैकिंग टाइमलाइन / Tracking Timeline</Text>
            <View style={styles.timeline}>
              {trackingData.trackingSteps.map((step, index) => renderTrackingStep(step, index))}
            </View>
          </View>

          {/* Recent Updates */}
          <View style={styles.updatesCard}>
            <Text style={styles.sectionTitle}>नवीनतम अपडेट / Recent Updates</Text>
            {trackingData.updates.map((update) => (
              <View key={update.id} style={styles.updateItem}>
                <View style={styles.updateHeader}>
                  <Text style={styles.updateTimestamp}>{update.timestamp}</Text>
                  <Text style={styles.updateBy}>- {update.by}</Text>
                </View>
                <Text style={styles.updateMessage}>{update.message}</Text>
                <Text style={styles.updateMessageEn}>{update.messageEn}</Text>
              </View>
            ))}
          </View>

          {/* Resolution Timeline */}
          <View style={styles.resolutionCard}>
            <Text style={styles.sectionTitle}>अपेक्षित समाधान / Expected Resolution</Text>
            <View style={styles.resolutionInfo}>
              <Text style={styles.resolutionDate}>{trackingData.expectedResolution}</Text>
              <Text style={styles.resolutionDateEn}>{trackingData.expectedResolutionEn}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>📞</Text>
          <Text style={styles.actionButtonText}>संपर्क / Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>📤</Text>
          <Text style={styles.actionButtonText}>साझा / Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>📋</Text>
          <Text style={styles.actionButtonText}>फीडबैक / Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  professionalHeader: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  complaintInfo: {
    flex: 1,
    marginRight: 15,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  complaintTitleEn: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 6,
  },
  complaintCategory: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  complaintDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 6,
  },
  complaintDescriptionEn: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  currentStatus: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  officerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  officerInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  officerDetails: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  officerNameEn: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  officerDesignation: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  officerDepartment: {
    fontSize: 12,
    color: '#6b7280',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 16,
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 2,
  },
  locationAddressEn: {
    fontSize: 12,
    color: '#6b7280',
  },
  mapButton: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  mapButtonText: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  timeline: {
    marginTop: 10,
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 15,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIcon: {
    fontSize: 16,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepHeader: {
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  stepTitleEn: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  stepDescriptionEn: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTimestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  stepStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stepStatusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  updatesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  updateItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateTimestamp: {
    fontSize: 11,
    color: '#6b7280',
  },
  updateBy: {
    fontSize: 11,
    color: '#9ca3af',
  },
  updateMessage: {
    fontSize: 13,
    color: '#1f2937',
    marginBottom: 4,
  },
  updateMessageEn: {
    fontSize: 12,
    color: '#6b7280',
  },
  resolutionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 80,
    elevation: 2,
  },
  resolutionInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  resolutionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  resolutionDateEn: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtonIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});
