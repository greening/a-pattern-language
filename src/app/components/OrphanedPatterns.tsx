import { PatternBaseDto } from '@/sanity/lib/definitions';
import Link from 'next/link';
import PatternTitle from './PatternTitle';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

interface OrphanedPatternsProps {
  patterns: PatternBaseDto[];
  onClick?: () => void;
  minimal?: boolean;
}

const OrphanedPatterns = ({ patterns, onClick, minimal = false }: OrphanedPatternsProps) => {
  const pathname = usePathname();

  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm">
      <p className="uppercase text-xs py-1">Uncategorized Patterns</p>
      <div className="flex flex-col">
        {patterns.map((pattern) => {
          const isCurrentPattern = pathname?.includes(`/patterns/${pattern.slug}`);
          
          return (
            <Fragment key={pattern._id}>
              {isCurrentPattern ? (
                <div className="flex font-bold py-1">
                  {minimal ? (
                    <PatternTitle minimal number={pattern.number} name={pattern.name} />
                  ) : (
                    <>
                      <div className="w-17 shrink-0">{pattern.number}</div>
                      <div>{pattern.name}</div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href={`/patterns/${pattern.slug}`}
                  className="flex group py-1"
                  onClick={onClick}
                >
                  {minimal ? (
                    <PatternTitle minimal number={pattern.number} name={pattern.name} />
                  ) : (
                    <>
                      <div className="w-17 shrink-0">{pattern.number}</div>
                      <div className="group-hover:underline">{pattern.name}</div>
                    </>
                  )}
                </Link>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrphanedPatterns;
