import { PatternBaseDto } from '@/sanity/lib/definitions';
import { usePathname } from 'next/navigation';
import PatternLink from './PatternLink';

interface PatternGroupProps {
  title: string;
  patterns: PatternBaseDto[];
  minimal?: boolean;
  onClick?: () => void;
}

/**
 * Displays a group of patterns with a title
 * Used for both categorized and uncategorized patterns
 */
const PatternGroup = ({ 
  title, 
  patterns, 
  minimal = false, 
  onClick 
}: PatternGroupProps) => {
  const pathname = usePathname();

  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm">
      <p className="uppercase text-xs py-1">{title}</p>
      <div className="flex flex-col">
        {patterns.map((pattern) => {
          const isActive = pathname?.includes(`/patterns/${pattern.slug}`);
          return (
            <PatternLink
              key={pattern._id}
              pattern={pattern}
              isActive={isActive}
              minimal={minimal}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatternGroup;
