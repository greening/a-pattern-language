import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { notFound } from 'next/navigation';
import {
  allPatternsQuery,
  patternBySlugQuery,
  type PatternDto,
  type SectionDto,
  type PatternBaseDto,
} from '@/sanity/lib/definitions';
import Pattern from '@/app/components/Pattern';
import UnifiedSidebar from '@/app/components/UnifiedSidebar';
import portableTextToPlainText from '@/app/helpers/portableTextToPlainText';
import { urlFor } from '@/sanity/lib/image';
import { fetchPatternsAndSections } from '@/app/utils/patternUtils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: allPatternsQuery,
    perspective: 'published',
    stega: false,
  });
  return data;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: pattern }: { data: PatternDto } = await sanityFetch({
    query: patternBySlugQuery,
    params,
    stega: false,
  });

  const image = pattern?.image || pattern?.diagram;

  const imagesArray = image ? [{ url: urlFor(image).width(800).url() }] : [];

  return {
    title: `${pattern?.number ? `${pattern.number}. ` : ''}${pattern?.name}`,
    description: pattern?.isPatternGuide
      ? portableTextToPlainText(pattern.earlierPatterns)
      : pattern?.problem,
    openGraph: {
      images: imagesArray,
    },
  } satisfies Metadata;
}

export default async function PatternPage(props: Props) {
  const params = await props.params;
  const { data: pattern }: { data: PatternDto } = await sanityFetch({
    query: patternBySlugQuery,
    params,
  });

  if (!pattern?._id) return notFound();

  const { sections, orphanedPatterns } = await fetchPatternsAndSections();

  return (
    <>
      <Pattern pattern={pattern} />
      {pattern?.sidebarSection ? (
        <UnifiedSidebar 
          sections={[pattern.sidebarSection]} 
          showType="items" 
          title="Pattern Contents" 
        />
      ) : (
        <UnifiedSidebar 
          sections={sections} 
          orphanedPatterns={orphanedPatterns} 
          title="Index" 
          isPatternIndex={true} 
        />
      )}
    </>
  );
}
