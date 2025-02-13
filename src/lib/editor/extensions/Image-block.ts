// import { ReactNodeViewRenderer, mergeAttributes, Node } from "@tiptap/react";

// export const CustomImageBlockExtension = Node.create({
//   name: "CustomImageBlock",
//   group: "block",
//   content: "inline*",
//   draggable: true,
//   isolating: true,
//   addAttributes() {
//     return {
//       src: {
//         default: null,
//       },
//       alt: {
//         default: null,
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: "custom-image-block",
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ["custom-image-block", mergeAttributes(HTMLAttributes)];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer();
//   },
// });
