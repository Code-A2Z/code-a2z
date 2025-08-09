import { useEffect, useRef, useState } from 'react';

// Image optimization utilities
export const optimizeImageUrl = (url, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'auto',
    crop = 'fill'
  } = options;

  // If it's a Cloudinary URL, optimize it
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    
    return `${baseUrl}/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${imagePath}`;
  }

  // If it's a local image, return as is
  return url;
};

// Lazy loading image component
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.png',
  width,
  height,
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsLoaded(true);
    }
  }, [priority]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !priority) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      {isLoaded && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
    </div>
  );
};

// Responsive image component
export const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes = '100vw',
  srcSet = [],
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      sizes={sizes}
      srcSet={srcSet.length > 0 ? srcSet.join(', ') : undefined}
      loading="lazy"
      {...props}
    />
  );
};

// Background image component with lazy loading
export const LazyBackgroundImage = ({ 
  src, 
  className = '', 
  children,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
  }, [src]);

  if (error) {
    return (
      <div className={`bg-gray-200 ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.3s ease-in-out'
      }}
      {...props}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {children}
    </div>
  );
};

// Utility functions
export const generateSrcSet = (baseUrl, widths = [320, 640, 768, 1024, 1280]) => {
  return widths.map(width => `${optimizeImageUrl(baseUrl, { width })} ${width}w`);
};

export const getOptimalImageSize = (containerWidth, devicePixelRatio = 1) => {
  const optimalWidth = Math.round(containerWidth * devicePixelRatio);
  
  // Round to nearest standard size
  const standardSizes = [320, 640, 768, 1024, 1280, 1920];
  return standardSizes.reduce((prev, curr) => 
    Math.abs(curr - optimalWidth) < Math.abs(prev - optimalWidth) ? curr : prev
  );
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};
