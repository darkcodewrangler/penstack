import { Editor } from "@tiptap/core";
import { create } from "zustand";

type PenstackEditorState = {
  editor: Editor | null;
  isReady: boolean;
};
type PenstackEditorActions = {
  setEditor: (editor: Editor | null) => void;
};
type PenstackEditorStore = PenstackEditorState & PenstackEditorActions;
export const usePenstackEditorStore = create<PenstackEditorStore>((set) => ({
  editor: null,
  isReady: false,

  setEditor: (editor) => set({ editor }),
}));
