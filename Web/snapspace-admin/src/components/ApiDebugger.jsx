import React, { useState } from 'react';
import { wakeUpServer, ensureServerIsAwake } from '../utils/serverWakeup';
import { checkServerStatus } from '../api/axios';

const ApiDebugger = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => setLogs([]);

  const testServerConnection = async () => {
    setIsLoading(true);
    clearLogs();
    addLog('Starting server connection test...', 'info');

    try {
      addLog('Checking server status...', 'info');
      const status = await checkServerStatus();
      addLog(`Server status: ${status.status}`, status.status === 'healthy' ? 'success' : 'error');

      if (status.status !== 'healthy') {
        addLog('Attempting to wake up server...', 'info');
        const isAwake = await wakeUpServer(3);
        addLog(`Wake-up result: ${isAwake ? 'Success' : 'Failed'}`, isAwake ? 'success' : 'error');
      }

    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectApi = async () => {
    setIsLoading(true);
    addLog('Testing direct API call...', 'info');

    try {
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      addLog(`Direct API response: ${response.status} ${response.statusText}`, 
             response.ok ? 'success' : 'error');

      if (response.ok) {
        const data = await response.text();
        addLog(`Response data: ${data}`, 'success');
      }

    } catch (error) {
      addLog(`Direct API error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setIsLoading(true);
    addLog('Testing admin login endpoint...', 'info');

    try {
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/auth/admin/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        })
      });

      addLog(`Admin login endpoint response: ${response.status} ${response.statusText}`, 
             response.status !== 500 ? 'success' : 'error');

      const data = await response.text();
      addLog(`Response: ${data}`, 'info');

    } catch (error) {
      addLog(`Admin login test error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">API Debugger</h3>
        <button onClick={clearLogs} className="text-xs text-gray-500 hover:text-gray-700">
          Clear
        </button>
      </div>
      
      <div className="flex gap-2 mb-2">
        <button 
          onClick={testServerConnection}
          disabled={isLoading}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Server
        </button>
        <button 
          onClick={testDirectApi}
          disabled={isLoading}
          className="text-xs px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Direct API
        </button>
        <button 
          onClick={testAdminLogin}
          disabled={isLoading}
          className="text-xs px-2 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Test Login
        </button>
      </div>

      <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50">
        {logs.length === 0 ? (
          <div className="text-xs text-gray-500">No logs yet...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="text-xs mb-1">
              <span className="text-gray-400">[{log.timestamp}]</span>
              <span className={`ml-1 ${
                log.type === 'error' ? 'text-red-600' : 
                log.type === 'success' ? 'text-green-600' : 
                'text-gray-800'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;
