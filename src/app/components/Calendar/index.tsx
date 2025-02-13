import React, { ReactNode, useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  isToday,
  addYears,
  subYears,
} from "date-fns";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { TimePicker } from "./TimePicker";
import {
  extractFullTimeString,
  mergeTimeStringWithDate,
} from "@/src/lib/cron/helper";
import { HStack, Stack } from "@chakra-ui/react";
import TimezonePicker from "./TimezonePicker";

interface CalendarDataItem {
  day: number;
  dayOfWeek: string;
  isToday: boolean;
}

interface CalendarData {
  name: string;
  days: CalendarDataItem[];
}

interface CalendarProps {
  defaultValue?: Date;
  onDone?: (date: Date) => void;
  onCancel?: () => void;
  onDateSelect?: (date: Date) => void;
  onTimezoneChange?: (timezone: string) => void;
  /**
   * The start date of the calendar. Defaults to the current date.
   */
  startDate?: Date;
  /**
   * The end date of the calendar. Defaults to the 10 years from the current date.
   */
  endDate?: Date;
  footer?: ReactNode;
}
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendarData(date: Date): CalendarData {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthData = {
    name: MONTHS[month],
    days: Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      dayOfWeek: DAYS_OF_WEEK[(firstDayOfMonth + i) % 7],
      isToday: isToday(new Date(year, month, i + 1)),
    })),
  };

  return monthData;
}

const Calendar: React.FC<CalendarProps> = ({
  defaultValue = new Date(),
  onDateSelect = () => {},
  onCancel,
  onDone = () => {},
  onTimezoneChange = () => {},
  startDate: _startDate = new Date(),
  endDate: _endDate = addYears(new Date(), 10),
  footer,
}) => {
  const [currentDate, setCurrentDate] = useState(defaultValue);
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue);
  const [disablePrevBtn, setDisablePrevBtn] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(false);
  const [startDate, setStartDate] = useState(_startDate);
  const [endDate, setEndDate] = useState(_endDate);
  const handlePrevMonth = () => {
    if (currentDate.getTime() <= startDate.getTime()) {
      return;
    }
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    if (currentDate.getTime() >= endDate.getTime()) {
      return;
    }
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);
    if (typeof onDateSelect === "function") {
      onDateSelect?.(selectedDate);
    }
  };

  const currentMonthData = generateCalendarData(currentDate);
  useEffect(() => {
    setDisablePrevBtn(currentDate.getTime() <= startDate.getTime());
  }, [currentDate, startDate]);
  useEffect(() => {
    setDisableNextBtn(currentDate.getTime() >= endDate.getTime());
  }, [currentDate, endDate]);
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          aria-label="Previous Month"
          disabled={disablePrevBtn}
          className="prev-month"
          onClick={handlePrevMonth}
        >
          <LuChevronLeft />
        </button>
        <div className="current-month">{format(currentDate, "MMMM yyyy")}</div>
        <button
          aria-label="Next Month"
          disabled={disableNextBtn}
          className="next-month"
          onClick={handleNextMonth}
        >
          <LuChevronRight />
        </button>
      </div>
      <div className="week-days">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="week-day">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          .slice(0, DAYS_OF_WEEK.indexOf(currentMonthData.days[0].dayOfWeek))
          .map((_, i) => (
            <div key={`empty-${i}`} className="day empty"></div>
          ))}
        {currentMonthData.days.map(({ day, isToday, dayOfWeek }) => {
          const isSelected =
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === currentDate.getMonth() &&
            selectedDate?.getFullYear() === currentDate.getFullYear();
          return (
            <button
              key={day}
              tabIndex={isSelected ? 0 : -1}
              className={`day ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleDayClick(day)}
              type="button"
            >
              {day}
            </button>
          );
        })}
      </div>
      {footer ? (
        footer
      ) : (
        <Stack justify="space-between" mt={4}>
          <HStack
            align={"center"}
            my={4}
            justify={"space-between"}
            px={1}
            wrap={"wrap"}
          >
            <TimezonePicker
              onChange={(timezone) => {
                onTimezoneChange?.(timezone);
              }}
            />
            <TimePicker
              value={selectedDate ? (selectedDate as Date) : currentDate}
              onChange={(val) => {
                if (val)
                  setSelectedDate(
                    mergeTimeStringWithDate(val, selectedDate as Date)
                  );
              }}
            />
          </HStack>
          <div className="calendar-footer">
            <button
              className="cancel-button"
              onClick={() => {
                onCancel?.();
                setSelectedDate(null);
              }}
            >
              Cancel
            </button>
            <button
              className="done-button"
              onClick={() => {
                console.log({ selectedDate });

                onDone?.(selectedDate as Date);
                onDateSelect?.(selectedDate as Date);
              }}
            >
              Done
            </button>
          </div>
        </Stack>
      )}
    </div>
  );
};

export default Calendar;
