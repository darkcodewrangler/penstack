import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";
import { TaxonomyItem } from "../types";

export const useTags = ({
  sortBy,
  page,
  limit,
  hasPostsOnly,
  sortOrder,
}: {
  sortBy?: "name" | "popular";

  page?: number;
  limit?: number;
  hasPostsOnly?: boolean;
  sortOrder?: "asc" | "desc";
} = {}) => {
  return useQuery({
    queryHash: "",
    queryKey: ["tags", sortBy, page, limit, hasPostsOnly, sortOrder],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: TaxonomyItem[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `/api/taxonomies/tags?${objectToQueryParams({ sortBy, page, limit, hasPostsOnly, sortOrder })}`
      );
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};
