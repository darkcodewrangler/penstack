import { format } from "date-fns";
import { convertToDateFnsFormatAndSlug } from ".";
import { PostSelect } from "../types";

export const permalinkFormats = {
  custom: "/%custom%/",
  day_and_name: "/%year%/%month%/%day%/%postname%/",
  postname: "/%postname%/",
  month_and_name: "/%year%/%month%/%postname%/",
  plain: "/%post_id%/",
  category_and_name: "/%category%/%postname%/",
} as const;

type PermalinkType = keyof typeof permalinkFormats;

export function matchPermalink(
  url: string,
  type: PermalinkType
): Record<string, string> | null {
  const format = permalinkFormats[type];
  const formatParts = format.split("/").filter(Boolean);
  const urlParts = url.split("/").filter(Boolean);

  if (formatParts.length !== urlParts.length) {
    return null;
  }

  const result: Record<string, string> = {};

  for (let i = 0; i < formatParts.length; i++) {
    const formatPart = formatParts[i];
    const urlPart = urlParts[i];

    if (formatPart.startsWith("%") && formatPart.endsWith("%")) {
      const key = formatPart.slice(1, -1);
      result[key] = urlPart;
    } else if (formatPart !== urlPart) {
      return null;
    }
  }

  return result;
}

export function formatPostPermalink(
  post: PostSelect,
  prefix: string | "blog" = "blog",
  slugPattern?: string,
  includeSlugPattern = true
) {
  if (includeSlugPattern) {
    return `/${prefix}/${format(
      new Date(
        post?.published_at ? post?.published_at : (post?.updated_at as Date)
      ),
      convertToDateFnsFormatAndSlug(
        slugPattern || "%year%/%month%/%day%/%slug%"
      ).dateFormat
    )}/${post.slug}`;
  }

  return `/${prefix}/${post.slug}`;
}
