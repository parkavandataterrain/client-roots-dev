import React, { useState, useCallback } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "./CalendarStyles.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const CalendarCard = React.memo(() => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Memoized event handler using useCallback
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    const today = new Date();
    // if (dayjs(newDate).isSame(today, "day")) {
    //   // If selected date is today's date, navigate to "/calendar"
    //   navigate("/calendar");
    // }
    navigate("/calendar");
  }, [navigate]); // Dependency array ensures useCallback memoization

  return (
    <>
      <div className="bg-white shadow-md rounded-md w-full text-xs border p-[20px] lg:col-span-3 col-span-8">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            className="date-picker w-100"
            defaultValue={dayjs(selectedDate)}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </div>
    </>
  );
});

export default CalendarCard;
