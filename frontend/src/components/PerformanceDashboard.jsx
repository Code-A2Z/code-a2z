import { useState, useEffect, memo } from 'react';
import { usePerformanceMonitor, useMemoryMonitor, useNetworkStatus } from '../utils/usePerformance';
import performanceMonitor from '../utils/performance';

const PerformanceDashboard = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [performanceScore, setPerformanceScore] = useState(0);
  
  // Performance monitoring hooks
  usePerformanceMonitor('PerformanceDashboard');
  const memoryInfo = useMemoryMonitor();
  const { isOnline, connection } = useNetworkStatus();

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getMetrics();
      const currentScore = performanceMonitor.getPerformanceScore();
      
      setMetrics(currentMetrics);
      setPerformanceScore(currentScore);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Dashboard
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Performance Score */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{performanceScore}</div>
                <div className="text-lg opacity-90">{getScoreLabel(performanceScore)}</div>
                <div className="text-sm opacity-75">Performance Score</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Web Vitals */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Core Web Vitals
              </h3>
              <div className="space-y-3">
                {['CLS', 'FID', 'FCP', 'LCP', 'TTFB'].map((metric) => (
                  <div key={metric} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {metrics[metric]?.value ? formatTime(metrics[metric].value) : 'N/A'}
                      </span>
                      {metrics[metric]?.rating && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          metrics[metric].rating === 'good' ? 'bg-green-100 text-green-800' :
                          metrics[metric].rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {metrics[metric].rating}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                System Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Network Status</span>
                  <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                {connection && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Connection Type</span>
                      <span className="text-sm font-medium">{connection.effectiveType || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Downlink</span>
                      <span className="text-sm font-medium">{connection.downlink ? `${connection.downlink} Mbps` : 'Unknown'}</span>
                    </div>
                  </>
                )}
                {memoryInfo && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                      <span className="text-sm font-medium">{formatBytes(memoryInfo.used)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Memory Limit</span>
                      <span className="text-sm font-medium">{formatBytes(memoryInfo.limit)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${memoryInfo.percentage}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Resource Loading */}
            {metrics.resources && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Resource Loading
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(metrics.resources).map(([type, resources]) => (
                    <div key={type} className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">{type}</div>
                      <div className="text-xs text-gray-500">
                        Avg: {formatTime(
                          resources.reduce((sum, r) => sum + r.duration, 0) / resources.length
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Long Tasks */}
            {metrics.longTasks && metrics.longTasks.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Long Tasks (Last 10)
                </h3>
                <div className="space-y-2">
                  {metrics.longTasks.slice(-10).map((task, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Task #{index + 1}
                      </span>
                      <span className="font-medium">{formatTime(task.duration)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => performanceMonitor.destroy()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Monitor
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;
