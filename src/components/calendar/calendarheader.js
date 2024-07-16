import dayjs from "dayjs";

const CalendarHeader = ({
  viewList,
  currentCalendarView,
  handleCalendarView,
  onIncrement,
  onDecrement,
  currentDate,
}) => {
  const calendarLabelDisplay = () => {
    if (currentCalendarView === "Month") {
      return dayjs(currentDate).format("MMM YYYY");
    }

    if (currentCalendarView === "Week") {
      let startOfWeek = dayjs(currentDate).startOf("week");
      let endOfWeek = dayjs(startOfWeek).add(6, "day");

      return `${dayjs(startOfWeek).format("DD MMM YY")} - ${dayjs(
        endOfWeek
      ).format("DD MMM YY")}`;
    }

    if (currentCalendarView === "Year") {
      return dayjs(currentDate).format("YYYY");
    }
  };

  return (
    <div className="flex flex-row bg-white justify-between items-start">
      <div className="flex flex-row p-2 space-x-5">
        {viewList.map((view, idx) => {
          return (
            <p
              key={view + idx}
              onClick={() => handleCalendarView(view)}
              className={`${
                view === currentCalendarView
                  ? "border-b-2 border-teal-600 text-teal-600 text-xs"
                  : "text-xs"
              }
                   cursor-pointer`}
            >
              {view}
            </p>
          );
        })}
      </div>
      {currentCalendarView !== "Today" && (
        <div className="flex flex-row items-center space-x-3 p-2 rounded shadow-sm w-fit">
          <button
            onClick={onDecrement}
            className="text-teal-600 hover:bg-teal-600 hover:text-white p-1 py-0 rounded-md"
          >{`<`}</button>
          <div className="text-center text-teal-600 text-xs">
            {calendarLabelDisplay()}
          </div>
          <button
            onClick={onIncrement}
            className="text-teal-600 hover:bg-teal-600 hover:text-white p-1 py-0 rounded-md"
          >{`>`}</button>
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
