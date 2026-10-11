import { notFound } from "next/navigation";
import { VIEWS } from "@/components/features";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VIEWS).map((slug) => ({ slug }));
}

export default async function ViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const View = VIEWS[slug];
  if (!View) notFound();
  return <View />;
}