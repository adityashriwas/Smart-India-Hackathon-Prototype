import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  constructor() {
    this.db = null;
    this.isOnline = true;
    this.initDatabase();
    this.setupNetworkListener();
  }

  initDatabase = async () => {
    try {
      this.db = await SQLite.openDatabase({
        name: 'CivicReports.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  createTables = async () => {
    const createReportsTable = `
      CREATE TABLE IF NOT EXISTS offline_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        image_uri TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced INTEGER DEFAULT 0
      );
    `;

    const createUserDataTable = `
      CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.db.executeSql(createReportsTable);
    await this.db.executeSql(createUserDataTable);
  };

  setupNetworkListener = () => {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected;
      
      if (wasOffline && this.isOnline) {
        // Just came back online, sync pending reports
        this.syncPendingReports();
      }
    });
  };

  // Save report offline
  saveReportOffline = async (reportData) => {
    try {
      const { title, description, category, latitude, longitude, imageUri } = reportData;
      
      const insertQuery = `
        INSERT INTO offline_reports (title, description, category, latitude, longitude, image_uri)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      const result = await this.db.executeSql(insertQuery, [
        title, description, category, latitude, longitude, imageUri
      ]);

      return { success: true, id: result[0].insertId };
    } catch (error) {
      console.error('Save offline report error:', error);
      return { success: false, error: error.message };
    }
  };

  // Get all offline reports
  getOfflineReports = async () => {
    try {
      const query = 'SELECT * FROM offline_reports ORDER BY created_at DESC';
      const results = await this.db.executeSql(query);
      
      const reports = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        reports.push(results[0].rows.item(i));
      }
      
      return reports;
    } catch (error) {
      console.error('Get offline reports error:', error);
      return [];
    }
  };

  // Sync pending reports when online
  syncPendingReports = async () => {
    try {
      const query = 'SELECT * FROM offline_reports WHERE synced = 0';
      const results = await this.db.executeSql(query);
      
      for (let i = 0; i < results[0].rows.length; i++) {
        const report = results[0].rows.item(i);
        
        // Try to sync this report
        const syncResult = await this.syncSingleReport(report);
        
        if (syncResult.success) {
          // Mark as synced
          await this.db.executeSql(
            'UPDATE offline_reports SET synced = 1 WHERE id = ?',
            [report.id]
          );
        }
      }
    } catch (error) {
      console.error('Sync pending reports error:', error);
    }
  };

  syncSingleReport = async (report) => {
    try {
      // This would call your API to submit the report
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: report.title,
          description: report.description,
          category: report.category,
          latitude: report.latitude,
          longitude: report.longitude,
          images: report.image_uri ? [report.image_uri] : []
        })
      });

      return { success: response.ok };
    } catch (error) {
      console.error('Sync single report error:', error);
      return { success: false };
    }
  };

  // Cache user data
  cacheUserData = async (key, value) => {
    try {
      const query = `
        INSERT OR REPLACE INTO user_data (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP);
      `;
      
      await this.db.executeSql(query, [key, JSON.stringify(value)]);
    } catch (error) {
      console.error('Cache user data error:', error);
    }
  };

  // Get cached user data
  getCachedUserData = async (key) => {
    try {
      const query = 'SELECT value FROM user_data WHERE key = ?';
      const results = await this.db.executeSql(query, [key]);
      
      if (results[0].rows.length > 0) {
        return JSON.parse(results[0].rows.item(0).value);
      }
      
      return null;
    } catch (error) {
      console.error('Get cached user data error:', error);
      return null;
    }
  };

  // Check if online
  isConnected = () => {
    return this.isOnline;
  };

  // Get sync status
  getSyncStatus = async () => {
    try {
      const query = 'SELECT COUNT(*) as pending FROM offline_reports WHERE synced = 0';
      const results = await this.db.executeSql(query);
      
      return {
        pendingReports: results[0].rows.item(0).pending,
        isOnline: this.isOnline
      };
    } catch (error) {
      console.error('Get sync status error:', error);
      return { pendingReports: 0, isOnline: this.isOnline };
    }
  };
}

export default new OfflineService();
