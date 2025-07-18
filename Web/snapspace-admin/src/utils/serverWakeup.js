import { checkServerStatus } from '../api/axios';

// Function to wake up a sleeping server (common with free hosting services)
export const wakeUpServer = async (maxAttempts = 5) => {
  console.log('🚀 Attempting to wake up server...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Wake-up attempt ${attempt}/${maxAttempts}`);
      
      // Try to ping the server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/health', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Server is awake and responding!');
        return true;
      }
      
      console.log(`Attempt ${attempt} - Server responded with status: ${response.status}`);
      
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        // Wait longer between attempts (progressive delay)
        const delay = Math.min(attempt * 3000, 15000); // Max 15 seconds
        console.log(`Waiting ${delay/1000} seconds before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.log('❌ Failed to wake up server after all attempts');
  return false;
};

// Function to check if server needs to be woken up
export const ensureServerIsAwake = async () => {
  console.log('Checking if server is awake...');
  
  try {
    const serverStatus = await checkServerStatus();
    
    if (serverStatus.status === 'healthy') {
      console.log('✅ Server is already awake and healthy');
      return true;
    }
    
    console.log('🔄 Server appears to be sleeping, attempting to wake it up...');
    return await wakeUpServer();
    
  } catch (error) {
    console.error('Error checking server status:', error);
    console.log('🔄 Attempting to wake up server anyway...');
    return await wakeUpServer();
  }
};

// Function to show user-friendly messages during server wake-up
export const handleServerWakeup = async (onStatusUpdate) => {
  const updateStatus = (message, type = 'info') => {
    if (onStatusUpdate) {
      onStatusUpdate(message, type);
    }
    console.log(message);
  };
  
  updateStatus('Checking server status...', 'info');
  
  try {
    const serverStatus = await checkServerStatus();
    
    if (serverStatus.status === 'healthy') {
      updateStatus('Server is ready!', 'success');
      return true;
    }
    
    updateStatus('Server is starting up, please wait...', 'warning');
    
    const isAwake = await wakeUpServer();
    
    if (isAwake) {
      updateStatus('Server is now ready!', 'success');
      return true;
    } else {
      updateStatus('Server is currently unavailable. Please try again later.', 'error');
      return false;
    }
    
  } catch (error) {
    updateStatus('Connection failed. Please check your internet connection.', 'error');
    return false;
  }
};

export default {
  wakeUpServer,
  ensureServerIsAwake,
  handleServerWakeup
};
