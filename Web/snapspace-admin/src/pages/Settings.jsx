import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    // Application Settings
    appName: 'SnapSpace Admin',
    appVersion: '1.0.0',
    environment: 'development',
    
    // User Preferences
    darkMode: true,
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
    
    // Security Settings
    sessionTimeout: 30,
    twoFactorAuth: false,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    
    // API Settings
    apiTimeout: 30,
    retryAttempts: 3,
    cacheEnabled: true,
    debugMode: false,
    
    // Performance Settings
    pageSize: 20,
    maxFileSize: 10,
    compressionEnabled: true,
    lazyLoading: true,
    
    // Maintenance Settings
    maintenanceMode: false,
    backupEnabled: true,
    logLevel: 'info',
    analyticsEnabled: true
  });

  // Static system information
  const systemInfo = {
    serverStatus: 'Online',
    lastBackup: new Date().toLocaleDateString(),
    totalUsers: 1247,
    totalTiles: 856,
    storageUsed: '2.4 GB',
    uptime: '15 days, 7 hours',
    serverLocation: 'US East',
    dbConnection: 'Connected'
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear messages when user makes changes
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store some settings in localStorage for persistence
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setSuccess('✅ Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        appName: 'SnapSpace Admin',
        appVersion: '1.0.0',
        environment: 'development',
        darkMode: true,
        emailNotifications: true,
        pushNotifications: false,
        autoSave: true,
        language: 'en',
        timezone: 'UTC',
        sessionTimeout: 30,
        twoFactorAuth: false,
        passwordExpiry: 90,
        maxLoginAttempts: 5,
        apiTimeout: 30,
        retryAttempts: 3,
        cacheEnabled: true,
        debugMode: false,
        pageSize: 20,
        maxFileSize: 10,
        compressionEnabled: true,
        lazyLoading: true,
        maintenanceMode: false,
        backupEnabled: true,
        logLevel: 'info',
        analyticsEnabled: true
      });
      setSuccess('Settings reset to default values');
    }
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.warn('Failed to parse saved settings:', err);
      }
    }
  }, []);

  const SettingRow = ({ label, children, description }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      marginBottom: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ 
          color: '#f8fafc', 
          fontWeight: '500', 
          marginBottom: description ? '4px' : '0' 
        }}>
          {label}
        </div>
        {description && (
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '12px', 
            lineHeight: '1.4' 
          }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ marginLeft: '16px' }}>
        {children}
      </div>
    </div>
  );

  const SettingCategory = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ 
        color: '#f8fafc', 
        marginBottom: '16px', 
        fontSize: '18px',
        fontWeight: '600',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '8px'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '1200px', minHeight: '700px' }}>
        <div className="login-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 className="login-title" style={{ margin: 0 }}>Settings</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleResetSettings}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 16px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(251, 146, 60, 0.2)',
                  color: '#fbbf24'
                }}
              >
                🔄 Reset
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 16px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e'
                }}
              >
                {isLoading ? '💾 Saving...' : '💾 Save'}
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 20px',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '12px',
              padding: '16px',
              color: '#22c55e',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          <div style={{ 
            maxHeight: '600px', 
            overflowY: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            
            {/* System Information (Read-only) */}
            <SettingCategory title="📊 System Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <SettingRow label="Server Status">
                  <span style={{ 
                    color: '#22c55e', 
                    fontWeight: '600',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '4px'
                  }}>
                    🟢 {systemInfo.serverStatus}
                  </span>
                </SettingRow>
                <SettingRow label="Database Connection">
                  <span style={{ 
                    color: '#22c55e', 
                    fontWeight: '600',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '4px'
                  }}>
                    🔗 {systemInfo.dbConnection}
                  </span>
                </SettingRow>
                <SettingRow label="Total Users">
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                    👥 {systemInfo.totalUsers.toLocaleString()}
                  </span>
                </SettingRow>
                <SettingRow label="Total Tiles">
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                    🎯 {systemInfo.totalTiles.toLocaleString()}
                  </span>
                </SettingRow>
                <SettingRow label="Storage Used">
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>
                    💾 {systemInfo.storageUsed}
                  </span>
                </SettingRow>
                <SettingRow label="System Uptime">
                  <span style={{ color: '#a78bfa', fontWeight: '600' }}>
                    ⏱️ {systemInfo.uptime}
                  </span>
                </SettingRow>
                <SettingRow label="Last Backup">
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>
                    🗂️ {systemInfo.lastBackup}
                  </span>
                </SettingRow>
                <SettingRow label="Server Location">
                  <span style={{ color: '#94a3b8', fontWeight: '500' }}>
                    🌍 {systemInfo.serverLocation}
                  </span>
                </SettingRow>
              </div>
            </SettingCategory>

            {/* Application Settings (Read-only) */}
            <SettingCategory title="🏢 Application Information">
              <SettingRow label="Application Name">
                <span style={{ color: '#f8fafc', fontWeight: '500' }}>
                  {settings.appName}
                </span>
              </SettingRow>
              <SettingRow label="Version">
                <span style={{ color: '#f8fafc', fontWeight: '500' }}>
                  v{settings.appVersion}
                </span>
              </SettingRow>
              <SettingRow label="Environment">
                <span style={{ 
                  color: settings.environment === 'production' ? '#22c55e' : '#fbbf24',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                  backgroundColor: settings.environment === 'production' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  borderRadius: '4px'
                }}>
                  {settings.environment}
                </span>
              </SettingRow>
            </SettingCategory>

            {/* User Preferences (Editable) */}
            <SettingCategory title="👤 User Preferences">
              <SettingRow 
                label="Dark Mode" 
                description="Enable dark theme across the application"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('preferences', 'darkMode', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.darkMode ? '#22c55e' : '#94a3b8' }}>
                    {settings.darkMode ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Email Notifications" 
                description="Receive notifications via email"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('preferences', 'emailNotifications', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.emailNotifications ? '#22c55e' : '#94a3b8' }}>
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Push Notifications" 
                description="Receive browser push notifications"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('preferences', 'pushNotifications', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.pushNotifications ? '#22c55e' : '#94a3b8' }}>
                    {settings.pushNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Language" 
                description="Select your preferred language"
              >
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  className="form-input"
                  style={{ width: '120px', padding: '8px 12px', height: 'auto' }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Timezone" 
                description="Your local timezone"
              >
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                  className="form-input"
                  style={{ width: '140px', padding: '8px 12px', height: 'auto' }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                  <option value="CET">CET</option>
                </select>
              </SettingRow>
            </SettingCategory>

            {/* Security Settings (Editable) */}
            <SettingCategory title="🔒 Security Settings">
              <SettingRow 
                label="Session Timeout" 
                description="Automatic logout after inactivity (minutes)"
              >
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '80px', padding: '8px 12px', height: 'auto' }}
                  min="5"
                  max="480"
                />
              </SettingRow>

              <SettingRow 
                label="Two-Factor Authentication" 
                description="Add extra security to your account"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.twoFactorAuth ? '#22c55e' : '#94a3b8' }}>
                    {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Password Expiry" 
                description="Days before password expires"
              >
                <select
                  value={settings.passwordExpiry}
                  onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '100px', padding: '8px 12px', height: 'auto' }}
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Max Login Attempts" 
                description="Failed login attempts before lockout"
              >
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '80px', padding: '8px 12px', height: 'auto' }}
                  min="3"
                  max="10"
                />
              </SettingRow>
            </SettingCategory>

            {/* Performance Settings (Editable) */}
            <SettingCategory title="⚡ Performance Settings">
              <SettingRow 
                label="Page Size" 
                description="Number of items per page"
              >
                <select
                  value={settings.pageSize}
                  onChange={(e) => handleSettingChange('performance', 'pageSize', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '100px', padding: '8px 12px', height: 'auto' }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Cache Enabled" 
                description="Enable caching for better performance"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.cacheEnabled}
                    onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.cacheEnabled ? '#22c55e' : '#94a3b8' }}>
                    {settings.cacheEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Lazy Loading" 
                description="Load content as needed"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.lazyLoading}
                    onChange={(e) => handleSettingChange('performance', 'lazyLoading', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.lazyLoading ? '#22c55e' : '#94a3b8' }}>
                    {settings.lazyLoading ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>
            </SettingCategory>

            {/* API Settings (Editable) */}
            <SettingCategory title="🔌 API Configuration">
              <SettingRow 
                label="API Timeout" 
                description="Request timeout in seconds"
              >
                <input
                  type="number"
                  value={settings.apiTimeout}
                  onChange={(e) => handleSettingChange('api', 'apiTimeout', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '80px', padding: '8px 12px', height: 'auto' }}
                  min="5"
                  max="120"
                />
              </SettingRow>

              <SettingRow 
                label="Retry Attempts" 
                description="Number of retry attempts for failed requests"
              >
                <input
                  type="number"
                  value={settings.retryAttempts}
                  onChange={(e) => handleSettingChange('api', 'retryAttempts', parseInt(e.target.value))}
                  className="form-input"
                  style={{ width: '80px', padding: '8px 12px', height: 'auto' }}
                  min="0"
                  max="5"
                />
              </SettingRow>

              <SettingRow 
                label="Debug Mode" 
                description="Enable detailed API logging"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => handleSettingChange('api', 'debugMode', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.debugMode ? '#fbbf24' : '#94a3b8' }}>
                    {settings.debugMode ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>
            </SettingCategory>

            {/* Maintenance Settings (Editable) */}
            <SettingCategory title="🔧 Maintenance">
              <SettingRow 
                label="Maintenance Mode" 
                description="Enable maintenance mode for the application"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenance', 'maintenanceMode', e.target.checked)}
                    style={{ accentColor: '#ef4444' }}
                  />
                  <span style={{ color: settings.maintenanceMode ? '#ef4444' : '#94a3b8' }}>
                    {settings.maintenanceMode ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Automatic Backups" 
                description="Enable scheduled backups"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.backupEnabled}
                    onChange={(e) => handleSettingChange('maintenance', 'backupEnabled', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.backupEnabled ? '#22c55e' : '#94a3b8' }}>
                    {settings.backupEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>

              <SettingRow 
                label="Log Level" 
                description="System logging verbosity"
              >
                <select
                  value={settings.logLevel}
                  onChange={(e) => handleSettingChange('maintenance', 'logLevel', e.target.value)}
                  className="form-input"
                  style={{ width: '120px', padding: '8px 12px', height: 'auto' }}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </SettingRow>

              <SettingRow 
                label="Analytics" 
                description="Enable usage analytics collection"
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => handleSettingChange('maintenance', 'analyticsEnabled', e.target.checked)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: settings.analyticsEnabled ? '#22c55e' : '#94a3b8' }}>
                    {settings.analyticsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </SettingRow>
            </SettingCategory>
          </div>

          <div className="input-group" style={{ marginTop: '24px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              lineHeight: '1.5'
            }}>
              <strong>Note:</strong> Settings are automatically saved to local storage. Some changes may require a page refresh to take effect.<br />
              <strong>Last Updated:</strong> {new Date().toLocaleString()}<br />
              <strong>Settings File:</strong> adminSettings.json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
