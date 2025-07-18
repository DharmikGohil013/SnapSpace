import React, { useState } from 'react';
import '../styles/glassmorphism-login.css';

const CorsTestComponent = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testEndpoints = async () => {
    setIsLoading(true);
    setResults([]);
    
    // Test 1: Health check via proxy
    try {
      addResult('Health Check (Proxy)', 'testing', 'Testing /api/health...');
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        addResult('Health Check (Proxy)', 'success', `✅ Success: ${response.status}`);
      } else {
        addResult('Health Check (Proxy)', 'warning', `⚠️ Response: ${response.status}`);
      }
    } catch (error) {
      addResult('Health Check (Proxy)', 'error', `❌ Error: ${error.message}`);
    }
    
    // Test 2: Direct API call (should fail with CORS)
    try {
      addResult('Direct API', 'testing', 'Testing direct https://snapspace-ry3k.onrender.com...');
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        addResult('Direct API', 'success', `✅ Success: ${response.status}`);
      } else {
        addResult('Direct API', 'warning', `⚠️ Response: ${response.status}`);
      }
    } catch (error) {
      addResult('Direct API', 'error', `❌ CORS Error (Expected): ${error.message}`);
    }
    
    // Test 3: Admin login via proxy
    try {
      addResult('Admin Login (Proxy)', 'testing', 'Testing /api/auth/admin/login...');
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      addResult('Admin Login (Proxy)', 'info', `📡 Response: ${response.status} (${response.status === 400 || response.status === 401 ? 'Expected for invalid credentials' : 'Unexpected'})`);
    } catch (error) {
      addResult('Admin Login (Proxy)', 'error', `❌ Error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <div className="login-form">
          <h2 className="login-title">CORS & Proxy Test</h2>
          
          <button 
            onClick={testEndpoints}
            className="login-button"
            disabled={isLoading}
            style={{ marginBottom: '24px' }}
          >
            {isLoading ? 'Testing...' : '🧪 Run CORS Tests'}
          </button>
          
          <div className="input-group">
            <div className="input-label">Test Results</div>
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              {results.length === 0 ? (
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                  Click "Run CORS Tests" to start testing
                </div>
              ) : (
                results.map((result, index) => (
                  <div key={index} style={{ 
                    marginBottom: '12px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <div style={{ 
                      color: 'white', 
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      [{result.timestamp}] {result.test}
                    </div>
                    <div style={{ 
                      color: result.status === 'success' ? '#4caf50' :
                             result.status === 'error' ? '#f44336' :
                             result.status === 'warning' ? '#ff9800' :
                             result.status === 'info' ? '#2196f3' : '#ffc107'
                    }}>
                      {result.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="input-group">
            <div className="input-label">Instructions</div>
            <div style={{ 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              lineHeight: '1.5'
            }}>
              <strong>Expected Results:</strong><br />
              ✅ Health Check (Proxy) - Should work<br />
              ❌ Direct API - Should fail with CORS error<br />
              📡 Admin Login (Proxy) - Should get 400/401 response<br />
              <br />
              If proxy works, you can use relative URLs like `/api/...` instead of full URLs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorsTestComponent;
