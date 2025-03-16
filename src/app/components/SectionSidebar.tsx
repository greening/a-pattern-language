'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import type { SectionDto, PatternBaseDto } from '@/sanity/lib/definitions';
import SubSectionItems from '@/app/components/SubSectionItems';
import Sidebar from '@/app/components/Sidebar';
import OrphanedPatterns from '@/app/components/OrphanedPatterns';

type SectionSidebarProps = {
  sections: SectionDto[];
  selectedSection?: string;
  showType?: 'patterns' | 'items';
  linkSectionName?: boolean;
  onClick?: () => void;
  orphanedPatterns?: PatternBaseDto[];
};

const SectionSidebarContents = ({
  sections,
  selectedSection,
  showType = 'patterns',
  linkSectionName = true,
  onClick,
  orphanedPatterns = [],
}: SectionSidebarProps) => (
  <>
    {sections.map(section => (
      <div key={section._id} className="flex flex-col text-sm">
        {linkSectionName && (
          <Link href={`#${section.name}`} className="uppercase text-xs hover:underline py-1">
            {section.name}
          </Link>
        )}
        {!linkSectionName && <p className="uppercase text-xs py-1">{section.name}</p>}
        {/* Don't print empty subSection without title on index page, but print on pages */}
        {section?.subSections
          .filter(subSection => (showType === 'patterns' ? subSection.title : true))
          .map(subSection => (
            <Fragment key={subSection._key}>
              {showType === 'patterns' && (
                <Link
                  key={subSection._key}
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
            </Fragment>
          ))}
      </div>
    ))}
    
    {/* Display orphaned patterns if they exist */}
    {orphanedPatterns && orphanedPatterns.length > 0 && (
      <OrphanedPatterns patterns={orphanedPatterns} onClick={onClick} />
    )}
  </>
);

const SectionSidebar = (props: SectionSidebarProps) => {
  return (
    <Sidebar
      title="Table of Contents"
      renderContent={onClick => <SectionSidebarContents {...props} onClick={onClick} />}
    />
  );
};

export default SectionSidebar;
