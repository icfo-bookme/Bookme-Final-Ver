'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const GlobalLoader = () => {
  const [dots, setDots] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);
    
    // Auto hide after 5 seconds (for demo)
    const hideTimer = setTimeout(() => {
      setFadeOut(true);
    }, 500000); // Changed from 300000 to 5000 (5 seconds)
    
    return () => {
      clearInterval(dotInterval);
      clearTimeout(hideTimer);
    };
  }, []);
  
  if (fadeOut) return null;
  
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Brand Logo Animation */}
        <div style={styles.logoContainer}>
          <div style={styles.bookIcon}>
            <div style={styles.bookCover}>
              <span style={styles.bookB}>B</span>
            </div>
            <div style={styles.bookPages}></div>
          </div>
          
          <div style={styles.textContainer}>
            <div style={styles.brandName}>
              {/* Option 1: Use regular img tag (simpler) */}
              <img 
                src="/assets/images/logo.png" 
                alt="BookMe Logo" 
                style={styles.brandLogo} 
              />
              
              {/* Option 2: If you want to use Next.js Image (requires width/height) */}
              {/* 
              <Image 
                src="/assets/images/logo.png" 
                alt="BookMe Logo" 
                width={120} 
                height={40} 
                style={styles.brandLogo}
              /> 
              */}
              
              <span style={styles.cursor}>|</span>
              <span style={styles.dots}>
                {'.'.repeat(dots)}
              </span>
            </div>
            <div style={styles.tagline}>
              Discovering amazing experiences
            </div>
          </div>
        </div>
        
        {/* Progress indicator that looks like design element */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressTrack}>
            <div style={styles.progressFill}></div>
          </div>
          <div style={styles.statusText}>
            <span style={styles.statusIcon}>✓</span>
            <span style={styles.statusMessage}>Finding best matches...</span>
          </div>
        </div>
        
        {/* Stats that look like features */}
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>1M+</div>
            <div style={styles.statLabel}>Experiences</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Partners</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>99%</div>
            <div style={styles.statLabel}>Happy Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline styles - No CSS files needed
const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    textAlign: 'center',
    maxWidth: '400px',
    padding: '2rem',
  },
  logoContainer: {
    marginBottom: '2rem',
  },
  bookIcon: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 1rem',
  },
  bookCover: {
    width: '60px',
    height: '80px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #112B6B 100%)',
    borderRadius: '8px 12px 12px 8px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
    animation: 'float 3s ease-in-out infinite',
  },
  bookB: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  bookPages: {
    position: 'absolute',
    right: '-15px',
    top: '10px',
    width: '40px',
    height: '50px',
    background: 'white',
    borderRadius: '0 4px 4px 0',
    boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
    animation: 'pageFlip 2s ease-in-out infinite',
  },
  textContainer: {
    marginTop: '1rem',
  },
  brandName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px',
  },
  brandLogo: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
  },
  cursor: {
    animation: 'blink 1s infinite',
    color: '#7C3AED',
  },
  dots: {
    color: '#94A3B8',
    fontWeight: 300,
  },
  tagline: {
    color: '#64748B',
    fontSize: '0.95rem',
  },
  progressWrapper: {
    margin: '2rem 0',
  },
  progressTrack: {
    width: '200px',
    height: '4px',
    background: '#E2E8F0',
    borderRadius: '2px',
    margin: '0 auto',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    width: '30%',
    background: 'linear-gradient(90deg, #10B981, #34D399)',
    borderRadius: '2px',
    animation: 'progress 2s ease-in-out infinite',
  },
  statusText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
    color: '#475569',
    fontSize: '0.9rem',
  },
  statusIcon: {
    color: '#10B981',
    animation: 'bounce 1s infinite',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#64748B',
    marginTop: '0.25rem',
  },
  statDivider: {
    width: '1px',
    background: '#E2E8F0',
  },
};

// Add animation styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(1deg); }
    }
    
    @keyframes pageFlip {
      0%, 100% { transform: perspective(400px) rotateY(0deg); }
      50% { transform: perspective(400px) rotateY(20deg); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    @keyframes progress {
      0% { left: -30%; }
      100% { left: 100%; }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default GlobalLoader;