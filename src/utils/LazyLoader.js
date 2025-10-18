"use client";
import { useState, useEffect, useRef } from "react";

/**
 * 🔹 Reusable Lazy Loader Component
 *
 * Props:
 * - totalItems: number — total data length
 * - initialCount: number — number of items to show initially
 * - increment: number — number of items to load per scroll
 * - onVisibleChange: function — callback(visibleCount)
 * - loadingText: string — optional text while loading
 */
export default function LazyLoader({
  totalItems = 0,
  initialCount = 12,
  increment = 12,
  onVisibleChange,
  loadingText = "Loading more...",
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const loaderRef = useRef(null);

  const hasMore = visibleCount < totalItems;

  // Notify parent when visible count changes
  useEffect(() => {
    onVisibleChange?.(visibleCount);
  }, [visibleCount, onVisibleChange]);

  // Reset when total items change (e.g., search results)
  useEffect(() => {
    setVisibleCount(initialCount);
  }, [totalItems, initialCount]);

  // Lazy load more on scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + increment, totalItems));
        }
      },
      { threshold: 1.0 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => el && observer.unobserve(el);
  }, [hasMore, increment, totalItems]);

  return (
    hasMore && (
      <div ref={loaderRef} className="text-center py-6 text-gray-500">
        {loadingText}
      </div>
    )
  );
}
