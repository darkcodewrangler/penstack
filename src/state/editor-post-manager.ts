import { create } from "zustand";
import { PostInsert, PostSelect } from "../types";
import { debounce } from "lodash";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { generateSlug } from "../utils";

type EditorPostManagerState = {
  activePost: PostInsert | null;
  isDirty: boolean;
  isSaving: boolean;
  hasError: boolean;
  excludedFields: readonly string[];
};

type EditorPostManagerActions = {
  setPost: (post: PostSelect | null) => void;
  updateField: <K extends keyof PostInsert>(
    key: K,
    value: PostInsert[K],
    shouldAutosave?: boolean,
    cb?: () => void,
    updateSlug?: boolean
  ) => void;
  savePost: () => Promise<void>;
  setIsSaving: (isSaving: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
  setHasError: (hasError: boolean) => void;
};

export const useEditorPostManagerStore = create<
  EditorPostManagerState & EditorPostManagerActions
>((set, get) => {
  const debouncedSave = debounce(async (postData: PostInsert) => {
    try {
      set({ isSaving: true });
      const filteredValues = preparePostForUpdate(
        postData,
        get().excludedFields
      );
      const response = await axios.put<{
        data: PostSelect;
        message: string;
        lastUpdate: string | Date;
      }>(`/api/posts/${postData.post_id}`, filteredValues);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update post");
      }

      set((state) => ({
        activePost: {
          ...state.activePost,
          ...response.data.data,
          author_id: response.data.data.author?.auth_id,
        },
        isDirty: false,
        hasError: false,
        isSaving: false,
      }));
    } catch (error) {
      set({ isDirty: true, hasError: true, isSaving: false });
      console.error("Error saving post:", error);
    }
  }, 1000);

  return {
    activePost: null,
    isDirty: false,
    isSaving: false,
    hasError: false,
    excludedFields: [
      "featured_image",
      "published_at",
      "created_at",
      "updated_at",
      "tags",
      "author",
      "category",
    ],

    setPost: (post) =>
      set({
        activePost: post
          ? {
              ...post,
              author_id: post.author?.auth_id,
            }
          : null,
      }),

    updateField: (key, value, shouldAutosave = true, cb, updateSlug = true) => {
      const currentPost = get().activePost;
      if (!currentPost) return;

      const newPost = { ...currentPost, [key]: value };

      if (key === "title" && updateSlug) {
        newPost.slug = generateSlug(value as string);
      }

      set({ activePost: newPost, isDirty: true });
      cb?.();

      if (shouldAutosave) {
        debouncedSave(newPost);
      }
    },

    savePost: async () => {
      const { activePost: post, isDirty } = get();
      if (post && isDirty) {
        await debouncedSave(post);
      }
    },

    setIsSaving: (isSaving) => set({ isSaving }),
    setIsDirty: (isDirty) => set({ isDirty }),
    setHasError: (hasError) => set({ hasError }),
  };
});

function preparePostForUpdate(
  postData: PostInsert,
  excludedFields: readonly string[]
): Partial<PostInsert> {
  if (!postData) return {};

  return Object.entries(postData).reduce((acc, [key, value]) => {
    if (!excludedFields.includes(key)) {
      acc[key as keyof PostInsert] = value as any;
    }
    return acc;
  }, {} as Partial<PostInsert>);
}
