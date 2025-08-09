import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    // Track Core Web Vitals
    getCLS(this.handleMetric.bind(this, 'CLS'));
    getFID(this.handleMetric.bind(this, 'FID'));
    getFCP(this.handleMetric.bind(this, 'FCP'));
    getLCP(this.handleMetric.bind(this, 'LCP'));
    getTTFB(this.handleMetric.bind(this, 'TTFB'));

    // Track custom metrics
    this.observeResourceTiming();
    this.observeLongTasks();
    this.observeMemoryUsage();
  }

  handleMetric(metricName, metric) {
    this.metrics[metricName] = {
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`${metricName}:`, metric.value, `(${metric.rating})`);
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      this.sendToAnalytics(metricName, metric);
    }
  }

  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackResourceLoad(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.trackLongTask(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memory = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }, 10000); // Check every 10 seconds
    }
  }

  trackResourceLoad(entry) {
    const resourceType = this.getResourceType(entry.name);
    
    if (!this.metrics.resources) {
      this.metrics.resources = {};
    }
    
    if (!this.metrics.resources[resourceType]) {
      this.metrics.resources[resourceType] = [];
    }
    
    this.metrics.resources[resourceType].push({
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize,
      timestamp: Date.now()
    });
  }

  trackLongTask(entry) {
    if (!this.metrics.longTasks) {
      this.metrics.longTasks = [];
    }
    
    this.metrics.longTasks.push({
      duration: entry.duration,
      startTime: entry.startTime,
      timestamp: Date.now()
    });
  }

  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  sendToAnalytics(metricName, metric) {
    // Send to your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metricName,
        value: Math.round(metric.value),
        non_interaction: true
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }

  getPerformanceScore() {
    const scores = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    };

    let totalScore = 0;
    let metricCount = 0;

    Object.entries(scores).forEach(([metric, thresholds]) => {
      const value = this.metrics[metric]?.value;
      if (value !== undefined) {
        let score = 0;
        if (value <= thresholds.good) score = 100;
        else if (value <= thresholds.poor) score = 50;
        else score = 0;
        
        totalScore += score;
        metricCount++;
      }
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
