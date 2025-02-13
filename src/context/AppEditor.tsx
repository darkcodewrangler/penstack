import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PostSelect, type EDITOR_CONTEXT_STATE } from "../types";
import { type Editor } from "@tiptap/react";
import isEmpty from "just-is-empty";
import { usePostManager } from "../hooks/usePostEditorManager";

const AppEditorContext = createContext<EDITOR_CONTEXT_STATE>({
  hasError: false,
  isSaving: false,
  isDirty: false,
  updateField: () => {},
  savePost: () => {},
  formik: null,
  updatePost: () => {},
  editor: null,
  setEditor: () => {},
  activePost: null,
  setActivePost: () => {},
  content: {
    text: "",
    html: "",
  },
  setEditorContent: () => {},
  setIsSaving: () => {},
  initialContent: "",
  setInitialContent: () => {},
  markdownContent: "",
  clearEditor: () => {},
  isEditorReady: false,
  meta: {
    wordCount: 0,
    characterCount: 0,
  },
});

export const AppEditorContextProvider = ({
  children,
  post: initialPost,
}: {
  children: ReactNode;
  post: PostSelect | null;
}) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorContent, setEditorContent] = useState<
    EDITOR_CONTEXT_STATE["content"]
  >({
    text: "",
    html: "",
  });
  const [initialContent, setInitialContent] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [meta, setMeta] = useState({
    wordCount: 0,
    characterCount: 0,
  });

  const {
    post: activePost,
    setPost: setActivePost,
    updateField,
    savePost,
    isDirty,
    isSaving,
    hasError,
  } = usePostManager(initialPost);

  useEffect(() => {
    setIsEditorReady(!isEmpty(editor));
  }, [editor]);

  const contextValue = {
    isSaving,
    isDirty,
    updateField,
    savePost,
    content: editorContent,
    setActivePost,
    activePost: activePost as PostSelect | null,
    setEditorContent,
    initialContent,
    setInitialContent,
    markdownContent,
    clearEditor: useCallback(() => {
      setEditorContent({
        text: "",
        html: "",
      });
      editor?.commands?.setContent("");
    }, [editor]),
    isEditorReady,
    editor,
    setEditor,
    meta,
    hasError,
  };

  return (
    <AppEditorContext.Provider value={contextValue}>
      {children}
    </AppEditorContext.Provider>
  );
};
export const useCustomEditorContext = () => {
  const context = useContext(AppEditorContext);
  if (!context) {
    throw new Error(
      "useCustomEditorContext must be used within a AppEditorContextProvider"
    );
  }
  return context;
};
