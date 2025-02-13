import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { eq, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getPost = unstable_cache(
  async (slugOrPostId: string) => {
    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) =>
        or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId)),
      with: {
        views: {
          columns: { id: true },
        },
        featured_image: {
          columns: {
            url: true,
            alt_text: true,
            caption: true,
          },
        },
        author: {
          columns: {
            username: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    const tags = post?.tags?.length ? post?.tags.map((t) => t.tag) : [];

    const viewsCount = post?.views?.length;

    if (!post) return null;

    const transformedPost = { ...post, tags, views: { count: viewsCount } };
    return transformedPost;
  },
  ["getPost"],
  { revalidate: 60 }
);

export const getPlainPost = unstable_cache(
  async (slugOrPostId: string) => {
    return await db.query.posts.findFirst({
      where: or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId)),
    });
  },
  ["getPlainPost"],
  { revalidate: 60 }
);
