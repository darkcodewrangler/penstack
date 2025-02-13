import { Box, useColorModeValue, Input } from "@chakra-ui/react";

import { ChangeEvent, useCallback, useState } from "react";
import { useCustomEditorContext } from "@/src/context/AppEditor";

export const TitleInput = ({
  onChange,
}: {
  onChange?: (title: string) => void;
}) => {
  const { activePost, updateField } = useCustomEditorContext();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [title, setTitle] = useState(activePost?.title || "");

  const onChangeCb = useCallback(
    (value: string) => {
      onChange?.(value);
    },
    [onChange]
  );
  const handleTitleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.target;

      onChangeCb(value);
      setTitle(value);
      updateField("title", value, true);
    },
    [onChangeCb, updateField]
  );

  return (
    <Box borderBottom="1px" borderBottomColor={borderColor} p={1} py={2}>
      <Input
        border="none"
        outline="none"
        autoComplete="off"
        placeholder="Awesome title"
        name="title"
        value={title}
        fontWeight={600}
        onChange={handleTitleChange}
        rounded="none"
        _focus={{ boxShadow: "none" }}
        fontSize={{ base: "x-large", md: "xx-large" }}
      />
    </Box>
  );
};

TitleInput.displayName = "TitleInput";
