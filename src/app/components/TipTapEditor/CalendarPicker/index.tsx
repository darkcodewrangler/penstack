import { ReactNode, useMemo, useRef, useState } from "react";
import Calendar from "../../Calendar";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
  useToast,
} from "@chakra-ui/react";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CRON_REQUEST_METHOD, CronJobPayload } from "@/src/lib/cron";
import { dateTimeToCronJobSchedule } from "@/src/lib/cron/helper";
import { addMinutes } from "date-fns";

export const CalendarPicker = ({
  defaultValue,
  isOpen,
  onClose,
  trigger,
}: {
  defaultValue?: Date;
  isOpen: boolean;
  onClose: () => void;
  trigger: ReactNode;
}) => {
  const popRef = useRef(null);
  useOutsideClick({
    ref: popRef,
    handler: onClose,
  });
  const { updateField, activePost } = useCustomEditorContext();
  const defaultTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );
  const [timezone, setTimezone] = useState<string>(defaultTimezone);
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  const { mutateAsync } = useMutation({
    mutationFn: async (bodyData: CronJobPayload) => {
      const { data } = await axios.post("/api/cron", bodyData);

      return data?.data;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
      });
    },
  });
  function onDone(date: Date) {
    onClose();
    const payload: CronJobPayload = {
      job: {
        notification: {
          onFailure: true,
          onSuccess: true,
          onDisable: true,
        },
        url: "/api/schedules/auto-publish",
        enabled: true,
        title: activePost?.title || "Post schedule",
        schedule: {
          ...dateTimeToCronJobSchedule(new Date(date)),
          timezone,
          expiresAt: addMinutes(new Date(date), 60).toTimeString(),
        },
        saveResponses: true,
        requestMethod: CRON_REQUEST_METHOD.PUT,
        extendedData: {
          body: JSON.stringify({
            post_id: activePost?.post_id,
          }),
        },
      },
    };
    mutateAsync(payload).then((result) => {
      updateField("scheduled_at", date);
      updateField("schedule_id", result?.jobId);
      toast({ title: "Scheduled successfully" });
    });
  }
  function onCancel() {
    onClose();
  }
  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent
          ref={popRef}
          border={0}
          p={0}
          rounded={"2xl"}
          _dark={{ bg: "#1a202c" }}
        >
          <PopoverBody>
            <Calendar
              onCancel={onCancel}
              onDone={onDone}
              defaultValue={defaultValue}
              onTimezoneChange={(timezone) => {
                setTimezone(timezone);
              }}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
