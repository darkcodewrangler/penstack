import PostPage from "@/src/app/components/pages/PostPage";

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/src/lib/queries/post";
import { decode } from "html-entities";
import { objectToQueryParams, shortenText, stripHtml } from "@/src/utils";

async function getData(slug: string) {
  try {
    return await getPost(slug);
  } catch (error) {
    console.log(error);

    return null;
  }
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];

  const post = await getData(postSlug);
  if (!post) return notFound();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title,
    description: shortenText(
      post.summary || stripHtml(decode(post.content)),
      200
    ),
    creator: post?.author?.name,
    authors: [{ name: post?.author?.name, url: "https://www.devvick.com" }],
    category: post?.category?.name,
    openGraph: {
      images: [
        ...previousImages,
        post?.featured_image?.url ||
          `/api/og?${objectToQueryParams({
            title: post.title,
            date: post?.published_at ? post?.published_at : post?.created_at,
            username: post?.author?.username,
            avatar: post?.author?.avatar,
            name: post?.author?.name,
            category: post?.category?.name,
          })}`,
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const slug = params.slug;
  const postSlug = slug[slug.length - 1];
  const post = await getData(postSlug);
  if (!post) return notFound();

  return <PostPage post={post as any} />;
}
