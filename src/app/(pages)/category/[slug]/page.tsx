import CategoryPage from "@/src/app/components/pages/CategoryPage";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const categoryName = params.slug
    .replace(/-/g, " ")
    .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase());

  return {
    title: `${categoryName} - Articles and Posts`,
    description: `Explore our collection of articles and posts in the ${categoryName} category. Find expert insights, tutorials, and in-depth content.`,
    keywords: [`${categoryName}`, "blog", "articles", "posts", "content"],
    openGraph: {
      title: `${categoryName} - Articles and Posts`,
      description: `Discover ${categoryName} articles and posts. Expert insights and in-depth content.`,
      type: "website",
      images: [
        {
          url: `/api/og?title=${categoryName} - Articles and Posts`,
          width: 1200,
          height: 630,
          alt: `${categoryName} category`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} - Articles and Posts`,
      description: `Explore ${categoryName} articles and posts. Expert insights and in-depth content.`,
    },
  };
}

export default function Page() {
  return <CategoryPage />;
}
