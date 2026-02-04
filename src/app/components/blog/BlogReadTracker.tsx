'use client';

import { useEffect, useRef } from 'react';
import { trackBlogRead } from '@/lib/analytics';

type BlogReadTrackerProps = {
  slug: string;
};

export default function BlogReadTracker({ slug }: BlogReadTrackerProps) {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const milestones = [25, 50, 75, 100] as const;
    const article = document.querySelector('article');
    if (!article) return;

    const observer = new IntersectionObserver(
      () => {
        const rect = article.getBoundingClientRect();
        const articleHeight = rect.height;
        const scrolledPast = Math.max(0, -rect.top);
        const viewportHeight = window.innerHeight;
        const readHeight = scrolledPast + viewportHeight;
        const percentage = Math.min(100, (readHeight / articleHeight) * 100);

        for (const milestone of milestones) {
          if (percentage >= milestone && !tracked.current.has(milestone)) {
            tracked.current.add(milestone);
            trackBlogRead(slug, milestone);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(article);

    const handleScroll = () => {
      const rect = article.getBoundingClientRect();
      const articleHeight = rect.height;
      const scrolledPast = Math.max(0, -rect.top);
      const viewportHeight = window.innerHeight;
      const readHeight = scrolledPast + viewportHeight;
      const percentage = Math.min(100, (readHeight / articleHeight) * 100);

      for (const milestone of milestones) {
        if (percentage >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          trackBlogRead(slug, milestone);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slug]);

  return null;
}
