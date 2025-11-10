import { SourceType } from '@/data/faq-data';

export default function SourceBadge({ type }: { type: SourceType }) {
  const badges = {
    official: {
      emoji: '🏛️',
      text: '공식',
      color: 'bg-green-100 text-green-800',
    },
    medical: {
      emoji: '⚕️',
      text: '의료',
      color: 'bg-blue-100 text-blue-800',
    },
    reference: {
      emoji: '📰',
      text: '참고',
      color: 'bg-gray-100 text-gray-800',
    },
  };

  const badge = badges[type];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}
    >
      <span className="mr-1">{badge.emoji}</span>
      {badge.text}
    </span>
  );
}
