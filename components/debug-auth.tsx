'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('user_data');
    
    setDebugInfo({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      hasUserData: !!userData,
      userData: userData ? JSON.parse(userData) : null,
      timestamp: new Date().toISOString()
    });
  }, []);

  const refreshDebugInfo = () => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('user_data');
    
    setDebugInfo({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      hasUserData: !!userData,
      userData: userData ? JSON.parse(userData) : null,
      timestamp: new Date().toISOString()
    });
  };

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const loginData = {
        email: 'admin@reset.com',
        password: 'admin123'
      };
      
      // Limpiar localStorage antes del login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('user_data');
      
      const response = await apiClient.login(loginData);
      setTestResult(`✅ Login successful: Token and user data saved`);
      
      // Refresh debug info after login
      setTimeout(refreshDebugInfo, 1000);
      
    } catch (error: any) {
      console.error('Full login error:', error);
      setTestResult(`❌ Login failed: ${error.message} - Status: ${error.response?.status}`);
    }
  };

  const testAuthEndpoint = async () => {
    try {
      setTestResult('Testing /auth/me...');
      const response = await apiClient.getCurrentUser();
      setTestResult(`✅ Auth endpoint works: User authenticated`);
    } catch (error: any) {
      setTestResult(`❌ Auth endpoint failed: ${error.message} - Status: ${error.response?.status}`);
    }
  };

  const testCreateService = async () => {
    try {
      setTestResult('Testing service creation...');
      const testService = {
        name: 'Test Service DEBUG',
        description: 'Service for debugging auth',
        price: 100,
        category: 'informatica', // Usar el valor del enum correcto
        icon: 'monitor', // Usar icono en lugar de image_url
        estimated_duration: 60,
        features: ['Test feature']
      };
      
      console.log('🔍 Sending service data:', testService);
      const response = await apiClient.createService(testService);
      console.log('✅ Service creation response:', response);
      setTestResult(`✅ Service created successfully: ${response.name}`);
    } catch (error: any) {
      console.error('❌ Full service creation error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      };
      
      setTestResult(`❌ Service creation failed: ${JSON.stringify(errorDetails, null, 2)}`);
    }
  };

  if (!debugInfo) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 m-4">
      <h3 className="text-lg font-bold mb-4">🔍 Debug Authentication</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Has Token:</strong> {debugInfo.hasToken ? '✅' : '❌'}</p>
        <p><strong>Token Preview:</strong> {debugInfo.token || 'No token'}</p>
        <p><strong>Has User Data:</strong> {debugInfo.hasUserData ? '✅' : '❌'}</p>
        <p><strong>User:</strong> {debugInfo.userData ? `${debugInfo.userData.name} (${debugInfo.userData.email})` : 'No user data'}</p>
        <p><strong>Role:</strong> {debugInfo.userData?.role || 'No role'}</p>
      </div>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testLogin}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Login
        </button>
        <button 
          onClick={testAuthEndpoint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test /auth/me
        </button>
        <button 
          onClick={testCreateService}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Create Service
        </button>
        <button 
          onClick={refreshDebugInfo}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Info
        </button>
      </div>
      
      {testResult && (
        <div className="p-3 bg-white border rounded">
          <strong>Test Result:</strong>
          <pre className="mt-2 text-sm overflow-auto">{testResult}</pre>
        </div>
      )}
    </div>
  );
}
