import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import { PostInsert, PostSelect } from "../types";
import { generateSlug } from "../utils";

// Hook for managing post updates
export const usePostManager = (initialPost: PostSelect | null) => {
  const queryClient = useQueryClient();
  const [post, setPost] = useState<PostInsert | null>(
    initialPost
      ? {
          ...initialPost,
          author_id: initialPost.author?.auth_id,
        }
      : null
  );
  const [isDirty, setIsDirty] = useState(false);
  const [hasError, setHasError] = useState(false);
  // Fields to exclude from API updates
  const excludedFields = [
    "featured_image",
    "published_at",
    "created_at",
    "updated_at",
    "tags",
    "author",
    "category",
  ] as const;

  const preparePostForUpdate = (postData: PostInsert): Partial<PostInsert> => {
    if (!postData) return {};

    // Create a new object without excluded fields
    const filteredPost = Object.entries(postData).reduce(
      (acc, [key, value]) => {
        if (!excludedFields.includes(key as (typeof excludedFields)[number])) {
          acc[key as keyof PostInsert] = value as any;
        }
        return acc;
      },
      {} as Partial<PostInsert>
    );

    return filteredPost;
  };

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ["post_update", post?.post_id],
    mutationFn: async (values: PostInsert) => {
      try {
        const filteredValues = preparePostForUpdate(values);
        const response = await axios.put<{
          data: PostSelect;
          message: string;
          lastUpdate: string | Date;
        }>(`/api/posts/${values.post_id}`, filteredValues);
        if (response.status < 200 || response.status >= 300) {
          throw new Error("Failed to update post");
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      setPost((prevPost) => ({
        ...prevPost,
        ...data.data,
        author_id: data.data.author?.auth_id,
      }));
      setIsDirty(false);
      setHasError(false);
      queryClient.invalidateQueries({
        queryKey: ["POST", post?.post_id],
        exact: true,
      });
    },
    onError: (error) => {
      setIsDirty(true);
      setHasError(true);
      console.error("Error saving post:", error);
    },
  });

  const debouncedSave = useRef(
    debounce((postData: PostInsert) => {
      mutate(postData);
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const updateField = useCallback(
    <K extends keyof PostInsert>(
      key: K,
      value: PostInsert[K],
      shouldAutosave = true,
      /**
       * Callback to call after the field is updated.
       */
      cb?: () => void,
      updateSlug = true
    ) => {
      if (!post) return;

      setPost((prev) => {
        if (!prev) return prev;
        const newPost = { ...prev, [key]: value };

        // Handle special cases like title -> slug
        if (key === "title" && updateSlug) {
          newPost.slug = generateSlug(value as string);
          console.log({
            title: value,
            slug: newPost.slug,
          });
        }

        // If autosave is enabled, save the updated post
        if (shouldAutosave) {
          debouncedSave(newPost);
        }

        return newPost;
      });
      cb?.();
      setIsDirty(true);
    },
    [post, debouncedSave]
  );
  const savePost = useCallback(() => {
    if (post && isDirty) {
      debouncedSave(post);
    }
  }, [post, isDirty, debouncedSave]);

  return {
    post,
    setPost,
    updateField,
    savePost,
    isDirty,
    isSaving: isLoading,
    hasError,
  };
};
