import { PatternBaseDto } from '@/sanity/lib/definitions';
import Link from 'next/link';
import PatternTitle from './PatternTitle';

interface OrphanedPatternsProps {
  patterns: PatternBaseDto[];
  onClick?: () => void;
}

const OrphanedPatterns = ({ patterns, onClick }: OrphanedPatternsProps) => {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm">
      <p className="uppercase text-xs py-1">Uncategorized Patterns</p>
      <div className="flex flex-col">
        {patterns.map((pattern) => (
          <Link
            key={pattern._id}
            href={`/patterns/${pattern.slug}`}
            className="flex group py-1"
            onClick={onClick}
          >
            <div className="w-17 shrink-0">{pattern.number}</div>
            <div className="group-hover:underline">{pattern.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrphanedPatterns;
