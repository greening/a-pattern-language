'use client';

import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import Sidebar from '@/app/components/Sidebar';
import type { SectionDto, SubSectionDto, PatternBaseDto } from '@/sanity/lib/definitions';
import PatternLink from '@/app/components/PatternLink';
import PatternGroup from '@/app/components/PatternGroup';
import SubSectionItems from '@/app/components/SubSectionItems';

type UnifiedSidebarProps = {
  sections: SectionDto[];
  orphanedPatterns?: PatternBaseDto[];
  selectedSection?: string;
  showType?: 'patterns' | 'items';
  linkSectionName?: boolean;
  title?: string;
  isPatternIndex?: boolean;
};

/**
 * A unified sidebar component that can be used for both the patterns index and section navigation
 */
const UnifiedSidebar = ({
  sections,
  orphanedPatterns = [],
  selectedSection,
  showType = 'patterns',
  linkSectionName = true,
  title = 'Table of Contents',
  isPatternIndex = false
}: UnifiedSidebarProps) => {
  const pathname = usePathname();
  
  const renderContent = (onClick?: () => void) => {
    // For pattern index, we need refs for scrolling
    const container = useRef<HTMLDivElement>(null);
    const currentSection = useRef<HTMLDivElement>(null);
    const orphanedSection = useRef<HTMLDivElement>(null);

    // Auto-scroll to current pattern section (only for pattern index)
    useEffect(() => {
      if (!isPatternIndex) return;
      
      const content = container.current;
      const parent = content?.parentElement;
      
      // Check if current pattern is in the orphaned patterns
      const isOrphaned = orphanedPatterns.some(p => pathname?.includes(`/patterns/${p.slug}`));
      const pattern = isOrphaned ? orphanedSection.current : currentSection.current;
      
      if (!content || !parent || !pattern) return;

      const patternTop = pattern.offsetTop;
      const distanceFromTop = 16;

      parent.scrollTop = patternTop - distanceFromTop;
    }, [pathname, orphanedPatterns]);

    return (
      <div className={isPatternIndex ? "flex flex-col gap-y-8" : ""} ref={isPatternIndex ? container : undefined}>
        {sections.map((section: SectionDto) => (
          <div key={section._id} className="flex flex-col text-sm">
            {/* Section title rendering */}
            {isPatternIndex ? (
              // Pattern index section title logic
              section?.subSections?.some(subSection =>
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
              )
            ) : (
              // Regular section title logic
              linkSectionName ? (
                <Link href={`#${section.name}`} className="uppercase text-xs hover:underline py-1">
                  {section.name}
                </Link>
              ) : (
                <p className="uppercase text-xs py-1">{section.name}</p>
              )
            )}

            {/* Subsection rendering */}
            {section?.subSections
              .filter(subSection => isPatternIndex ? subSection.patterns?.length : (showType === 'patterns' ? subSection.title : true))
              .map((subSection: SubSectionDto) => (
                <Fragment key={subSection._key}>
                  {isPatternIndex ? (
                    // Pattern index subsection rendering
                    <div
                      className="flex flex-col text-sm pb-4"
                      ref={
                        subSection.patterns?.find(p => pathname?.includes(`/patterns/${p.slug}`)) ? currentSection : null
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
                          isActive={pathname?.includes(`/patterns/${pattern.slug}`)}
                          minimal={true}
                        />
                      ))}
                    </div>
                  ) : (
                    // Regular subsection rendering
                    <>
                      {showType === 'patterns' && (
                        <Link
                          href={`#${subSection.title}`}
                          className={classNames({
                            'flex group py-1': true,
                            'font-bold': selectedSection === subSection._key,
                          })}
                          shallow
                          onClick={onClick}
                        >
                          {/* First pattern to last pattern */}
                          <>
                            {subSection.patterns && subSection.patterns.length > 1 && (
                              <div className="w-17 shrink-0">
                                {subSection.patterns[0].number}–
                                {Object.values(subSection.patterns).length -
                                  1 +
                                  subSection.patterns[0].number}
                              </div>
                            )}
                            <div className="group-hover:underline">{subSection.title}</div>
                          </>
                        </Link>
                      )}
                      {showType === 'items' && (
                        <SubSectionItems items={subSection.items} minimalTitles onClick={onClick} />
                      )}
                    </>
                  )}
                </Fragment>
              ))}
          </div>
        ))}
        
        {/* Display orphaned patterns if they exist */}
        {orphanedPatterns && orphanedPatterns.length > 0 && (
          <div 
            ref={isPatternIndex ? orphanedSection : undefined} 
            className="flex flex-col gap-y-1"
          >
            <PatternGroup
              title="Uncategorized Patterns"
              patterns={orphanedPatterns}
              minimal={isPatternIndex}
              onClick={onClick}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Sidebar
      title={title}
      renderContent={renderContent}
    />
  );
};

export default UnifiedSidebar;
