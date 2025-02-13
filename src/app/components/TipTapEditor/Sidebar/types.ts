import { EDITOR_CONTEXT_STATE } from "@/src/types";

export interface PublishActionsProps {
  onDraft: () => void;
  onPublish: () => void;
  onDelete: () => void;
  isPublishing: boolean;
}

export interface ScheduleItemProps {
  scheduledAt: Date;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export interface MetricsItemProps {
  wordCount: number;
  characterCount: number;
}

export interface CommentsToggleProps {
  allowComments: boolean;
  onChange: () => void;
}

export interface PinnedToggleProps {
  isSticky: boolean;
  onChange: () => void;
}

export interface SlugInputProps {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
  isSlugEditable: boolean;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  setIsSlugEditable: (value: boolean) => void;
}

export interface SummaryInputProps {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
  handleChange: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
}
export interface PublishSectionProps {
  isSaving: boolean;
  isPublishing: boolean;
  onDraft: () => void;
  onPublish: () => void;
  onDelete: () => void;
}
