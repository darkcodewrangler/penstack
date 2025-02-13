import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

import React, { ChangeEvent, useCallback, useState } from "react";

export const SummaryInput = ({
  summary,
  onChange,
}: {
  summary: string;
  onChange: (val: string) => void;
}) => {
  const [field, setField] = useState(summary || "");
  const onChangeCb = useCallback(
    (value: string) => {
      onChange?.(value);
    },
    [onChange]
  );
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = evt.target;

      setField(value);
      onChangeCb?.(value);
    },
    [onChangeCb]
  );
  console.log("SummaryInput rendered", { summary });
  return (
    <FormControl>
      <FormLabel>Summary:</FormLabel>
      <Textarea
        placeholder="summary"
        name="summary"
        value={field}
        onChange={handleChange}
        maxH={150}
        rounded="lg"
      />
    </FormControl>
  );
};
