'use client';

import { useEffect, useRef } from 'react';

const AD_CONFIG = {
  mobile: {
    unit: 'DAN-dRB8XRH0shypcVhz',
    width: '320',
    height: '100',
  },
  desktop: {
    unit: 'DAN-9aoOvvyA8RxfE7R1',
    width: '728',
    height: '90',
  },
} as const;

export default function KakaoAdFitBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous ad if any (though normally valid for simple mount)
    containerRef.current.innerHTML = '';

    const width = window.innerWidth;
    const isMobile = width < 768; // Standard md breakpoint
    const config = isMobile ? AD_CONFIG.mobile : AD_CONFIG.desktop;

    // Create ins element
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', config.unit);
    ins.setAttribute('data-ad-width', config.width);
    ins.setAttribute('data-ad-height', config.height);

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    // Append to container
    containerRef.current.appendChild(ins);
    containerRef.current.appendChild(script);

    // Cleanup not typically needed for ad script itself, but good practice if component unmounts quickly
    // However, AdFit scripts might not like being removed/re-added frequently.
    // Given this remains static on the page, simple append is safe.
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
       <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
