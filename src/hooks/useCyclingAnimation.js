import { useState, useEffect, useRef, useCallback } from 'react';

const useCyclingAnimation = (items, options = {}) => {
  const {
    intervalDuration = 3000,
    animationDuration = 900,
    autoStart = true
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    if (items?.length) {
      setTimeout(() => {
        setShowContent(true);
      }, 700);
    }
  }, [items]);

  const startAnimation = useCallback(() => {
    if (!items?.length || !showContent || isPaused) return;

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    animationIntervalRef.current = setInterval(() => {
      
      setAnimationClass('animate-slideOutUp');
      
      // After exit animation, change item and start enter animation
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setAnimationClass('animate-slideInDown');
        
        // Reset animation class after enter animation completes
        setTimeout(() => {
          setAnimationClass('');
        }, animationDuration);
      }, animationDuration);
    }, intervalDuration);
  }, [items, showContent, isPaused, intervalDuration, animationDuration]);

  const stopAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
    stopAnimation();
  }, [stopAnimation]);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Handle animation based on pause state and autoStart
  useEffect(() => {
    if (autoStart && !isPaused) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [autoStart, isPaused, startAnimation, stopAnimation]);

  const getCurrentItem = () => {
    if (!items?.length) return null;
    return items[currentIndex];
  };

  return {
    currentIndex,
    currentItem: getCurrentItem(),
    animationClass,
    showContent,
    isPaused,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    startAnimation: () => {
      setIsPaused(false);
      startAnimation();
    }
  };
};

export default useCyclingAnimation;