import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { objectToQueryParams } from "../utils";
import { TaxonomyItem } from "../types";

export const useCategories = ({
  sortBy,
  limit,
  page,
  canFetch = true,
  hasPostsOnly,
  sortOrder,
}: {
  sortBy?: "name" | "popular";
  page?: number;
  limit?: number;
  canFetch?: boolean;
  hasPostsOnly?: boolean;
  sortOrder?: "asc" | "desc";
} = {}) => {
  return useQuery({
    queryKey: [
      "categories",
      sortBy,
      limit,
      page,
      canFetch,
      hasPostsOnly,
      sortOrder,
    ],
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
        `/api/taxonomies/categories?${objectToQueryParams({ sortBy, limit, page, hasPostsOnly,sortOrder })}`
      );
      return {
        results: data.data,
        meta: data?.meta,
      };
    },
    enabled: canFetch,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
