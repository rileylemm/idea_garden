import React, { useState, useEffect } from 'react';
import { Settings, Heart, Database, Download, Upload, Activity, Shield, Info } from 'lucide-react';
import { apiService, SystemPreferences, SystemHealth, SystemStatistics, SystemConfiguration, BackupInfo } from '../services/api';
import { cardStyles, buttonStyles } from '../utils/designSystem';

export const SystemPage: React.FC = () => {
  const [preferences, setPreferences] = useState<SystemPreferences | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null);
  const [configuration, setConfiguration] = useState<SystemConfiguration | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [prefs, healthData, stats, config, backupData] = await Promise.all([
        apiService.getSystemPreferences(),
        apiService.getSystemHealth(),
        apiService.getSystemStatistics(),
        apiService.getSystemConfiguration(),
        apiService.getBackups()
      ]);
      setPreferences(prefs);
      setHealth(healthData);
      setStatistics(stats);
      setConfiguration(config);
      setBackups(backupData.backups);
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      const backup = await apiService.createBackup();
      setBackups(prev => [backup, ...prev]);
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<SystemPreferences>) => {
    try {
      const updated = await apiService.updateSystemPreferences(updates);
      setPreferences(updated);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Manage your Idea Garden system configuration</p>
        </div>

        {/* System Health */}
        {health && (
          <div className="mb-8">
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                System Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">Status: {health.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Database: {health.database.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Uptime: {health.api.uptime}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Memory: {health.system.memory_usage_percent}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

                       {/* Statistics */}
               {statistics && (
                 <div className="mb-8">
                   <div className={`${cardStyles.base} p-6`}>
                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                       <Activity className="w-5 h-5 mr-2" />
                       System Statistics
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.overview.total_ideas}</p>
                         <p className="text-sm text-gray-600">Total Ideas</p>
                       </div>
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.overview.total_documents}</p>
                         <p className="text-sm text-gray-600">Documents</p>
                       </div>
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.overview.total_action_plans}</p>
                         <p className="text-sm text-gray-600">Action Plans</p>
                       </div>
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.overview.recent_ideas}</p>
                         <p className="text-sm text-gray-600">Recent Ideas</p>
                       </div>
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.overview.avg_ideas_per_day}</p>
                         <p className="text-sm text-gray-600">Avg Ideas/Day</p>
                       </div>
                       <div className="text-center p-4 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-900">{statistics.performance.response_time_ms}ms</p>
                         <p className="text-sm text-gray-600">Response Time</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

        {/* Preferences */}
        {preferences && (
          <div className="mb-8">
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                User Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Theme</span>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handleUpdatePreferences({ theme: e.target.value })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Default Category</span>
                  <select
                    value={preferences.default_category}
                    onChange={(e) => handleUpdatePreferences({ default_category: e.target.value })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto Save</span>
                  <input
                    type="checkbox"
                    checked={preferences.auto_save}
                    onChange={(e) => handleUpdatePreferences({ auto_save: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handleUpdatePreferences({ notifications: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration */}
        {configuration && (
          <div className="mb-8">
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Configuration
              </h3>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <p className="text-sm font-medium text-gray-600">Environment</p>
                         <p className="text-sm text-gray-900">{configuration.api.environment}</p>
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Database Path</p>
                         <p className="text-sm text-gray-900">{configuration.database.path}</p>
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">API Version</p>
                         <p className="text-sm text-gray-900">{configuration.api.version}</p>
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Port</p>
                         <p className="text-sm text-gray-900">{configuration.api.port}</p>
                       </div>
                     </div>
            </div>
          </div>
        )}

        {/* Backups */}
        <div className="mb-8">
          <div className={`${cardStyles.base} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                System Backups
              </h3>
              <button
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                className={`${buttonStyles.primary} flex items-center space-x-2`}
              >
                {creatingBackup ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{creatingBackup ? 'Creating...' : 'Create Backup'}</span>
              </button>
            </div>
            <div className="space-y-3">
              {backups.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No backups found</p>
              ) : (
                                       backups.map((backup) => (
                         <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <div>
                             <p className="text-sm font-medium text-gray-900">{backup.id}</p>
                             <p className="text-xs text-gray-500">{backup.timestamp}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm text-gray-900">{backup.size_mb} MB</p>
                             <p className="text-xs text-gray-500">{backup.type}</p>
                           </div>
                         </div>
                       ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 