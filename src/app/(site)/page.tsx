import { sanityFetch } from '@/sanity/lib/live';
import { sectionsQuery, allPatternsQuery, type SectionDto, type PatternBaseDto } from '@/sanity/lib/definitions';
import Index from '@/app/components/Index';

export default async function Home() {
  const { data: sections }: { data: SectionDto[] } = await sanityFetch({
    query: sectionsQuery,
  });

  const { data: allPatterns }: { data: PatternBaseDto[] } = await sanityFetch({
    query: allPatternsQuery,
  });

  // Identify patterns that are not referenced in any section
  const referencedPatternIds = new Set<string>();
  
  // Collect all pattern IDs referenced in sections
  sections.forEach(section => {
    section.subSections.forEach(subSection => {
      if (subSection.patterns) {
        subSection.patterns.forEach(pattern => {
          referencedPatternIds.add(pattern._id);
        });
      }
    });
  });

  // Filter out patterns that are not referenced in any section
  const orphanedPatterns = allPatterns.filter(pattern => !referencedPatternIds.has(pattern._id));

  return <Index sections={sections} orphanedPatterns={orphanedPatterns} />;
}
