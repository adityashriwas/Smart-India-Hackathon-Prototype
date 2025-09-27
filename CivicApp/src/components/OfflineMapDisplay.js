import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import MapTileService from '../services/MapTileService';

const { width, height } = Dimensions.get('window');

const OfflineMapDisplay = ({ 
  centerLat, 
  centerLng, 
  zoom = 14, 
  style = 'standard',
  onLocationChange,
  showControls = true 
}) => {
  const [mapData, setMapData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentTile, setCurrentTile] = useState('');
  const [mapStyle, setMapStyle] = useState(style);
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const [markerPosition, setMarkerPosition] = useState({ lat: centerLat, lng: centerLng });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (centerLat && centerLng) {
      downloadMapArea();
    }
  }, [centerLat, centerLng, zoomLevel, mapStyle]);

  const downloadMapArea = async () => {
    if (!centerLat || !centerLng) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const mapAreaData = await MapTileService.downloadAreaTiles(
        centerLat,
        centerLng,
        1.5, // 1.5km radius
        zoomLevel,
        mapStyle,
        (progress) => {
          setDownloadProgress(progress.progress || 0);
          setCurrentTile(progress.currentTile || '');
        }
      );

      setMapData(mapAreaData);
      console.log(`Map downloaded: ${mapAreaData.tiles.length} tiles`);
    } catch (error) {
      console.log('Map download error:', error);
      Alert.alert('Download Error', 'Failed to download map tiles');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderMapTiles = () => {
    if (!mapData || !mapData.tiles.length) return null;

    const tileSize = 100; // Display size for each tile
    const tilesPerRow = Math.ceil(width / tileSize);
    
    return (
      <View style={styles.mapGrid}>
        {mapData.tiles.map((tile, index) => (
          <View key={`${tile.x}_${tile.y}`} style={styles.tileContainer}>
            {tile.url && (
              <Image
                source={{ uri: tile.url }}
                style={styles.mapTile}
                resizeMode="cover"
              />
            )}
          </View>
        ))}
        
        {/* Location Marker */}
        <View style={[styles.locationMarker, getMarkerPosition()]}>
          <View style={styles.markerOuter}>
            <View style={styles.markerInner}>
              <Text style={styles.markerIcon}>📍</Text>
            </View>
          </View>
          <View style={styles.markerShadow} />
        </View>
      </View>
    );
  };

  const getMarkerPosition = () => {
    if (!mapData) return { left: '50%', top: '50%' };
    
    // Calculate marker position relative to map bounds
    const { bounds } = mapData;
    const latRatio = (markerPosition.lat - bounds.south) / (bounds.north - bounds.south);
    const lngRatio = (markerPosition.lng - bounds.west) / (bounds.east - bounds.west);
    
    return {
      left: `${lngRatio * 100}%`,
      top: `${(1 - latRatio) * 100}%`,
    };
  };

  const handleMapPress = (event) => {
    if (!mapData) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const mapWidth = width - 40; // Account for padding
    const mapHeight = 300;
    
    // Convert touch coordinates to lat/lng
    const { bounds } = mapData;
    const lngRatio = locationX / mapWidth;
    const latRatio = 1 - (locationY / mapHeight);
    
    const newLat = bounds.south + (latRatio * (bounds.north - bounds.south));
    const newLng = bounds.west + (lngRatio * (bounds.east - bounds.west));
    
    setMarkerPosition({ lat: newLat, lng: newLng });
    
    if (onLocationChange) {
      onLocationChange({ lat: newLat, lng: newLng });
    }
  };

  const changeMapStyle = () => {
    const styles = ['standard', 'satellite', 'terrain'];
    const currentIndex = styles.indexOf(mapStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setMapStyle(nextStyle);
  };

  const zoomIn = () => {
    if (zoomLevel < 18) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 8) {
      setZoomLevel(zoomLevel - 1);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {/* Map Header */}
      <View style={styles.mapHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.mapTitle}>🗺️ Offline Map</Text>
          <Text style={styles.mapSubtitle}>
            Zoom: {zoomLevel} | Style: {mapStyle}
          </Text>
        </View>
        
        {showControls && (
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.controlButton} onPress={changeMapStyle}>
              <Text style={styles.controlButtonText}>🎨</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Download Progress */}
      {isDownloading && (
        <View style={styles.downloadProgress}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${downloadProgress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Downloading tiles... {downloadProgress.toFixed(0)}%
          </Text>
          {currentTile && (
            <Text style={styles.currentTileText}>
              Current: {currentTile}
            </Text>
          )}
        </View>
      )}

      {/* Map Display */}
      <TouchableOpacity 
        style={styles.mapContainer}
        onPress={handleMapPress}
        activeOpacity={0.9}
      >
        {mapData ? (
          renderMapTiles()
        ) : (
          <View style={styles.loadingMap}>
            <Text style={styles.loadingIcon}>🗺️</Text>
            <Text style={styles.loadingText}>
              {isDownloading ? 'Downloading Map...' : 'Preparing Map...'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Map Controls */}
      {showControls && (
        <View style={styles.mapControls}>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Text style={styles.zoomButtonText}>-</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.refreshButton} onPress={downloadMapArea}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          📍 {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
        </Text>
        {mapData && (
          <Text style={styles.tilesInfo}>
            🎯 {mapData.tiles.length} tiles cached
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  headerControls: {
    flexDirection: 'row',
  },
  controlButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  controlButtonText: {
    fontSize: 18,
  },
  downloadProgress: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500',
  },
  currentTileText: {
    fontSize: 10,
    color: '#0c4a6e',
    marginTop: 2,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },
  mapGrid: {
    flex: 1,
    position: 'relative',
  },
  tileContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  mapTile: {
    width: '100%',
    height: '100%',
  },
  locationMarker: {
    position: 'absolute',
    zIndex: 10,
    marginLeft: -12,
    marginTop: -24,
  },
  markerOuter: {
    width: 24,
    height: 24,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  markerInner: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerIcon: {
    fontSize: 12,
    color: '#ffffff',
  },
  markerShadow: {
    position: 'absolute',
    top: 22,
    left: 8,
    width: 8,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoomControls: {
    flexDirection: 'row',
  },
  zoomButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  zoomButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 18,
  },
  locationInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  tilesInfo: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default OfflineMapDisplay;
