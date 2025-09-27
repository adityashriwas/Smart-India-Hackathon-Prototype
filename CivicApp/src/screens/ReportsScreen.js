import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ReportsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Day wise');
  const [activeTab, setActiveTab] = useState('Reports');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.timing(chartAnim, {
        toValue: 1,
        duration: 1200,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Mock data for the chart
  const chartData = [
    { x: 0, y: 20 },
    { x: 50, y: 80 },
    { x: 100, y: 120 },
    { x: 150, y: 60 },
    { x: 200, y: 140 },
    { x: 250, y: 100 },
    { x: 300, y: 160 },
  ];

  const generatePath = (data, color = '#e91e63') => {
    const pathData = data.map((point, index) => {
      const x = (point.x / 300) * (width - 80);
      const y = 150 - (point.y / 200) * 120;
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');
    
    return pathData;
  };

  const renderChart = () => {
    return (
      <Animated.View 
        style={[
          styles.chartContainer,
          {
            opacity: chartAnim,
            transform: [{ 
              translateY: chartAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        <Svg width={width - 40} height={200} style={styles.chart}>
          <Defs>
            <SvgLinearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#e91e63" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#9c27b0" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#673ab7" stopOpacity="0.2" />
            </SvgLinearGradient>
            <SvgLinearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#2196f3" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#3f51b5" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#9c27b0" stopOpacity="0.2" />
            </SvgLinearGradient>
          </Defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Path
              key={i}
              d={`M20,${30 + i * 25} L${width - 60},${30 + i * 25}`}
              stroke="#f0f0f0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}
          
          {/* Main gradient area - Pink */}
          <Path
            d={`${generatePath(chartData)} L${width - 60},170 L20,170 Z`}
            fill="url(#pinkGradient)"
          />
          
          {/* Secondary gradient area - Blue */}
          <Path
            d={`M20,80 Q80,40 140,70 T${width - 60},90 L${width - 60},170 L20,170 Z`}
            fill="url(#blueGradient)"
          />
          
          {/* Chart lines */}
          <Path
            d={generatePath(chartData)}
            stroke="#e91e63"
            strokeWidth="3"
            fill="none"
          />
          
          <Path
            d={`M20,80 Q80,40 140,70 T${width - 60},90`}
            stroke="#2196f3"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Data points */}
          {chartData.map((point, index) => (
            <Circle
              key={index}
              cx={(point.x / 300) * (width - 80) + 20}
              cy={150 - (point.y / 200) * 120 + 30}
              r="4"
              fill="#e91e63"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
        </Svg>
        
        {/* Chart labels */}
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>04</Text>
          <Text style={styles.chartLabel}>05</Text>
          <Text style={styles.chartLabel}>06</Text>
          <Text style={[styles.chartLabel, styles.activeLabel]}>07</Text>
          <Text style={styles.chartLabel}>08</Text>
          <Text style={styles.chartLabel}>09</Text>
        </View>
        
        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#e91e63' }]} />
            <Text style={styles.statLabel}>Dashboard</Text>
            <Text style={styles.statValue}>34%</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#2196f3' }]} />
            <Text style={styles.statLabel}>Pricing App Concept</Text>
            <Text style={styles.statValue}>66%</Text>
          </View>
        </View>
        
        {/* Average indicator */}
        <View style={styles.avgContainer}>
          <Text style={styles.avgLabel}>Avg</Text>
          <Text style={styles.avgValue}>140%</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Enhanced Professional Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={['#ff6b6b', '#feca57']}
              style={styles.backButtonGradient}
            >
              <Text style={styles.backIcon}>←</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Reports</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton}>
              <Text style={styles.likeButtonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Section */}
        <Animated.View 
          style={[
            styles.filterSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Day wise</Text>
            <Text style={styles.filterIcon}>▼</Text>
          </View>
          
          <View style={styles.addItemsContainer}>
            <TouchableOpacity style={styles.addItemsButton}>
              <Text style={styles.addItemsText}>Add Items</Text>
              <View style={styles.addItemsBadge}>
                <Text style={styles.addItemsBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Chart Section */}
        {renderChart()}

        {/* Today Section */}
        <Animated.View 
          style={[
            styles.todaySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.todayTitle}>Today</Text>
          
          <View style={styles.todayItems}>
            <View style={styles.todayItem}>
              <View style={styles.todayItemIcon}>
                <Text style={styles.todayItemEmoji}>📊</Text>
              </View>
              <View style={styles.todayItemContent}>
                <Text style={styles.todayItemTitle}>Dashboard</Text>
                <Text style={styles.todayItemDate}>11/05/22 10.00PM</Text>
              </View>
              <View style={styles.todayItemStats}>
                <Text style={styles.todayItemValue}>2.5k</Text>
                <Text style={styles.todayItemLabel}>View</Text>
              </View>
            </View>
            
            <View style={styles.todayItem}>
              <View style={styles.todayItemIcon}>
                <Text style={styles.todayItemEmoji}>💰</Text>
              </View>
              <View style={styles.todayItemContent}>
                <Text style={styles.todayItemTitle}>Pricing App</Text>
                <Text style={styles.todayItemDate}>11/05/22 10.00PM</Text>
              </View>
              <View style={styles.todayItemStats}>
                <Text style={styles.todayItemValue}>6k</Text>
                <Text style={styles.todayItemLabel}>View</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <Animated.View 
        style={[
          styles.bottomNav,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Home')}
        >
          <Text style={[styles.navIcon, activeTab === 'Home' && styles.activeNavIcon]}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'Home' && styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Reports')}
        >
          <Text style={[styles.navIcon, activeTab === 'Reports' && styles.activeNavIcon]}>📊</Text>
          <Text style={[styles.navLabel, activeTab === 'Reports' && styles.activeNavLabel]}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('Profile')}
        >
          <Text style={[styles.navIcon, activeTab === 'Profile' && styles.activeNavIcon]}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'Profile' && styles.activeNavLabel]}>Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 25,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonGradient: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 2,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  likeButton: {
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  likeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  likeButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
  },
  filterIcon: {
    fontSize: 12,
    color: '#666666',
  },
  addItemsContainer: {
    position: 'relative',
  },
  addItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addItemsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  addItemsBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemsBadgeText: {
    color: '#e91e63',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chart: {
    marginBottom: 20,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartLabel: {
    fontSize: 12,
    color: '#999999',
  },
  activeLabel: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  avgContainer: {
    position: 'absolute',
    right: 30,
    top: 40,
    alignItems: 'center',
  },
  avgLabel: {
    fontSize: 12,
    color: '#666666',
  },
  avgValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  todaySection: {
    marginBottom: 100,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  todayItems: {
    gap: 16,
  },
  todayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todayItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  todayItemEmoji: {
    fontSize: 18,
  },
  todayItemContent: {
    flex: 1,
  },
  todayItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  todayItemDate: {
    fontSize: 12,
    color: '#999999',
  },
  todayItemStats: {
    alignItems: 'flex-end',
  },
  todayItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  todayItemLabel: {
    fontSize: 10,
    color: '#999999',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#e91e63',
    fontWeight: '600',
  },
});
