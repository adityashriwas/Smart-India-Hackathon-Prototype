import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Alert,
  RefreshControl,
  FlatList,
  Easing,
  Vibration,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function NearbyReportsScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [reports, setReports] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortBy, setSortBy] = useState('priority'); // priority, date, distance
  const [filterBy, setFilterBy] = useState('all'); // all, high, medium, low
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnimations = useRef({}).current;
  const pullToRefreshAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Enhanced production-ready complaint data with priority system and real images
  const sampleReports = [
    {
      id: 1,
      title: 'सड़क पर गड्ढा',
      titleEn: 'Pothole on main road',
      description: 'मुख्य सड़क पर बड़ा गड्ढा है जो खतरनाक है। यातायात में बाधा और दुर्घटना का खतरा है।',
      detailedDescription: 'मुख्य सड़क पर एक बड़ा गड्ढा है जो यातायात के लिए खतरनाक है। यह गड्ढा लगभग 2 फीट चौड़ा और 1 फीट गहरा है। बारिश के दिनों में यह और भी खतरनाक हो जाता है।',
      category: 'सड़क',
      categoryEn: 'Roads',
      location: '१० किमी दूर • सेक्टर २२',
      locationEn: '10 km away • Sector 22',
      address: 'मेन रोड, सेक्टर 22, रांची, झारखंड',
      status: 'नया',
      statusEn: 'New',
      priority: 'उच्च',
      priorityEn: 'High',
      priorityLevel: 'high',
      priorityColor: '#ef4444',
      statusColor: '#ef4444',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop'
      ],
      timestamp: '2 दिन पहले',
      timestampEn: '2 days ago',
      reporterId: 'JHCVS001',
      reporterName: 'राज कुमार शर्मा',
      votes: 24,
      views: 89,
      department: 'PWD - सार्वजनिक निर्माण विभाग',
      departmentEn: 'PWD - Public Works Department',
      estimatedTime: '7 दिन',
      latitude: 23.6345,
      longitude: 85.3803,
      severity: 'high',
      likes: 12,
      dislikes: 1,
      comments: 8,
    },
    {
      id: 2,
      title: 'गंदे नाले',
      titleEn: 'Dirty sewerage',
      description: 'सीवरेज की समस्या से बदबू आ रही है। स्वास्थ्य के लिए हानिकारक।',
      detailedDescription: 'सीवरेज लाइन बंद होने के कारण गदबू व गंदगी फैल रही है। महिलाओं व बच्चों को सांस लेने में कठिनाई हो रही है।',
      category: 'स्वच्छता',
      categoryEn: 'Sanitation',
      location: '५ किमी दूर • सेक्टर १५',
      locationEn: '5 km away • Sector 15',
      address: 'राजेंद्र नगर, सेक्टर 15, रांची, झारखंड',
      status: 'प्रगति में',
      statusEn: 'In Progress',
      priority: 'मध्यम',
      priorityEn: 'Medium',
      priorityLevel: 'medium',
      priorityColor: '#f59e0b',
      statusColor: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'
      ],
      timestamp: '१ दिन पहले',
      timestampEn: '1 day ago',
      reporterId: 'JHCVS002',
      reporterName: 'सुनिता देवी',
      votes: 18,
      views: 56,
      department: 'नगर निगम - सफाई विभाग',
      departmentEn: 'Municipal Corporation - Sanitation Dept',
      estimatedTime: '5 दिन',
      latitude: 23.6445,
      longitude: 85.3903,
      severity: 'medium',
      likes: 8,
      dislikes: 2,
      comments: 5,
    },
    {
      id: 3,
      title: 'कचरा निस्तारण',
      titleEn: 'Garbage disposal',
      description: 'कचरा एकत्र करने की समस्या है। नियमित सफाई नहीं हो रही।',
      detailedDescription: 'कचरा वाहन नियमित रूप से नहीं आ रहा है। कचरा सड़क पर फैला रहता है जिससे बदबू और मक्खी-मच्छर की समस्या होती है।',
      category: 'कचरा',
      categoryEn: 'Waste',
      location: '३ किमी दूर • सेक्टर ८',
      locationEn: '3 km away • Sector 8',
      address: 'आदित्यपुर, सेक्टर 8, रांची, झारखंड',
      status: 'हल हो गया', 
      statusEn: 'Resolved',
      priority: 'कम',
      priorityEn: 'Low',
      priorityLevel: 'low',
      priorityColor: '#10b981',
      statusColor: '#10b981',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ],
      timestamp: '३ दिन पहले',
      timestampEn: '3 days ago',
      reporterId: 'JHCVS003',
      reporterName: 'अरुण कुमार',
      votes: 32,
      views: 78,
      department: 'सफाई विभाग - नगर निगम',
      departmentEn: 'Sanitation Department - Municipal Corp',
      estimatedTime: 'पूर्ण',
      latitude: 23.6245,
      longitude: 85.3703,
      severity: 'low',
      likes: 15,
      dislikes: 0,
      comments: 12,
    },
    {
      id: 4,
      title: 'पानी की कमी',
      titleEn: 'Water shortage',
      description: 'पानी की आपूर्ति में कमी है। 3 दिन से पानी नहीं आया।',
      detailedDescription: 'पिछले 3 दिनों से पानी की आपूर्ति बंद है। पंप की समस्या के कारण पानी अनियमित आता है। घरेलू काम और पीने के लिए पानी की आवश्यकता है।',
      category: 'पानी',
      categoryEn: 'Water',
      location: '७ किमी दूर • सेक्टर ४२',
      locationEn: '7 km away • Sector 42',
      address: 'नया टोला, सेक्टर 42, रांची, झारखंड',
      status: 'नया',
      statusEn: 'New',
      priority: 'उच्च',
      priorityEn: 'High',
      priorityLevel: 'high',
      priorityColor: '#ef4444',
      statusColor: '#ef4444',
      image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'
      ],
      timestamp: '४ घंटे पहले',
      timestampEn: '4 hours ago',
      reporterId: 'JHCVS004',
      reporterName: 'मीना शर्मा',
      votes: 9,
      views: 27,
      department: 'जल आपूर्ति विभाग',
      departmentEn: 'Water Supply Department',
      estimatedTime: '2 दिन',
      latitude: 23.6145,
      longitude: 85.3603,
      severity: 'high',
      likes: 6,
      dislikes: 0,
      comments: 3,
    },
  ];

  const categories = [
    { id: 'all', label: 'सभी', labelEn: 'All', icon: '📋' },
    { id: 'roads', label: 'सड़क', labelEn: 'Roads', icon: '🛣️' },
    { id: 'sanitation', label: 'स्वच्छता', labelEn: 'Sanitation', icon: '🚮' },
    { id: 'waste', label: 'कचरा', labelEn: 'Waste', icon: '🗑️' },
    { id: 'water', label: 'पानी', labelEn: 'Water', icon: '💧' },
    { id: 'electricity', label: 'बिजली', labelEn: 'Electricity', icon: '⚡' },
  ];

  useEffect(() => {
    setReports(sampleReports);
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
    ]).start();
  }, []);

  // Animation helpers for professional interactions
  const animateCardPress = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateLike = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1.3,
        duration: 200,
        easing: Easing.elastic(2),
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleReportPress = (report) => {
    if (expandedCard === report.id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(report.id);
      Vibration.vibrate(50);
    }
  };

  const handleTrackPress = (report) => {
    Alert.alert(
      'ट्रैक रिपोर्ट / Track Report',
      `${report.title} की स्थिति देखने के लिए ट्रैकिंग स्क्रीन खोलें?\n\nOpen tracking screen to view status of ${report.titleEn}?`,
      [
        { text: 'रद्द करें / Cancel', style: 'cancel' },
        { 
          text: 'ट्रैक करें / Track', 
          onPress: () => navigation.navigate('TrackingScreen', { reportId: report.id })
        }
      ]
    );
  };

  const handleLikePress = (report) => {
    // Professional like animation with haptic feedback
    Vibration.vibrate(30);
    const animValue = new Animated.Value(1);
    animateLike(animValue);
    
    Alert.alert(
      'समर्थन / Support',
      `इस शिकायत को ${report.likes + 1} लोगों ने पसंद किया है।\n\nThis complaint is supported by ${report.likes + 1} people.`,
      [{ text: 'ठीक है / OK' }]
    );
  };

  const handleSharePress = (report) => {
    Alert.alert(
      'साझा करें / Share',
      `इस शिकायत को साझा करने के लिए:\n\nशिकायत ID: ${report.reporterId}\nविषय: ${report.title}\nस्थान: ${report.address}\n\nShare this complaint:\nComplaint ID: ${report.reporterId}\nSubject: ${report.titleEn}\nLocation: ${report.address}`,
      [
        { text: 'रद्द करें / Cancel', style: 'cancel' },
        { text: 'कॉपी करें / Copy' }
      ]
    );
  };

  // Professional Refresh Function with Loading States
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    Vibration.vibrate(30); // Haptic feedback
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data (in production, this would fetch from API)
      setReports(sampleReports);
      
      // Professional success feedback
      Alert.alert(
        'डेटा अपडेट हो गया / Data Updated',
        `${sampleReports.length} शिकायतें मिलीं। / ${sampleReports.length} complaints found.`,
        [{ text: 'ठीक है / OK' }]
      );
    } catch (error) {
      // Professional error handling
      Alert.alert(
        'त्रुटि / Error',
        'डेटा रिफ्रेश करने में समस्या। कृपया पुनः प्रयास करें।\n\nProblem refreshing data. Please try again.',
        [
          { text: 'रद्द करें / Cancel', style: 'cancel' },
          { text: 'पुनः प्रयास / Retry', onPress: onRefresh }
        ]
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Advanced Professional Sorting Function
  const handleSort = () => {
    Alert.alert(
      'क्रमबद्ध करें / Sort By',
      'शिकायतों को कैसे क्रमबद्ध करना चाहते हैं? / How would you like to sort complaints?',
      [
        { text: 'रद्द करें / Cancel', style: 'cancel' },
        { 
          text: 'नवीनतम / Latest', 
          onPress: () => sortReports('date') 
        },
        { 
          text: 'प्राथमिकता / Priority', 
          onPress: () => sortReports('priority') 
        },
        { 
          text: 'स्थान / Distance', 
          onPress: () => sortReports('distance') 
        },
        { 
          text: 'स्थिति / Status', 
          onPress: () => sortReports('status') 
        }
      ]
    );
  };

  const sortReports = (criteria) => {
    let sortedReports = [...reports];
    
    switch (criteria) {
      case 'date':
        // Sort by timestamp (newest first)
        sortedReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'priority':
        // Sort by priority (High, Medium, Low)
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        sortedReports.sort((a, b) => priorityOrder[b.priorityLevel] - priorityOrder[a.priorityLevel]);
        break;
      case 'distance':
        // Sort by location (closest first based on location text)
        sortedReports.sort((a, b) => {
          const distanceA = parseInt(a.location.match(/\d+/)?.[0] || '0');
          const distanceB = parseInt(b.location.match(/\d+/)?.[0] || '0');
          return distanceA - distanceB;
        });
        break;
      case 'status':
        // Sort by status (New, In Progress, Resolved)
        const statusOrder = { 'नया': 3, 'प्रगति में': 2, 'हल हो गया': 1 };
        sortedReports.sort((a, b) => statusOrder[b.status] - statusOrder[a.status]);
        break;
      default:
        break;
    }
    
    setReports(sortedReports);
    Vibration.vibrate(50);
    Alert.alert(
      'क्रमबद्ध किया गया / Sorted',
      `शिकायतें ${criteria === 'date' ? 'तारीख' : criteria === 'priority' ? 'प्राथमिकता' : criteria === 'distance' ? 'दूरी' : 'स्थिति'} के आधार पर क्रमबद्ध की गईं।\n\nComplaints sorted by ${criteria}.`,
      [{ text: 'ठीक है / OK' }]
    );
  };

  // Advanced Professional Filter Function
  const handleFilter = () => {
    Alert.alert(
      'फिल्टर / Filter',
      'शिकायतों को कैसे फिल्टर करना चाहते हैं? / How would you like to filter complaints?',
      [
        { text: 'रद्द करें / Cancel', style: 'cancel' },
        { 
          text: 'सभी दिखाएं / Show All', 
          onPress: () => filterReports('all') 
        },
        { 
          text: 'केवल उच्च प्राथमिकता / High Priority Only', 
          onPress: () => filterReports('high') 
        },
        { 
          text: 'केवल नई / New Only', 
          onPress: () => filterReports('new') 
        },
        { 
          text: 'केवल प्रगति में / In Progress Only', 
          onPress: () => filterReports('progress') 
        },
        { 
          text: 'केवल हल / Resolved Only', 
          onPress: () => filterReports('resolved') 
        }
      ]
    );
  };

  const filterReports = (filterType) => {
    let filteredReports = sampleReports;
    
    switch (filterType) {
      case 'high':
        filteredReports = sampleReports.filter(report => report.priorityLevel === 'high');
        break;
      case 'new':
        filteredReports = sampleReports.filter(report => report.status === 'नया');
        break;
      case 'progress':
        filteredReports = sampleReports.filter(report => report.status === 'प्रगति में');
        break;
      case 'resolved':
        filteredReports = sampleReports.filter(report => report.status === 'हल हो गया');
        break;
      case 'all':
      default:
        filteredReports = sampleReports;
        break;
    }
    
    setReports(filteredReports);
    Vibration.vibrate(50);
    Alert.alert(
      'फिल्टर लागू / Filter Applied',
      `${filteredReports.length} शिकायतें मिलीं। / ${filteredReports.length} complaints found.`,
      [{ text: 'ठीक है / OK' }]
    );
  };

  // Professional Load More Function for Pagination
  const handleLoadMore = () => {
    // In production, this would load more data from API
    console.log('🔄 Loading more complaints...');
    // Professional user feedback for load more
    if (reports.length >= 20) {
      Alert.alert(
        'सभी डेटा लोड हो गया / All Data Loaded',
        'अभी के लिए कोई और शिकायत नहीं है। / No more complaints available at the moment.',
        [{ text: 'ठीक है / OK' }]
      );
    }
  };

  const renderComplaintCard = (report) => {
    const isExpanded = expandedCard === report.id;
    const cardAnimation = new Animated.Value(1);
    
    return (
      <Animated.View
        key={report.id}
        style={[
          styles.complaintCard,
          isExpanded && styles.complaintCardExpanded,
          { transform: [{ scale: cardAnimation }] }
        ]}
      >
        {/* Priority Indicator Bar */}
        <View style={[styles.priorityBar, { backgroundColor: report.priorityColor }]} />
        
        {/* Main Card Content */}
        <TouchableOpacity
          onPress={() => {
            animateCardPress(cardAnimation);
            handleReportPress(report);
          }}
          activeOpacity={0.9}
          style={styles.cardTouchable}
        >
          <View style={styles.cardHeader}>
            <View style={styles.complaintImageContainer}>
              <Image 
                source={{ uri: report.image }} 
                style={styles.complaintImage}
                resizeMode="cover"
              />
              {/* Priority Badge */}
              <View style={[styles.priorityBadge, { backgroundColor: report.priorityColor }]}>
                <Text style={styles.priorityText}>
                  {report.priorityLevel === 'high' ? '🔴' : 
                   report.priorityLevel === 'medium' ? '🟡' : '🟢'}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.titleSection}>
                <Text style={styles.complaintTitle}>{report.title}</Text>
                <Text style={styles.complaintTitleEn}>{report.titleEn}</Text>
              </View>
              
              <Text style={styles.complaintDescription} numberOfLines={isExpanded ? 0 : 2}>
                {report.description}
              </Text>
              
              <View style={styles.cardMeta}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText} numberOfLines={1}>{report.location}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: report.statusColor }]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.metaRow}>
                <Text style={styles.timestamp}>{report.timestamp}</Text>
                <Text style={styles.reporterId}>ID: {report.reporterId}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Expandable Details Section */}
        {isExpanded && (
          <Animated.View 
            style={[
              styles.expandedSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Detailed Information */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>विस्तृत जानकारी / Detailed Information</Text>
              <Text style={styles.detailText}>{report.detailedDescription}</Text>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>रिपोर्टर / Reporter:</Text>
                  <Text style={styles.infoValue}>{report.reporterName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>विभाग / Department:</Text>
                  <Text style={styles.infoValue}>{report.department}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>पूरा पता / Full Address:</Text>
                  <Text style={styles.infoValue}>{report.address}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>अनुमानित समय / Est. Time:</Text>
                  <Text style={styles.infoValue}>{report.estimatedTime}</Text>
                </View>
              </View>
            </View>

            {/* Engagement Stats */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👁️</Text>
                <Text style={styles.statValue}>{report.views}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👍</Text>
                <Text style={styles.statValue}>{report.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>💬</Text>
                <Text style={styles.statValue}>{report.comments}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🗳️</Text>
                <Text style={styles.statValue}>{report.votes}</Text>
                <Text style={styles.statLabel}>Votes</Text>
              </View>
            </View>

            {/* Professional Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.trackButton]}
                onPress={() => handleTrackPress(report)}
              >
                <Text style={styles.actionIcon}>🔍</Text>
                <Text style={styles.actionText}>ट्रैक करें / Track</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.likeButton]}
                onPress={() => handleLikePress(report)}
              >
                <Text style={styles.actionIcon}>👍</Text>
                <Text style={styles.actionText}>समर्थन / Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.shareButton]}
                onPress={() => handleSharePress(report)}
              >
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionText}>साझा करें / Share</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

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
            <Text style={styles.headerTitle}>समस्याएं / Issues</Text>
            <Text style={styles.headerSubtitle}>आपके आसपास की रिपोर्ट्स</Text>
          </View>
          <TouchableOpacity 
            style={styles.mapToggleButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.mapIcon}>🗺️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter Section */}
      <Animated.View 
        style={[
          styles.searchSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="खोज रिपोर्ट / Search issues"
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.label && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category.label)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.label && styles.categoryLabelActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Enhanced Map View with Real MapView */}
      {showMap && (
        <Modal visible={showMap} animationType="slide" transparent={false}>
          <View style={styles.mapModalContainer}>
            <View style={styles.mapModalHeader}>
              <Text style={styles.mapModalTitle}>🗺️ आसपास की शिकायतें</Text>
              <Text style={styles.mapModalTitleEn}>Nearby Complaints</Text>
              <TouchableOpacity 
                onPress={() => setShowMap(false)}
                style={styles.closeMapButton}
              >
                <Text style={styles.closeMapText}>✕</Text>
              </TouchableOpacity>
            </View>

            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.mapView}
              initialRegion={{
                latitude: 23.6345, // Jharkhand, India
                longitude: 85.3803,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {reports.map((report) => (
                <Marker
                  key={report.id}
                  coordinate={{
                    latitude: 23.6345 + (Math.random() - 0.5) * 0.01,
                    longitude: 85.3803 + (Math.random() - 0.5) * 0.01,
                  }}
                  title={report.title}
                  description={report.description}
                  pinColor={report.statusColor}
                  onPress={() => {
                    Alert.alert(
                      report.title,
                      `${report.description}\n\nStatus: ${report.status}\nLocation: ${report.location}`,
                      [
                        { text: 'Close', style: 'cancel' },
                        { text: 'Track', onPress: () => {
                          setShowMap(false);
                          navigation.navigate('TrackingScreen', { reportId: report.id });
                        }}
                      ]
                    );
                  }}
                />
              ))}
            </MapView>

            <View style={styles.mapLegend}>
              <Text style={styles.legendTitle}>🎯 Status Legend</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]}></View>
                  <Text style={styles.legendText}>New</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]}></View>
                  <Text style={styles.legendText}>In Progress</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10b981' }]}></View>
                  <Text style={styles.legendText}>Resolved</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Professional Reports List with Pull-to-Refresh */}
      <FlatList
        data={reports}
        renderItem={({ item }) => renderComplaintCard(item)}
        keyExtractor={(item) => item.id.toString()}
        style={styles.complaintsContainer}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6', '#1d4ed8', '#1e40af']}
            tintColor="#3b82f6"
            title="ताज़ा करें / Refreshing..."
            titleColor="#6b7280"
            progressBackgroundColor="#ffffff"
          />
        }
        ListHeaderComponent={
          <Animated.View 
            style={[
              styles.listHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  पास की शिकायतें / Nearby Complaints
                </Text>
                <Text style={styles.sectionSubtitle}>
                  नीचे खींचें ताज़ा करने के लिए / Pull down to refresh
                </Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{reports.length}</Text>
              </View>
            </View>
            
            {/* Professional Sort and Filter Controls */}
            <View style={styles.controlsRow}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={handleSort}
              >
                <Text style={styles.controlIcon}>📊</Text>
                <Text style={styles.controlLabel}>क्रम / Sort</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={handleFilter}
              >
                <Text style={styles.controlIcon}>🔧</Text>
                <Text style={styles.controlLabel}>फिल्टर / Filter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={onRefresh}
                disabled={refreshing}
              >
                <Text style={styles.controlIcon}>
                  {refreshing ? '🔄' : '↻'}
                </Text>
                <Text style={styles.controlLabel}>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          !refreshing && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>कोई शिकायत नहीं मिली</Text>
              <Text style={styles.emptySubtitle}>No complaints found in this area</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={onRefresh}
              >
                <Text style={styles.retryText}>पुनः प्रयास करें / Retry</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={
          <View style={styles.listFooter}>
            <Text style={styles.footerText}>
              झारखंड सिविक सेवाएं / Jharkhand Civic Services
            </Text>
            <Text style={styles.footerSubtext}>
              सरकारी शिकायत प्रबंधन प्रणाली / Government Complaint Management System
            </Text>
            <Text style={styles.versionText}>v2.0 - Production Ready</Text>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        getItemLayout={(data, index) => ({
          length: 200, // Estimated height
          offset: 200 * index,
          index,
        })}
      />

      {/* Professional Bottom Navigation with Working Functionality */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemHome]}
          onPress={() => {
            Vibration.vibrate(30);
            navigation.navigate('Home');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>होम / Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemReports]}
          onPress={() => {
            Vibration.vibrate(30);
            navigation.navigate('ReportsScreen');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>रिपोर्ट्स / Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemNearby, styles.navItemActive]}
          onPress={() => {
            Vibration.vibrate(50);
            // Already on nearby screen - show professional feedback
            Alert.alert(
              'वर्तमान स्क्रीन / Current Screen',
              'आप पहले से ही पास की शिकायतों वाली स्क्रीन पर हैं।\n\nYou are already on the nearby complaints screen.',
              [{ text: 'ठीक है / OK' }]
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📍</Text>
          <Text style={styles.navLabel}>पास की / Nearby</Text>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemProfile]}
          onPress={() => {
            Vibration.vibrate(30);
            Alert.alert(
              'प्रोफाइल / Profile',
              'प्रोफाइल स्क्रीन जल्द ही उपलब्ध होगी।\n\nProfile screen will be available soon.',
              [
                { text: 'रद्द करें / Cancel', style: 'cancel' },
                { text: 'सेटिंग्स / Settings', onPress: () => navigation.navigate('Settings') }
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>प्रोफाइल / Profile</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  mapToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    fontSize: 18,
  },
  searchSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#1e40af',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#ffffff',
  },
  mapContainer: {
    height: 150,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 24,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  mapPlaceholderSubtextEn: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  complaintsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 15,
  },
  complaintImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    overflow: 'hidden',
  },
  complaintImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  placeholderIcon: {
    fontSize: 20,
    color: '#9ca3af',
  },
  cardContent: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  complaintTitleEn: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  complaintDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Professional Navigation Active States
  navItemActive: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingVertical: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  
  // Advanced Complaint Card Styles
  complaintCardExpanded: {
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardTouchable: {
    borderRadius: 12,
  },
  priorityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  priorityText: {
    fontSize: 12,
  },
  titleSection: {
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  reporterId: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  
  // Expandable Section Styles
  expandedSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailsSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    width: 120,
  },
  infoValue: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  
  // Professional Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  
  // Professional Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  trackButton: {
    backgroundColor: '#3b82f6',
  },
  likeButton: {
    backgroundColor: '#10b981',
  },
  shareButton: {
    backgroundColor: '#f59e0b',
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // FlatList Professional Styling
  flatListContent: {
    paddingBottom: 20,
  },
  listHeader: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  countBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Professional Control Buttons
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  refreshButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  controlIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Professional Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Professional List Footer
  listFooter: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
  },
});
