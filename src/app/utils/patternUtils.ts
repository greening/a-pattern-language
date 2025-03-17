import { sanityFetch } from '@/sanity/lib/live';
import { sectionsQuery, allPatternsQuery, type SectionDto, type PatternBaseDto } from '@/sanity/lib/definitions';
import { cache } from 'react';

/**
 * Fetches all patterns and sections with React's cache
 */
export const fetchPatternsAndSections = cache(async () => {
  // Fetch data in parallel
  const [patternsResponse, sectionsResponse] = await Promise.all([
    sanityFetch({ query: allPatternsQuery }),
    sanityFetch({ query: sectionsQuery })
  ]);

  const patterns = patternsResponse.data as PatternBaseDto[];
  const sections = sectionsResponse.data as SectionDto[];

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
  const orphanedPatterns = patterns.filter(pattern => !referencedPatternIds.has(pattern._id));

  return { 
    patterns, 
    sections, 
    orphanedPatterns 
  };
});

// Global variable to track if we need to bypass cache
let shouldBypassCache = false;

/**
 * Triggers a refresh of the pattern data on next fetch
 */
export function refreshPatternData() {
  shouldBypassCache = true;
}
