import React from "react";
import Day from "./day";
import { getWeek } from "../utils";

export default function Week({
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
}) {
  const week = getWeek(currentDate);

  return (
    <div className="flex-1 grid grid-cols-7 gap-0">
      {week.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day
              fetchEvents={fetchEvents}
              day={day}
              key={idx}
              rowIdx={i}
              savedEvents={savedEvents}
              deleteAppointment={deleteAppointment}
              isWeek
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
