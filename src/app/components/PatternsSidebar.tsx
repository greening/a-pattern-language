'use client';

import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import type { SectionDto, SubSectionDto, PatternBaseDto } from '@/sanity/lib/definitions';
import PatternTitle from '@/app/components/PatternTitle';
import PatternLink from '@/app/components/PatternLink';
import PatternGroup from '@/app/components/PatternGroup';

type PatternsSidebarProps = {
  sections: SectionDto[];
  orphanedPatterns?: PatternBaseDto[];
};

const PatternsSidebarContents = ({ sections, orphanedPatterns = [] }: PatternsSidebarProps) => {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const currentSection = useRef<HTMLDivElement>(null);
  const orphanedSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = container.current;
    const parent = content?.parentElement;
    
    // Check if current pattern is in the orphaned patterns
    const isOrphaned = orphanedPatterns.some(p => pathname.includes(p.slug));
    const pattern = isOrphaned ? orphanedSection.current : currentSection.current;
    
    if (!content || !parent || !pattern) return;

    const patternTop = pattern.offsetTop;
    const distanceFromTop = 16;

    parent.scrollTop = patternTop - distanceFromTop;
  }, [pathname, orphanedPatterns]);

  return (
    <div className="flex flex-col gap-y-8" ref={container}>
      {sections.map((section: SectionDto) => (
        <div key={section._id} className="flex flex-col gap-y-1">
          {/* If section has sub-sections with items and one of them is a page, render the section name as a link to the first page */}
          {section?.subSections?.some(subSection =>
            subSection.items?.some(item => item._type === 'page'),
          ) ? (
            <Link
              href={`/${section.subSections.find(subSection => subSection.items?.some(item => item._type === 'page'))?.items?.find(item => item._type === 'page')?.slug}`}
              className="uppercase text-xs hover:underline py-1"
            >
              {section.name}
            </Link>
          ) : (
            <Link href={`/#${section.name}`} className="uppercase text-xs hover:underline py-1">
              {section.name}
            </Link>
          )}

          {section?.subSections
            ?.filter(subSection => subSection.patterns?.length)
            .map((subSection: SubSectionDto) => (
              <div
                key={subSection._key}
                className="flex flex-col text-sm pb-4"
                ref={
                  subSection.patterns?.find(p => pathname.includes(p.slug)) ? currentSection : null
                }
              >
                {(subSection.title || subSection.description) && (
                  <div className="pb-1">
                    {subSection.title && <p className="text-xs uppercase">{subSection.title}</p>}
                    {subSection.description && <p className="text-xs">{subSection.description}</p>}
                  </div>
                )}
                {subSection.patterns?.map(pattern => (
                  <PatternLink
                    key={pattern._id}
                    pattern={pattern}
                    isActive={pathname.includes(pattern.slug)}
                    minimal={true}
                  />
                ))}
              </div>
            ))}
        </div>
      ))}
      
      {/* Display orphaned patterns if they exist */}
      {orphanedPatterns && orphanedPatterns.length > 0 && (
        <div ref={orphanedSection} className="flex flex-col gap-y-1">
          <PatternGroup
            title="Uncategorized Patterns"
            patterns={orphanedPatterns}
            minimal={true}
          />
        </div>
      )}
    </div>
  );
};

const PatternsSidebar = (props: PatternsSidebarProps) => {
  return <Sidebar title="Index" renderContent={() => <PatternsSidebarContents {...props} />} />;
};

export default PatternsSidebar;
