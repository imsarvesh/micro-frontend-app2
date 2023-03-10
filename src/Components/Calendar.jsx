import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
} from "date-fns";
import { useEffect, useState } from "react";
import { startOfToday } from "date-fns";

import { getMeetings } from "../service/request";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const [meetings, setMeetings] = useState([]);
  let today = startOfToday();

  console.log({ today });

  let [selectedDay, setSelectedDay] = useState(today);

  let [currentMonth, setCurrentMonth] = useState(
    format(selectedDay, "MMM-yyyy")
  );
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const onSelect = (day) => {
    setSelectedDay(day);
    const selectedDay = new CustomEvent("SELECTED_DAY", {
      detail: { selectedDay: day },
    });
    window.dispatchEvent(selectedDay);
  };

  useEffect(() => {
    getMeetings().then(setMeetings);

    window.addEventListener("SELECTED_MEETING", ({ detail }) => {
      // setSelectedDay(new Date(detail.selectedMeeting.startDatetime));
      // setCurrentMonth(format(selectedDay, "MMM-yyyy"));
      const day = new Date(detail.selectedMeeting.startDatetime);
      setSelectedDay(day);
      setCurrentMonth(format(day, "MMM-yyyy"));

      console.log(new Date(detail.selectedMeeting.startDatetime));
    });
  }, [selectedDay]);

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    console.log({ firstDayNextMonth });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  return (
    <div className="">
      <div className="md:pr-14">
        <div className="flex items-center">
          <h2 className="flex-auto font-semibold text-gray-900">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  console.log({ day: typeof day });
                  onSelect(day);
                }}
                className={classNames(
                  isSameDay(day, selectedDay) && "text-white",
                  !isSameDay(day, selectedDay) &&
                    isToday(day) &&
                    "text-red-500",
                  !isSameDay(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-900",
                  !isSameDay(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-400",
                  isSameDay(day, selectedDay) && isToday(day) && "bg-red-500",
                  isSameDay(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  !isSameDay(day, selectedDay) && "hover:bg-gray-200",
                  (isSameDay(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>

              <div className="w-1 h-1 mx-auto mt-1">
                {meetings.some((meeting) =>
                  isSameDay(parseISO(meeting.startDatetime), day)
                ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
