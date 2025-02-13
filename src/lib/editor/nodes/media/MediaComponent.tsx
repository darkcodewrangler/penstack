import React, { useState, useRef, useEffect, useCallback } from "react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableBox } from "react-resizable";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuTrash2,
  LuImage,
  LuMaximize2,
  LuMinimize2,
} from "react-icons/lu";
import { Image } from "@chakra-ui/react";

interface MediaComponentProps extends NodeViewProps {
  isRendering?: boolean;
}

const sizePresets = {
  small: 300,
  medium: 450,
  large: 600,
  full: "100%",
} as const;

// Update queue handler
class UpdateQueue {
  private queue: Array<() => void> = [];
  private isProcessing = false;

  enqueue(update: () => void) {
    this.queue.push(update);
    if (!this.isProcessing) {
      this.process();
    }
  }

  private process() {
    this.isProcessing = true;
    Promise.resolve().then(() => {
      while (this.queue.length > 0) {
        const update = this.queue.shift();
        if (update) update();
      }
      this.isProcessing = false;
    });
  }
}

export const MediaComponent: React.FC<MediaComponentProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const updateQueueRef = useRef(new UpdateQueue());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalDimensions, setInternalDimensions] = useState({
    width:
      node.attrs.width ||
      sizePresets[node.attrs.size as keyof typeof sizePresets] ||
      sizePresets.medium,
    height: node.attrs.height || "auto",
  });

  // Safe update wrapper
  const safeUpdateAttributes = useCallback(
    (attrs: Record<string, any>) => {
      updateQueueRef.current.enqueue(() => {
        updateAttributes(attrs);
      });
    },
    [updateAttributes]
  );

  // Container width observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (node.attrs.size === "full") {
          const newWidth = entry.contentRect.width;
          setInternalDimensions((prev) => ({ ...prev, width: newWidth }));

          updateQueueRef.current.enqueue(() => {
            updateAttributes({ width: newWidth });
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current.parentElement as Element);
    return () => resizeObserver.disconnect();
  }, [node.attrs.size, updateAttributes]);

  // Debounced resize handler
  const handleResize = useCallback(
    (
      e: React.SyntheticEvent,
      { size }: { size: { width: number; height: number } }
    ) => {
      const { width, height } = size;
      setInternalDimensions({ width, height });
    },
    []
  );

  const handleResizeStop = useCallback(
    (
      _e: React.SyntheticEvent,
      { size }: { size: { width: number; height: number } }
    ) => {
      const { width, height } = size;
      const closestPreset = Object.entries(sizePresets).reduce(
        (prev, [key, value]) => {
          if (typeof value === "number") {
            return Math.abs(value - width) <
              Math.abs((typeof prev[1] === "number" ? prev[1] : 0) - width)
              ? [key, value]
              : prev;
          }
          return prev;
        }
      )[0];

      safeUpdateAttributes({ width, height, size: closestPreset });
    },
    [safeUpdateAttributes]
  );

  const handleAlign = useCallback(
    (position: string) => {
      safeUpdateAttributes({ position });
    },
    [safeUpdateAttributes]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  if (!node.attrs.url) {
    return (
      <NodeViewWrapper>
        <div className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition-colors hover:bg-gray-100">
          <button
            onClick={() => {
              /* Implement media modal open */
            }}
            className="px-6 py-3 text-sm font-medium text-brand-600 bg-white rounded-md shadow-sm hover:bg-brand-50 transition-colors"
          >
            <LuImage className="w-5 h-5 mr-2 inline-block" />
            Insert Media
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  const mediaContent = (
    <div className={`relative`}>
      {node.attrs.type === "image" ? (
        <Image
          src={node.attrs.url}
          alt={node.attrs.alt || ""}
          className={`w-full h-auto object-contain ${isFullscreen ? "max-h-screen" : ""}`}
          loading="lazy"
        />
      ) : (
        <div className="aspect-w-16 aspect-h-9">
          <video
            controls
            className="w-full h-full"
            controlsList="nodownload"
            preload="metadata"
          >
            <source src={node.attrs.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );

  return (
    <NodeViewWrapper>
      <div
        ref={containerRef}
        className={`group relative ${selected ? "ring-2 ring-brand-500 ring-offset-2" : ""}`}
        style={{
          width: isFullscreen ? "100vw" : internalDimensions.width,
          marginLeft: node.attrs.position === "center" ? "auto" : undefined,
          marginRight: node.attrs.position === "center" ? "auto" : undefined,
          // float: ["left", "right"].includes(node.attrs.position)
          //   ? node.attrs.position
          //   : undefined,
        }}
      >
        {/* Toolbar */}
        <div
          className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity
            flex items-center gap-1 bg-white shadow-lg rounded-lg p-1.5 z-50"
          onMouseDown={(e) => e.preventDefault()} // Prevent editor blur
        >
          <button
            onClick={() => handleAlign("left")}
            className={`p-1.5 rounded hover:bg-gray-100 ${node.attrs.position === "left" ? "bg-gray-200" : ""}`}
            title="Align left"
          >
            <LuAlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlign("center")}
            className={`p-1.5 rounded hover:bg-gray-100 ${node.attrs.position === "center" ? "bg-gray-200" : ""}`}
            title="Center"
          >
            <LuAlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlign("right")}
            className={`p-1.5 rounded hover:bg-gray-100 ${node.attrs.position === "right" ? "bg-gray-200" : ""}`}
            title="Align right"
          >
            <LuAlignRight className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-gray-100"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <LuMinimize2 className="w-4 h-4" />
            ) : (
              <LuMaximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => deleteNode()}
            className="p-1.5 rounded hover:bg-red-100 text-red-600"
            title="Delete"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Resizable Content */}
        {!isFullscreen ? (
          <ResizableBox
            width={internalDimensions.width as number}
            height={
              internalDimensions.height === "auto"
                ? 0
                : (internalDimensions.height as number)
            }
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            minConstraints={[200, 0]}
            maxConstraints={[
              containerRef.current?.parentElement?.clientWidth || 1000,
              2000,
            ]}
            resizeHandles={["se", "sw", "e", "w"]}
            className="relative"
          >
            {mediaContent}
          </ResizableBox>
        ) : (
          mediaContent
        )}

        {/* Caption */}
        {node.attrs.caption && (
          <figcaption className="text-sm text-gray-600 mt-2 text-center">
            {node.attrs.caption}
          </figcaption>
        )}
      </div>
    </NodeViewWrapper>
  );
};
MediaComponent.displayName = "MediaComponent";
