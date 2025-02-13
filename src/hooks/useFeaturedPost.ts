import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostSelect } from "../types";

export function useFeaturedPost() {
  const {
    data: featuredPost,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["FEATURED_POST"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: PostSelect }>(
        `/api/posts/featured`
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 60 * 12,
  });

  return {
    featuredPost,
    loading,
    isError,
    error,
    refetch,
  };
}
