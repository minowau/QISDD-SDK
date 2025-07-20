import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Shield, Activity, Lock, Zap, Eye, AlertTriangle, CheckCircle, Clock, Database, Network, TrendingUp } from 'lucide-react';
import { apiService, SecurityMetrics, SystemStatus, BlockchainEvent } from '../services/apiService';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  suffix?: string;
  trend?: string | null;
}

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'alert' | 'completed';
  label: string;
}

interface SettingsProps {
  className?: string;
}
export default function QISDDDashboard() {
  const [data, setData] = useState(apiService.generateTimeSeriesData());
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalDataProtected: 1247,
    activeQuantumStates: 342,
    threatsMitigated: 156,
    complianceScore: 98.7,
    uptime: 99.99,
    responseTime: 23
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    quantumEngine: 'operational',
    blockchain: 'connected',
    encryptionLayer: 'active',
    observerEffect: 'monitoring'
  });
  const [blockchainEvents, setBlockchainEvents] = useState<BlockchainEvent[]>([
    { id: 1, type: 'access', dataId: 'QS_7a8b9c', event: 'Authorized Access', timestamp: '14:32:15', status: 'success', txHash: '0xabc123...' },
    { id: 2, type: 'audit', dataId: 'QS_9d4e2f', event: 'Data Erased', timestamp: '14:31:42', status: 'completed', txHash: '0xdef456...' },
    { id: 3, type: 'state', dataId: 'QS_3f8a1b', event: 'State Collapsed', timestamp: '14:30:58', status: 'alert', txHash: '0x789xyz...' },
    { id: 4, type: 'crypto', dataId: 'QS_2c9d5e', event: 'ZKP Verified', timestamp: '14:29:33', status: 'success', txHash: '0x456def...' },
    { id: 5, type: 'access', dataId: 'QS_1a7b3c', event: 'Observer Effect Triggered', timestamp: '14:28:17', status: 'warning', txHash: '0x123abc...' }
  ]);
  const [threatData, setThreatData] = useState(apiService.getThreatData());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseActive, setPulseActive] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('quantum_states');
  const [apiConnected, setApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize API connection
    const initializeApiConnection = async () => {
      try {
        // Test API connectivity
        const connected = await apiService.testConnection();
        setApiConnected(connected);
        
        if (connected) {
          // Load initial data from API
          const [metrics, status, events] = await Promise.all([
            apiService.getSecurityMetrics(),
            apiService.getSystemStatus(),
            apiService.getRecentEvents()
          ]);
          
          setSecurityMetrics(metrics);
          setSystemStatus(status);
          if (events.length > 0) {
            setBlockchainEvents(events);
          }
        }
        
        // Connect to WebSocket for real-time events
        apiService.connectEventStream();
        
        // Subscribe to real-time events
        const unsubscribe = apiService.onEvent((event) => {
          setBlockchainEvents(prev => [event, ...prev.slice(0, 4)]);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize API connection:', error);
        setApiConnected(false);
      }
    };
    
    const unsubscribe = initializeApiConnection();
    
    // Set up intervals for data updates
    const dataInterval = setInterval(() => {
      setData(apiService.generateTimeSeriesData());
      setThreatData(apiService.getThreatData());
      setCurrentTime(new Date());
      setPulseActive(prev => !prev);
      
      // Refresh metrics if API is connected
      if (apiConnected) {
        apiService.getSecurityMetrics().then(setSecurityMetrics).catch(console.error);
        apiService.getSystemStatus().then(setSystemStatus).catch(console.error);
      }
    }, 3000);
    
    return () => {
      clearInterval(dataInterval);
      apiService.disconnect();
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub?.());
      }
    };
  }, [apiConnected]);

  const MetricCard = ({ title, value, icon: Icon, color, suffix = '', trend = null }: MetricCardProps) => (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-${color}-500 transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold text-${color}-400 mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">{trend}</span>
            </div>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-400`} />
      </div>
    </div>
  );

  const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
    const colors = {
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      alert: 'bg-red-500',
      completed: 'bg-blue-500'
    };
    
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${colors[status]} ${pulseActive ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="bg-red-600 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                QISDD Security Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Quantum-Inspired Security Data Defense</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Current Time</p>
            <p className="text-xl font-mono text-blue-400">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Data Protected" 
          value={securityMetrics.totalDataProtected} 
          icon={Database} 
          color="blue"
          trend="+12% this hour"
        />
        <MetricCard 
          title="Quantum States" 
          value={securityMetrics.activeQuantumStates} 
          icon={Zap} 
          color="purple"
          trend="+5 active"
        />
        <MetricCard 
          title="Threats Blocked" 
          value={securityMetrics.threatsMitigated} 
          icon={Shield} 
          color="green"
          trend="+3 last hour"
        />
        <MetricCard 
          title="Compliance Score" 
          value={securityMetrics.complianceScore} 
          icon={CheckCircle} 
          color="emerald"
          suffix="%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Real-time Security Metrics */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Real-time Security Metrics</h3>
            <div className="flex space-x-2">
              {['quantum_states', 'threats', 'encryptions'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedMetric === metric 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {metric.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric}
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#gradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Distribution */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Threat Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={threatData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {threatData.map((threat, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: threat.color }}></div>
                <span className="text-sm text-gray-300">{threat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status and Blockchain Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">System Uptime</span>
              <span className="text-green-400 font-semibold">{securityMetrics.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Response Time</span>
              <span className="text-blue-400 font-semibold">{securityMetrics.responseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Connection</span>
              <StatusIndicator status={apiConnected ? "success" : "alert"} label={apiConnected ? "Connected" : "Disconnected"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Quantum Engine</span>
              <StatusIndicator status={systemStatus.quantumEngine === 'operational' ? "success" : systemStatus.quantumEngine === 'warning' ? "warning" : "alert"} label={systemStatus.quantumEngine === 'operational' ? "Operational" : systemStatus.quantumEngine === 'warning' ? "Warning" : "Error"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Blockchain</span>
              <StatusIndicator status={systemStatus.blockchain === 'connected' ? "success" : "alert"} label={systemStatus.blockchain === 'connected' ? "Connected" : "Disconnected"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Encryption Layer</span>
              <StatusIndicator status={systemStatus.encryptionLayer === 'active' ? "success" : "alert"} label={systemStatus.encryptionLayer === 'active' ? "Active" : "Inactive"} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Observer Effect</span>
              <StatusIndicator status={systemStatus.observerEffect === 'monitoring' ? "warning" : "success"} label={systemStatus.observerEffect === 'monitoring' ? "Monitoring" : "Idle"} />
            </div>
          </div>
        </div>

        {/* Blockchain Events */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Network className="w-5 h-5 mr-2 text-purple-400" />
            Recent Blockchain Events
          </h3>
          <div className="space-y-3">
            {blockchainEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {event.type === 'access' && <Eye className="w-4 h-4 text-blue-400" />}
                    {event.type === 'audit' && <Lock className="w-4 h-4 text-green-400" />}
                    {event.type === 'state' && <Zap className="w-4 h-4 text-purple-400" />}
                    {event.type === 'crypto' && <Shield className="w-4 h-4 text-yellow-400" />}
                    <StatusIndicator status={event.status} label="" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{event.event}</p>
                    <p className="text-gray-400 text-sm">ID: {event.dataId} • TX: {event.txHash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Panel */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
          <AlertTriangle className="w-6 h-6" />
        </button>
        <button className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// Settings icon component (since it's not in lucide-react by default)
const Settings = ({ className }: SettingsProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
