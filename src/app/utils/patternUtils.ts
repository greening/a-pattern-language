import { sanityFetch } from '@/sanity/lib/live';
import { sectionsQuery, allPatternsQuery, type SectionDto, type PatternBaseDto } from '@/sanity/lib/definitions';

// Cache for patterns and sections to avoid redundant fetches
let patternsCache: PatternBaseDto[] | null = null;
let sectionsCache: SectionDto[] | null = null;
let orphanedPatternsCache: PatternBaseDto[] | null = null;

/**
 * Fetches all patterns and sections, with caching to improve performance
 */
export async function fetchPatternsAndSections() {
  // Use cached data if available
  if (patternsCache && sectionsCache) {
    return {
      patterns: patternsCache,
      sections: sectionsCache,
      orphanedPatterns: orphanedPatternsCache || []
    };
  }

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

  // Cache the results
  patternsCache = patterns;
  sectionsCache = sections;
  orphanedPatternsCache = orphanedPatterns;

  return { 
    patterns, 
    sections, 
    orphanedPatterns 
  };
}

/**
 * Resets the cache, useful when data might have changed
 */
export function resetPatternCache() {
  patternsCache = null;
  sectionsCache = null;
  orphanedPatternsCache = null;
}
