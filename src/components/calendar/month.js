import React from "react";
import Day from "./day";
import { getMonth } from "../utils";
export default function Month({
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
}) {
  const month = getMonth(currentDate);
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-0">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day
              fetchEvents={fetchEvents}
              day={day}
              key={idx}
              rowIdx={i}
              savedEvents={savedEvents}
              deleteAppointment={deleteAppointment}
              isMonth
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
