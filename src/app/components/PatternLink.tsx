import { PatternBaseDto } from '@/sanity/lib/definitions';
import Link from 'next/link';
import PatternTitle from './PatternTitle';

interface PatternLinkProps {
  pattern: PatternBaseDto;
  isActive?: boolean;
  minimal?: boolean;
  onClick?: () => void;
}

/**
 * A unified component for rendering pattern links or active pattern displays
 * Used in both section sidebars and for orphaned patterns
 */
const PatternLink = ({ 
  pattern, 
  isActive = false, 
  minimal = false,
  onClick 
}: PatternLinkProps) => {
  const content = minimal ? (
    <PatternTitle minimal number={pattern.number} name={pattern.name} />
  ) : (
    <>
      <div className="w-17 shrink-0">{pattern.number}</div>
      <div className={isActive ? "" : "group-hover:underline"}>{pattern.name}</div>
    </>
  );

  if (isActive) {
    return (
      <div className="flex font-bold py-1">{content}</div>
    );
  }

  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="flex group py-1"
      onClick={onClick}
    >
      {content}
    </Link>
  );
};

export default PatternLink;
