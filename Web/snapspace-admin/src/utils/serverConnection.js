import { checkServerHealth, checkServerStatus } from '../api/authApi';

export class ServerConnectionManager {
  constructor() {
    this.isHealthy = false;
    this.lastCheckTime = null;
    this.checkInterval = null;
  }

  async initialize() {
    console.log('Initializing server connection manager...');
    await this.performHealthCheck();
    this.startPeriodicHealthCheck();
  }

  async performHealthCheck() {
    try {
      console.log('Performing server health check...');
      const serverStatus = await checkServerStatus();
      
      if (serverStatus.status === 'healthy') {
        this.isHealthy = true;
        console.log('✅ Server is healthy and responsive');
        this.showConnectionStatus('Connected', 'success');
      } else {
        this.isHealthy = false;
        console.log('❌ Server is not responding');
        this.showConnectionStatus('Server Unavailable', 'error');
        
        // Try to wake up the server (common with Render free tier)
        this.attemptServerWakeup();
      }
      
      this.lastCheckTime = new Date();
      return this.isHealthy;
    } catch (error) {
      console.error('Health check failed:', error.message);
      this.isHealthy = false;
      this.showConnectionStatus('Connection Failed', 'error');
      return false;
    }
  }

  async attemptServerWakeup() {
    console.log('Attempting to wake up server...');
    try {
      // Make a simple request to wake up the server
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/health', {
        method: 'GET',
        mode: 'no-cors' // Avoid CORS issues for wake-up call
      });
      console.log('Wake-up request sent');
    } catch (error) {
      console.log('Wake-up request completed (error expected)');
    }
  }

  startPeriodicHealthCheck() {
    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  stopPeriodicHealthCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  showConnectionStatus(message, type) {
    // Create or update connection status indicator
    let statusElement = document.getElementById('connection-status');
    
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.id = 'connection-status';
      statusElement.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        z-index: 9999;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(statusElement);
    }

    statusElement.textContent = message;
    
    if (type === 'success') {
      statusElement.style.backgroundColor = '#10b981';
      statusElement.style.color = 'white';
    } else if (type === 'error') {
      statusElement.style.backgroundColor = '#ef4444';
      statusElement.style.color = 'white';
    } else {
      statusElement.style.backgroundColor = '#f59e0b';
      statusElement.style.color = 'white';
    }

    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (statusElement && statusElement.textContent === message) {
          statusElement.style.opacity = '0';
          setTimeout(() => {
            if (statusElement && statusElement.style.opacity === '0') {
              statusElement.remove();
            }
          }, 300);
        }
      }, 3000);
    }
  }

  getStatus() {
    return {
      isHealthy: this.isHealthy,
      lastCheckTime: this.lastCheckTime
    };
  }
}

// Create singleton instance
export const serverConnectionManager = new ServerConnectionManager();
