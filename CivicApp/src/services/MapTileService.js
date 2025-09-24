import RNFS from 'react-native-fs';

class MapTileService {
  constructor() {
    this.tileCache = new Map();
    this.downloadingTiles = new Set();
    this.cacheDir = `${RNFS.DocumentDirectoryPath}/mapTiles`;
    this.initializeCache();
  }

  async initializeCache() {
    try {
      const exists = await RNFS.exists(this.cacheDir);
      if (!exists) {
        await RNFS.mkdir(this.cacheDir);
      }
    } catch (error) {
      console.log('Cache initialization error:', error);
    }
  }

  // Convert lat/lng to tile coordinates
  latLngToTileCoords(lat, lng, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lng + 180) / 360) * n);
    const y = Math.floor(((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2) * n);
    return { x, y, zoom };
  }

  // Convert tile coordinates back to lat/lng bounds
  tileCoordsToLatLng(x, y, zoom) {
    const n = Math.pow(2, zoom);
    const lng_deg = (x / n) * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat_deg = lat_rad * 180.0 / Math.PI;
    return { lat: lat_deg, lng: lng_deg };
  }

  // Generate tile URL for OpenStreetMap
  getTileUrl(x, y, zoom, style = 'standard') {
    const styles = {
      standard: 'https://tile.openstreetmap.org',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
      terrain: 'https://stamen-tiles.a.ssl.fastly.net/terrain'
    };
    
    const baseUrl = styles[style] || styles.standard;
    
    if (style === 'satellite') {
      return `${baseUrl}/${zoom}/${y}/${x}`;
    } else {
      return `${baseUrl}/${zoom}/${x}/${y}.png`;
    }
  }

  // Download a single tile
  async downloadTile(x, y, zoom, style = 'standard', onProgress = null) {
    const tileKey = `${x}_${y}_${zoom}_${style}`;
    const fileName = `${tileKey}.png`;
    const filePath = `${this.cacheDir}/${fileName}`;

    // Check if already downloading
    if (this.downloadingTiles.has(tileKey)) {
      return null;
    }

    // Check if already cached locally
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        return `file://${filePath}`;
      }
    } catch (error) {
      console.log('Cache check error:', error);
    }

    // Download tile
    try {
      this.downloadingTiles.add(tileKey);
      const url = this.getTileUrl(x, y, zoom, style);
      
      if (onProgress) {
        onProgress({ tileKey, status: 'downloading', progress: 0 });
      }

      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        progress: (res) => {
          if (onProgress) {
            const progress = (res.bytesWritten / res.contentLength) * 100;
            onProgress({ tileKey, status: 'downloading', progress });
          }
        }
      }).promise;

      if (downloadResult.statusCode === 200) {
        this.tileCache.set(tileKey, `file://${filePath}`);
        if (onProgress) {
          onProgress({ tileKey, status: 'completed', progress: 100 });
        }
        return `file://${filePath}`;
      } else {
        throw new Error(`Failed to download tile: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      console.log(`Tile download error ${tileKey}:`, error);
      if (onProgress) {
        onProgress({ tileKey, status: 'error', error: error.message });
      }
      return null;
    } finally {
      this.downloadingTiles.delete(tileKey);
    }
  }

  // Download tiles for a specific area
  async downloadAreaTiles(centerLat, centerLng, radiusKm = 1, zoom = 14, style = 'standard', onProgress = null) {
    const tiles = [];
    
    // Calculate tile bounds for the area
    const latDelta = radiusKm / 111; // Approximate degrees per km
    const lngDelta = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
    
    const northLat = centerLat + latDelta;
    const southLat = centerLat - latDelta;
    const eastLng = centerLng + lngDelta;
    const westLng = centerLng - lngDelta;
    
    const northWest = this.latLngToTileCoords(northLat, westLng, zoom);
    const southEast = this.latLngToTileCoords(southLat, eastLng, zoom);
    
    const totalTiles = (southEast.x - northWest.x + 1) * (southEast.y - northWest.y + 1);
    let downloadedTiles = 0;
    
    console.log(`Downloading ${totalTiles} tiles for area around ${centerLat}, ${centerLng}`);
    
    const downloadPromises = [];
    
    for (let x = northWest.x; x <= southEast.x; x++) {
      for (let y = northWest.y; y <= southEast.y; y++) {
        const tilePromise = this.downloadTile(x, y, zoom, style, (progress) => {
          if (progress.status === 'completed') {
            downloadedTiles++;
            if (onProgress) {
              onProgress({
                totalTiles,
                downloadedTiles,
                progress: (downloadedTiles / totalTiles) * 100,
                currentTile: progress.tileKey
              });
            }
          }
        });
        
        downloadPromises.push(tilePromise.then(url => ({
          x, y, zoom, url, 
          bounds: this.tileCoordsToLatLng(x, y, zoom)
        })));
      }
    }
    
    const results = await Promise.allSettled(downloadPromises);
    const successfulTiles = results
      .filter(result => result.status === 'fulfilled' && result.value.url)
      .map(result => result.value);
    
    console.log(`Successfully downloaded ${successfulTiles.length}/${totalTiles} tiles`);
    
    return {
      tiles: successfulTiles,
      centerLat,
      centerLng,
      zoom,
      style,
      bounds: {
        north: northLat,
        south: southLat,
        east: eastLng,
        west: westLng
      }
    };
  }

  // Get cached tile
  getCachedTile(x, y, zoom, style = 'standard') {
    const tileKey = `${x}_${y}_${zoom}_${style}`;
    return this.tileCache.get(tileKey);
  }

  // Clear cache
  async clearCache() {
    try {
      await RNFS.unlink(this.cacheDir);
      await RNFS.mkdir(this.cacheDir);
      this.tileCache.clear();
      console.log('Map tile cache cleared');
    } catch (error) {
      console.log('Cache clear error:', error);
    }
  }

  // Get cache size
  async getCacheSize() {
    try {
      const files = await RNFS.readDir(this.cacheDir);
      let totalSize = 0;
      for (const file of files) {
        totalSize += file.size;
      }
      return {
        files: files.length,
        sizeBytes: totalSize,
        sizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.log('Cache size error:', error);
      return { files: 0, sizeBytes: 0, sizeMB: '0.00' };
    }
  }
}

// Export singleton instance
export default new MapTileService();
