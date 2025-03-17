import { sanityFetch } from '@/sanity/lib/live';
import { type SectionDto, type PatternBaseDto } from '@/sanity/lib/definitions';
import Index from '@/app/components/Index';
import { fetchPatternsAndSections } from '@/app/utils/patternUtils';

export default async function Home() {
  const { sections, orphanedPatterns } = await fetchPatternsAndSections();

  return <Index sections={sections} orphanedPatterns={orphanedPatterns} />;
}
