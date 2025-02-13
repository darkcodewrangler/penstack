import { EDITOR_CONTEXT_STATE, PostInsert } from "@/src/types";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export const useHandlers = ({
  updateField,
  setIsPublishing,
}: {
  updateField: EDITOR_CONTEXT_STATE["updateField"];
  setIsPublishing: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });

  const onDraft = () => {
    updateField("status", "draft", undefined, () => {
      toast({ title: "Draft saved successfully" });
    });
  };

  const onPublish = () => {
    setIsPublishing(true);
    updateField("status", "published", undefined, () => {
      toast({ title: "Post published successfully" });
      setTimeout(() => {
        router.push("/dashboard/posts");
        setIsPublishing(false);
      }, 2000);
    });
  };

  const onDelete = () => {
    updateField("status", "deleted", undefined, () => {
      toast({ title: "Post deleted successfully" });
      setTimeout(() => {
        router.replace("/dashboard/posts");
      }, 2000);
    });
  };

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    updateField(name as keyof PostInsert, value);
  };

  return {
    onDraft,
    onPublish,
    onDelete,
    handleChange,
  };
};
