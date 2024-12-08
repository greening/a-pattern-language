import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import {
  allPatternsQuery,
  patternBySlugQuery,
  patternSiblingsByNumberQuery,
  type PatternBaseDto,
  type PatternDto,
  sectionsQuery,
  type SectionDto,
} from "@/sanity/lib/definitions";
import Pattern from "@/app/components/Pattern";
import PatternsSidebar from "@/app/components/PatternsSidebar";
import SectionSidebar from "@/app/components/SectionSidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: allPatternsQuery,
    perspective: "published",
    stega: false,
  });
  return data;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: pattern } = await sanityFetch({
    query: patternBySlugQuery,
    params,
    stega: false,
  });

  return {
    title: `${pattern.number ? `${pattern.number}. ` : ""}${pattern?.name}`,
    description: pattern?.problem,
  } satisfies Metadata;
}

export default async function PatternPage(props: Props) {
  const params = await props.params;
  const { data: pattern }: { data: PatternDto } = await sanityFetch({
    query: patternBySlugQuery,
    params,
  });

  if (!pattern?._id) return notFound();

  const {
    data: { previousPattern, nextPattern },
  }: {
    data: { previousPattern: PatternBaseDto; nextPattern: PatternBaseDto };
  } = await sanityFetch({
    query: patternSiblingsByNumberQuery,
    params: { number: pattern.number },
  });

  const { data: sections }: { data: SectionDto[] } = await sanityFetch({
    query: sectionsQuery,
  });

  console.log("Pattern", pattern);

  return (
    <>
      <Pattern
        pattern={pattern}
        previousPattern={previousPattern}
        nextPattern={nextPattern}
      />
      {pattern?.sidebarSection ? (
        <SectionSidebar sections={[pattern.sidebarSection]} showType="items" />
      ) : (
        <PatternsSidebar sections={sections} />
      )}
    </>
  );
}
