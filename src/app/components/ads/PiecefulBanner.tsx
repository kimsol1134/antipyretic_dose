interface PiecefulBannerProps {
  locale: string;
}

export default function PiecefulBanner({ locale }: PiecefulBannerProps) {
  return (
    <div className="mt-8 relative p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
      
      <div className="flex-shrink-0">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img 
          src="/images/pieceful-icon.png" 
          alt="Pieceful App Icon" 
          className="w-16 h-16 rounded-xl shadow-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {locale === 'ko' ? 'AI 육아일기, Pieceful' : 'Pieceful: AI Baby Journal'}
        </h3>
        <p className="text-gray-700 text-sm font-medium leading-relaxed">
          {locale === 'ko' 
            ? '방금 먹인 해열제, Pieceful로 3초 만에 기록하고 나중에 진료 받을때 바로 확인하세요' 
            : 'Record in 3 seconds with Pieceful and have it ready for the doctor.'}
        </p>
      </div>
      <a 
        href="https://apps.apple.com/us/app/pieceful-ai-baby-journal/id6756474655" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.55-.25-1.15-.42-1.69-.42-.5 0-1.12.18-1.74.43-1.04.45-2.08.52-3.07-.43-1.92-1.92-3.3-5.33-1.34-8.22 1.05-1.52 2.65-2.3 4.14-2.3 1.15 0 2.12.72 2.76.72.63 0 1.9-.78 3.16-.78 1.1 0 2.21.5 3.03 1.34-2.58 1.45-2.14 4.88.38 6.01-.58 1.55-1.38 2.87-2.55 3.25zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" />
        </svg>
        <span>{locale === 'ko' ? 'App Store에서 보기' : 'View on App Store'}</span>
      </a>
    </div>
  );
}
